"""
Authentication views using MongoDB
"""

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import serializers
from .mongo_auth import MongoUserManager, generate_tokens, verify_token
from datetime import datetime


# Serializers
class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, min_length=8, write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    job_title = serializers.CharField(required=False, allow_blank=True)
    company = serializers.CharField(required=False, allow_blank=True)
    industry = serializers.CharField(required=False, allow_blank=True)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class GoogleAuthSerializer(serializers.Serializer):
    google_id = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.URLField(required=False, allow_blank=True)


class UserUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    job_title = serializers.CharField(required=False)
    company = serializers.CharField(required=False)
    industry = serializers.CharField(required=False)


def serialize_user(user: dict) -> dict:
    """Serialize user document for API response"""
    if not user:
        return None

    return {
        'id': user['_id'],
        'email': user['email'],
        'first_name': user.get('first_name', ''),
        'last_name': user.get('last_name', ''),
        'job_title': user.get('job_title', ''),
        'company': user.get('company', ''),
        'industry': user.get('industry', ''),
        'profile_picture': user.get('profile_picture', ''),
        'is_verified': user.get('is_verified', False),
        'date_joined': user.get('date_joined').isoformat() if user.get('date_joined') else None
    }


def serialize_profile(profile: dict) -> dict:
    """Serialize profile document for API response"""
    if not profile:
        return None

    return {
        'total_checks': profile.get('total_checks', 0),
        'checks_this_month': profile.get('checks_this_month', 0),
        'api_calls': profile.get('api_calls', 0),
        'plan_type': profile.get('plan_type', 'free'),
        'credits_remaining': profile.get('credits_remaining', 0),
        'credits_used': profile.get('credits_used', 0)
    }


# Custom permission for authenticated users
class IsAuthenticatedMongo:
    """
    Custom permission to check MongoDB JWT authentication
    """
    def has_permission(self, request, view):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if not auth_header.startswith('Bearer '):
            return False

        token = auth_header.split(' ')[1]

        try:
            payload = verify_token(token)
            request.user_id = payload['user_id']
            return True
        except Exception:
            return False


# ViewSet
class AuthViewSet(viewsets.ViewSet):
    """
    Authentication endpoints using MongoDB
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        """
        Register a new user
        POST /api/auth/register/
        """
        serializer = UserRegistrationSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data
        user_manager = MongoUserManager()

        try:
            user = user_manager.create_user(
                email=data['email'],
                password=data['password'],
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                job_title=data.get('job_title', ''),
                company=data.get('company', ''),
                industry=data.get('industry', ''),
            )

            tokens = generate_tokens(user['_id'])

            return Response({
                'user': serialize_user(user),
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        """
        Login user
        POST /api/auth/login/
        """
        serializer = UserLoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user_manager = MongoUserManager()

        try:
            user = user_manager.authenticate(email, password)
            tokens = generate_tokens(user['_id'])

            return Response({
                'user': serialize_user(user),
                'tokens': tokens
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )

    @action(detail=False, methods=['post'], url_path='google')
    def google_auth(self, request):
        """
        Google OAuth authentication
        POST /api/auth/google/
        """
        serializer = GoogleAuthSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data
        user_manager = MongoUserManager()

        try:
            # Check if user exists with this Google ID
            user = user_manager.get_user_by_google_id(data['google_id'])

            if user:
                # Update last login
                user_manager.users.update_one(
                    {'_id': user['_id']},
                    {'$set': {'last_login': datetime.utcnow()}}
                )
            else:
                # Check if user exists with this email
                user = user_manager.get_user_by_email(data['email'])

                if user:
                    # Link Google account to existing user
                    user = user_manager.link_google_account(
                        user['_id'],
                        data['google_id'],
                        data.get('profile_picture', '')
                    )
                else:
                    # Create new user
                    user = user_manager.create_user(
                        email=data['email'],
                        first_name=data.get('first_name', ''),
                        last_name=data.get('last_name', ''),
                        google_id=data['google_id'],
                        profile_picture=data.get('profile_picture', ''),
                        is_verified=True,  # Google accounts are pre-verified
                    )

            tokens = generate_tokens(user['_id'])

            return Response({
                'user': serialize_user(user),
                'tokens': tokens
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticatedMongo])
    def get_current_user(self, request):
        """
        Get current user info
        GET /api/auth/me/
        Requires: Authorization: Bearer <token>
        """
        user_manager = MongoUserManager()

        try:
            user = user_manager.get_user_by_id(request.user_id)

            # Check and reset monthly credits if needed
            profile = user_manager.check_and_reset_monthly_credits(request.user_id)

            if not user:
                return Response(
                    {'error': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            return Response({
                'user': serialize_user(user),
                'profile': serialize_profile(profile),
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['put'], url_path='update-profile', permission_classes=[IsAuthenticatedMongo])
    def update_profile(self, request):
        """
        Update user profile
        PUT /api/auth/update-profile/
        Requires: Authorization: Bearer <token>
        """
        serializer = UserUpdateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_manager = MongoUserManager()

        try:
            user = user_manager.update_user(request.user_id, **serializer.validated_data)

            return Response({
                'user': serialize_user(user),
                'message': 'Profile updated successfully'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
