from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import UserRateThrottle
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
import hashlib
import jwt
from decouple import config

from .groq_service import GroqService
from email_checker.mongo_auth import MongoUserManager


class ContentGeneratorThrottle(UserRateThrottle):
    """3 requests per minute for content generation"""
    rate = '3/min'


class ContentGeneratorViewSet(viewsets.ViewSet):
    """
    ViewSet for AI Content Generation using Groq API (ultra-fast)
    Rate limit: 3 requests per minute
    """
    permission_classes = [AllowAny]
    throttle_classes = [ContentGeneratorThrottle]

    def _get_user_from_token(self, request):
        """Extract user from JWT token"""
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, config('SECRET_KEY'), algorithms=['HS256'])
            user_id = payload.get('user_id')
            if user_id:
                user_manager = MongoUserManager()
                return user_manager.get_user_by_id(user_id)
        except:
            pass
        return None

    def _check_and_consume_credit(self, user):
        """Check if user has credits and consume one"""
        if not user:
            return False, "Authentication required"

        user_manager = MongoUserManager()
        profile = user.get('profile', {})
        credits_remaining = profile.get('credits_remaining', 0)

        if credits_remaining < 1:
            return False, "Insufficient credits. Credits will reset next month."

        # Consume one credit
        try:
            user_manager.use_credits(user['_id'], 1)
            return True, None
        except Exception as e:
            return False, str(e)

    @action(detail=False, methods=['post'], url_path='generate')
    def generate_content(self, request):
        """
        Generate content using Groq AI

        POST /api/content-generator/generate/
        Headers: Authorization: Bearer <token> (required for authenticated users)

        Body:
        {
            "content_type": "product-title",  // required
            "product_name": "Email Validator", // required for most types
            "product_features": "Real-time validation...", // optional
            "target_audience": "Digital marketers", // optional
            "tone": "professional", // optional: professional|casual|enthusiastic|formal
            "language": "en", // optional: en|fr
            "additional_context": "..." // optional
        }

        Response:
        {
            "success": true,
            "content": "Generated content here...",
            "model": "llama-3.1-8b-instant",
            "metadata": {
                "content_type": "product-title",
                "tone": "professional",
                "language": "en",
                "character_count": 45
            }
        }
        """
        try:
            # Check if user is authenticated and has credits
            user = self._get_user_from_token(request)
            if user:
                # Authenticated user - check and consume credit
                has_credit, error_msg = self._check_and_consume_credit(user)
                if not has_credit:
                    return Response(
                        {
                            'success': False,
                            'error': error_msg
                        },
                        status=status.HTTP_402_PAYMENT_REQUIRED
                    )

            # Validate required fields
            content_type = request.data.get('content_type')
            if not content_type:
                return Response(
                    {
                        'success': False,
                        'error': 'content_type is required'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Valid content types
            valid_content_types = [
                'product-title',
                'meta-description',
                'product-description',
                'linkedin-post',
                'facebook-post',
                'instagram-post',
                'tiktok-post',
                'email-subject',
                'email-body',
            ]

            if content_type not in valid_content_types:
                return Response(
                    {
                        'success': False,
                        'error': f'Invalid content_type. Must be one of: {", ".join(valid_content_types)}'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate product_name (required for most content types)
            product_name = request.data.get('product_name')
            if not product_name and content_type != 'email-body':
                return Response(
                    {
                        'success': False,
                        'error': 'product_name is required for this content type'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get optional parameters
            product_features = request.data.get('product_features')
            target_audience = request.data.get('target_audience')
            tone = request.data.get('tone', 'professional')
            language = request.data.get('language', 'en')
            additional_context = request.data.get('additional_context')

            # Validate tone
            valid_tones = ['professional', 'casual', 'enthusiastic', 'formal']
            if tone not in valid_tones:
                tone = 'professional'

            # Validate language
            valid_languages = ['en', 'fr']
            if language not in valid_languages:
                language = 'en'

            # Initialize Groq service
            try:
                content_service = GroqService()
            except ValueError as e:
                return Response(
                    {
                        'success': False,
                        'error': 'Groq API not configured'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Generate content using Groq
            result = content_service.generate_content(
                content_type=content_type,
                product_name=product_name,
                product_features=product_features,
                target_audience=target_audience,
                tone=tone,
                language=language,
                additional_context=additional_context
            )

            if not result['success']:
                return Response(
                    {
                        'success': False,
                        'error': result.get('error', 'Failed to generate content')
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Return successful response
            response_data = {
                'success': True,
                'content': result['content'],
                'model': result['model'],
                'provider': 'groq',
                'metadata': {
                    'content_type': content_type,
                    'tone': tone,
                    'language': language,
                    'character_count': len(result['content'])
                }
            }

            return Response(
                response_data,
                status=status.HTTP_200_OK,
                headers={
                    'X-RateLimit-Remaining': str(remaining)
                }
            )

        except Exception as e:
            return Response(
                {
                    'success': False,
                    'error': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='types')
    def get_content_types(self, request):
        """
        Get list of available content types

        GET /api/content-generator/types/

        Response:
        {
            "content_types": [
                {
                    "id": "product-title",
                    "name": "Product Title",
                    "description": "SEO-optimized product title (max 60 chars)"
                },
                ...
            ]
        }
        """
        content_types = [
            {
                'id': 'product-title',
                'name': 'Product Title',
                'description': 'SEO-optimized product title (max 60 characters)',
                'category': 'product'
            },
            {
                'id': 'meta-description',
                'name': 'Meta Description',
                'description': 'Meta description for SEO (150-160 characters)',
                'category': 'product'
            },
            {
                'id': 'product-description',
                'name': 'Product Description',
                'description': 'Detailed product description (150-200 words)',
                'category': 'product'
            },
            {
                'id': 'linkedin-post',
                'name': 'LinkedIn Post',
                'description': 'Professional LinkedIn post with hashtags',
                'category': 'social'
            },
            {
                'id': 'facebook-post',
                'name': 'Facebook Post',
                'description': 'Engaging Facebook post',
                'category': 'social'
            },
            {
                'id': 'instagram-post',
                'name': 'Instagram Post',
                'description': 'Instagram caption with emojis and hashtags',
                'category': 'social'
            },
            {
                'id': 'tiktok-post',
                'name': 'TikTok Post',
                'description': 'TikTok video caption with trending hashtags',
                'category': 'social'
            },
            {
                'id': 'email-subject',
                'name': 'Email Subject',
                'description': 'Email subject line (max 50 characters)',
                'category': 'email'
            },
            {
                'id': 'email-body',
                'name': 'Email Body',
                'description': 'Email body content (150-200 words)',
                'category': 'email'
            },
        ]

        return Response({
            'content_types': content_types,
            'tones': ['professional', 'casual', 'enthusiastic', 'formal'],
            'languages': ['en', 'fr']
        })
