from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from .models import EmailValidation, DisposableEmailDomain
from .serializers import (
    EmailValidationSerializer,
    EmailCheckRequestSerializer,
    DisposableEmailDomainSerializer
)
from .validators import EmailValidator


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class EmailValidationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for email validation operations
    """
    queryset = EmailValidation.objects.all()
    serializer_class = EmailValidationSerializer
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

        email_validation = EmailValidation.objects.create(
            email=email,
            is_valid_syntax=validation_result['is_valid_syntax'],
            is_valid_dns=validation_result['is_valid_dns'],
            is_valid_smtp=validation_result['is_valid_smtp'],
            is_disposable=validation_result['is_disposable'],
            mx_records=validation_result['mx_records'],
            validation_message=validation_result['validation_message'],
            ip_address=get_client_ip(request),
            created_at=timezone.now()
        )

        response_data = EmailValidationSerializer(email_validation).data
        response_data['details'] = validation_result['details']

        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='history')
    def get_history(self, request):
        """
        Get validation history
        GET /api/emails/history/?limit=10
        """
        limit = int(request.query_params.get('limit', 50))
        validations = self.queryset[:limit]
        serializer = self.serializer_class(validations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        """
        Get validation statistics
        GET /api/emails/stats/
        """
        total = self.queryset.count()
        valid = self.queryset.filter(
            is_valid_syntax=True,
            is_valid_dns=True
        ).count()
        disposable = self.queryset.filter(is_disposable=True).count()

        stats = {
            'total_validations': total,
            'valid_emails': valid,
            'disposable_emails': disposable,
            'valid_percentage': round((valid / total * 100) if total > 0 else 0, 2)
        }

        return Response(stats, status=status.HTTP_200_OK)


class DisposableEmailDomainViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing disposable email domains
    """
    queryset = DisposableEmailDomain.objects.all()
    serializer_class = DisposableEmailDomainSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='bulk-add')
    def bulk_add_domains(self, request):
        """
        Bulk add disposable domains
        POST /api/disposable-domains/bulk-add/
        Body: { "domains": ["domain1.com", "domain2.com"] }
        """
        domains = request.data.get('domains', [])

        if not isinstance(domains, list):
            return Response(
                {'error': 'domains must be a list'},
                status=status.HTTP_400_BAD_REQUEST
            )

        added = 0
        skipped = 0

        for domain in domains:
            _, created = DisposableEmailDomain.objects.get_or_create(
                domain=domain.lower(),
                defaults={'is_active': True}
            )
            if created:
                added += 1
            else:
                skipped += 1

        return Response(
            {'added': added, 'skipped': skipped},
            status=status.HTTP_201_CREATED
        )
