from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import EmailCheckRequestSerializer
from .validators import EmailValidator
from .db import save_validation, get_validation_history, get_validation_stats


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class EmailValidationViewSet(viewsets.ViewSet):
    """
    ViewSet for email validation operations
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='check')
    def check_email(self, request):
        """
        Check and validate an email address
        POST /api/emails/check/
        Body: { "email": "test@example.com", "check_smtp": true }
        """
        serializer = EmailCheckRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data['email']
        check_smtp = serializer.validated_data.get('check_smtp', True)

        validator = EmailValidator()
        validation_result = validator.validate_email_complete(email, check_smtp)

        # Save to MongoDB
        email_validation = save_validation(
            email=email,
            validation_result=validation_result,
            ip_address=get_client_ip(request)
        )

        response_data = {
            'email': email_validation['email'],
            'is_valid_syntax': email_validation['is_valid_syntax'],
            'is_valid_dns': email_validation['is_valid_dns'],
            'is_valid_smtp': email_validation['is_valid_smtp'],
            'is_disposable': email_validation['is_disposable'],
            'mx_records': email_validation['mx_records'],
            'validation_message': email_validation['validation_message'],
            'created_at': email_validation['created_at'].isoformat(),
            'details': validation_result['details']
        }

        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='history')
    def get_history(self, request):
        """
        Get validation history
        GET /api/emails/history/?limit=10
        """
        limit = int(request.query_params.get('limit', 50))
        validations = get_validation_history(limit)

        # Format dates
        for v in validations:
            if 'created_at' in v and v['created_at']:
                v['created_at'] = v['created_at'].isoformat()

        return Response(validations, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        """
        Get validation statistics
        GET /api/emails/stats/
        """
        stats = get_validation_stats()
        return Response(stats, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='bulk-validate')
    def bulk_validate(self, request):
        """
        Validate email without saving to database (for bulk operations)
        POST /api/emails/bulk-validate/
        Body: { "email": "test@example.com", "check_smtp": true }
        Requires authentication and deducts 1 credit per validation
        """
        from rest_framework.permissions import IsAuthenticated
        from .mongo_auth import verify_token
        from .db import get_db

        # Check authentication
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token = auth_header.split(' ')[1]
        try:
            payload = verify_token(token)
            user_id = payload.get('user_id')
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Validate request
        serializer = EmailCheckRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check and reset monthly credits if needed, then get profile
        from .mongo_auth import MongoUserManager
        user_manager = MongoUserManager()
        profile = user_manager.check_and_reset_monthly_credits(user_id)

        if not profile:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        credits_remaining = profile.get('credits_remaining', 0)
        if credits_remaining < 1:
            return Response(
                {'error': 'Insufficient credits. Please purchase more credits.'},
                status=status.HTTP_402_PAYMENT_REQUIRED
            )

        # Deduct 1 credit
        user_manager.profiles.update_one(
            {'user_id': user_id},
            {
                '$inc': {
                    'credits_remaining': -1,
                    'credits_used': 1,
                    'total_checks': 1,
                    'checks_this_month': 1
                }
            }
        )

        # Perform validation
        email = serializer.validated_data['email']
        check_smtp = serializer.validated_data.get('check_smtp', True)

        validator = EmailValidator()
        validation_result = validator.validate_email_complete(email, check_smtp)

        # DO NOT save to database - just return validation result
        response_data = {
            'email': email,
            'is_valid': validation_result['is_valid_syntax'] and validation_result['is_valid_dns'],
            'is_valid_syntax': validation_result['is_valid_syntax'],
            'is_valid_dns': validation_result['is_valid_dns'],
            'is_valid_smtp': validation_result.get('is_valid_smtp', False),
            'is_disposable': validation_result.get('is_disposable', False),
            'domain': validation_result.get('domain', ''),
            'mx_records': validation_result.get('mx_records', []),
            'validation_message': validation_result.get('message', ''),
            'details': validation_result.get('details', {})
        }

        return Response(response_data, status=status.HTTP_200_OK)


# DisposableEmailDomainViewSet removed - not needed for MVP
# Disposable email detection is handled via external API in validators.py
