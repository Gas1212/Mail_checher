from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
import hashlib

from .hybrid_service import HybridContentService


class ContentGeneratorViewSet(viewsets.ViewSet):
    """
    ViewSet for AI Content Generation using Hugging Face
    """
    permission_classes = [AllowAny]

    # Rate limiting configuration
    RATE_LIMIT = 30  # requests per hour
    RATE_LIMIT_WINDOW = 3600  # 1 hour in seconds

    def _get_client_ip(self, request):
        """Get client IP address for rate limiting"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def _check_rate_limit(self, request):
        """Check if client has exceeded rate limit"""
        ip = self._get_client_ip(request)
        cache_key = f'content_gen_rate_limit_{ip}'

        # Get current count from cache
        request_data = cache.get(cache_key)

        if request_data is None:
            # First request, initialize counter
            cache.set(cache_key, {'count': 1, 'reset_time': timezone.now() + timedelta(seconds=self.RATE_LIMIT_WINDOW)}, self.RATE_LIMIT_WINDOW)
            return True, self.RATE_LIMIT - 1

        # Check if window has expired
        if timezone.now() > request_data['reset_time']:
            # Reset counter
            cache.set(cache_key, {'count': 1, 'reset_time': timezone.now() + timedelta(seconds=self.RATE_LIMIT_WINDOW)}, self.RATE_LIMIT_WINDOW)
            return True, self.RATE_LIMIT - 1

        # Check if limit exceeded
        if request_data['count'] >= self.RATE_LIMIT:
            return False, 0

        # Increment counter
        request_data['count'] += 1
        cache.set(cache_key, request_data, self.RATE_LIMIT_WINDOW)
        return True, self.RATE_LIMIT - request_data['count']

    @action(detail=False, methods=['post'], url_path='generate')
    def generate_content(self, request):
        """
        Generate content using Hugging Face AI models

        POST /api/content-generator/generate/

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
            "model": "meta-llama/Meta-Llama-3.1-8B-Instruct",
            "metadata": {
                "content_type": "product-title",
                "tone": "professional",
                "language": "en",
                "character_count": 45
            }
        }
        """
        try:
            # Check rate limit
            allowed, remaining = self._check_rate_limit(request)
            if not allowed:
                return Response(
                    {
                        'success': False,
                        'error': 'Rate limit exceeded. Please try again later.'
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS
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

            # Initialize Hybrid service (Groq + HuggingFace)
            try:
                content_service = HybridContentService()
            except ValueError as e:
                return Response(
                    {
                        'success': False,
                        'error': 'AI service not configured'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Generate content using hybrid approach
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

            # Return successful response with provider info
            response_data = {
                'success': True,
                'content': result['content'],
                'model': result['model'],
                'provider': result.get('provider', 'unknown'),  # 'groq' or 'huggingface'
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
