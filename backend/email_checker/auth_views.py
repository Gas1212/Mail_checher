"""
Authentication views for user registration and login
"""

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User, UserProfile
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


class UserSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    job_title = serializers.CharField()
    company = serializers.CharField()
    industry = serializers.CharField()
    profile_picture = serializers.URLField()
    is_verified = serializers.BooleanField()
    date_joined = serializers.DateTimeField()


class UserProfileSerializer(serializers.Serializer):
    total_checks = serializers.IntegerField()
    checks_this_month = serializers.IntegerField()
    plan_type = serializers.CharField()
    credits_remaining = serializers.IntegerField()
    credits_used = serializers.IntegerField()


# ViewSet
class AuthViewSet(viewsets.ViewSet):
    """
    Authentication endpoints
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

        # Check if user already exists
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'error': 'User with this email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        user = User.objects.create_user(
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            job_title=data.get('job_title', ''),
            company=data.get('company', ''),
            industry=data.get('industry', ''),
        )

        # Create user profile
        UserProfile.objects.create(
            user_id=user.id,
            plan_type='free',
            credits_remaining=100
        )

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

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

        user = authenticate(email=email, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Update last login
        user.last_login = datetime.now()
        user.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)

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

        # Check if user exists with this Google ID
        user = User.objects.filter(google_id=data['google_id']).first()

        if user:
            # Update last login
            user.last_login = datetime.now()
            user.save()
        else:
            # Check if user exists with this email
            user = User.objects.filter(email=data['email']).first()

            if user:
                # Link Google account to existing user
                user.google_id = data['google_id']
                user.profile_picture = data.get('profile_picture', '')
                user.save()
            else:
                # Create new user
                user = User.objects.create_user(
                    email=data['email'],
                    first_name=data.get('first_name', ''),
                    last_name=data.get('last_name', ''),
                    google_id=data['google_id'],
                    profile_picture=data.get('profile_picture', ''),
                    is_verified=True,  # Google accounts are pre-verified
                )

                # Create user profile
                UserProfile.objects.create(
                    user_id=user.id,
                    plan_type='free',
                    credits_remaining=100
                )

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def get_current_user(self, request):
        """
        Get current user info
        GET /api/auth/me/
        """
        user = request.user
        profile = UserProfile.objects.filter(user_id=user.id).first()

        return Response({
            'user': UserSerializer(user).data,
            'profile': UserProfileSerializer(profile).data if profile else None,
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['put'], url_path='update-profile', permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """
        Update user profile
        PUT /api/auth/update-profile/
        """
        user = request.user
        data = request.data

        # Update user fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'job_title' in data:
            user.job_title = data['job_title']
        if 'company' in data:
            user.company = data['company']
        if 'industry' in data:
            user.industry = data['industry']

        user.save()

        return Response({
            'user': UserSerializer(user).data,
            'message': 'Profile updated successfully'
        }, status=status.HTTP_200_OK)
