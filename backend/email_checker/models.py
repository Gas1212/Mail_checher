"""
User and profile models for authentication
Uses MongoDB for storage via pymongo
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from datetime import datetime
import uuid


class UserManager(BaseUserManager):
    """Manager for custom user model"""

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user"""
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    job_title = models.CharField(max_length=255, blank=True)
    company = models.CharField(max_length=255, blank=True)
    industry = models.CharField(max_length=255, blank=True)

    # OAuth fields
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    profile_picture = models.URLField(blank=True)

    # Account status
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    # Timestamps
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def __str__(self):
        return self.email

    def get_full_name(self):
        """Return full name"""
        return f"{self.first_name} {self.last_name}".strip() or self.email

    def get_short_name(self):
        """Return short name"""
        return self.first_name or self.email


class UserProfile(models.Model):
    """
    Extended user profile stored in MongoDB
    """
    user_id = models.UUIDField(unique=True)

    # Usage statistics
    total_checks = models.IntegerField(default=0)
    checks_this_month = models.IntegerField(default=0)
    api_calls = models.IntegerField(default=0)

    # Plan information
    plan_type = models.CharField(max_length=50, default='free')  # free, starter, professional, enterprise
    credits_remaining = models.IntegerField(default=100)  # Free tier gets 100 checks
    credits_used = models.IntegerField(default=0)

    # Preferences
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    notifications_enabled = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_profiles'

    def __str__(self):
        return f"Profile for {self.user_id}"
