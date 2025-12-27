"""
MongoDB-based user authentication system
All user data stored in MongoDB
"""

from .db import get_db
from datetime import datetime, timedelta
import hashlib
import uuid
import jwt
from decouple import config


def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed


def generate_tokens(user_id: str) -> dict:
    """Generate JWT access and refresh tokens"""
    secret = config('SECRET_KEY', default='your-secret-key-change-in-production')

    # Access token (15 minutes)
    access_payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(minutes=15),
        'type': 'access'
    }
    access_token = jwt.encode(access_payload, secret, algorithm='HS256')

    # Refresh token (7 days)
    refresh_payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7),
        'type': 'refresh'
    }
    refresh_token = jwt.encode(refresh_payload, secret, algorithm='HS256')

    return {
        'access': access_token,
        'refresh': refresh_token
    }


def verify_token(token: str) -> dict:
    """Verify JWT token and return payload"""
    try:
        secret = config('SECRET_KEY', default='your-secret-key-change-in-production')
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception('Token has expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')


class MongoUserManager:
    """MongoDB user management"""

    def __init__(self):
        self.db = get_db()
        self.users = self.db['users']
        self.profiles = self.db['user_profiles']

        # Create indexes
        self.users.create_index('email', unique=True)
        self.users.create_index('google_id', unique=True, sparse=True)

    def create_user(self, email: str, password: str = None, **kwargs) -> dict:
        """
        Create a new user

        Args:
            email: User email
            password: User password (optional for OAuth)
            **kwargs: Additional user fields (first_name, last_name, etc.)

        Returns:
            Created user document
        """
        # Check if user exists
        if self.users.find_one({'email': email}):
            raise Exception('User with this email already exists')

        user_id = str(uuid.uuid4())

        user_doc = {
            '_id': user_id,
            'email': email,
            'first_name': kwargs.get('first_name', ''),
            'last_name': kwargs.get('last_name', ''),
            'job_title': kwargs.get('job_title', ''),
            'company': kwargs.get('company', ''),
            'industry': kwargs.get('industry', ''),
            'profile_picture': kwargs.get('profile_picture', ''),
            'is_active': True,
            'is_verified': kwargs.get('is_verified', False),
            'date_joined': datetime.utcnow(),
            'last_login': None
        }

        # Only add google_id if it exists
        if kwargs.get('google_id'):
            user_doc['google_id'] = kwargs.get('google_id')

        if password:
            user_doc['password'] = hash_password(password)

        self.users.insert_one(user_doc)

        # Create user profile
        profile_doc = {
            '_id': str(uuid.uuid4()),
            'user_id': user_id,
            'total_checks': 0,
            'checks_this_month': 0,
            'api_calls': 0,
            'plan_type': 'free',
            'credits_remaining': 100,
            'credits_used': 0,
            'timezone': 'UTC',
            'language': 'en',
            'notifications_enabled': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        self.profiles.insert_one(profile_doc)

        # Remove password from return
        user_doc.pop('password', None)
        return user_doc

    def authenticate(self, email: str, password: str) -> dict:
        """
        Authenticate user with email and password

        Args:
            email: User email
            password: User password

        Returns:
            User document if authenticated

        Raises:
            Exception if authentication fails
        """
        user = self.users.find_one({'email': email})

        if not user:
            raise Exception('Invalid credentials')

        if 'password' not in user:
            raise Exception('Please sign in with Google')

        if not verify_password(password, user['password']):
            raise Exception('Invalid credentials')

        if not user.get('is_active', True):
            raise Exception('Account is disabled')

        # Update last login
        self.users.update_one(
            {'_id': user['_id']},
            {'$set': {'last_login': datetime.utcnow()}}
        )

        # Remove password from return
        user.pop('password', None)
        return user

    def get_user_by_id(self, user_id: str) -> dict:
        """Get user by ID"""
        user = self.users.find_one({'_id': user_id})
        if user:
            user.pop('password', None)
        return user

    def get_user_by_email(self, email: str) -> dict:
        """Get user by email"""
        user = self.users.find_one({'email': email})
        if user:
            user.pop('password', None)
        return user

    def get_user_by_google_id(self, google_id: str) -> dict:
        """Get user by Google ID"""
        user = self.users.find_one({'google_id': google_id})
        if user:
            user.pop('password', None)
        return user

    def update_user(self, user_id: str, **kwargs) -> dict:
        """Update user fields"""
        allowed_fields = ['first_name', 'last_name', 'job_title', 'company', 'industry', 'profile_picture']
        update_data = {k: v for k, v in kwargs.items() if k in allowed_fields}

        if update_data:
            self.users.update_one(
                {'_id': user_id},
                {'$set': update_data}
            )

        return self.get_user_by_id(user_id)

    def link_google_account(self, user_id: str, google_id: str, profile_picture: str = '') -> dict:
        """Link Google account to existing user"""
        self.users.update_one(
            {'_id': user_id},
            {'$set': {
                'google_id': google_id,
                'profile_picture': profile_picture,
                'is_verified': True
            }}
        )
        return self.get_user_by_id(user_id)

    def get_user_profile(self, user_id: str) -> dict:
        """Get user profile"""
        return self.profiles.find_one({'user_id': user_id})

    def update_user_profile(self, user_id: str, **kwargs) -> dict:
        """Update user profile"""
        update_data = kwargs.copy()
        update_data['updated_at'] = datetime.utcnow()

        self.profiles.update_one(
            {'user_id': user_id},
            {'$set': update_data}
        )

        return self.get_user_profile(user_id)

    def increment_checks(self, user_id: str):
        """Increment user check counters"""
        self.profiles.update_one(
            {'user_id': user_id},
            {
                '$inc': {
                    'total_checks': 1,
                    'checks_this_month': 1,
                    'credits_used': 1
                },
                '$set': {'updated_at': datetime.utcnow()}
            }
        )

    def deduct_credits(self, user_id: str, amount: int = 1):
        """Deduct credits from user"""
        self.profiles.update_one(
            {'user_id': user_id},
            {
                '$inc': {'credits_remaining': -amount},
                '$set': {'updated_at': datetime.utcnow()}
            }
        )
