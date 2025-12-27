from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import serializers

from .tools.spf_checker import SPFChecker
from .tools.dmarc_checker import DMARCChecker
from .tools.dns_checker import DNSChecker
from .tools.header_analyzer import EmailHeaderAnalyzer
from .tools.phishing_checker import PhishingChecker
from .tools.txt_checker import TXTChecker


# Serializers
class DomainCheckSerializer(serializers.Serializer):
    domain = serializers.CharField(required=True, max_length=255)


class URLCheckSerializer(serializers.Serializer):
    url = serializers.URLField(required=True)


class HeaderAnalyzerSerializer(serializers.Serializer):
    headers = serializers.CharField(required=True, allow_blank=False)


# ViewSets
class SecurityToolsViewSet(viewsets.ViewSet):
    """
    ViewSet for email security tools
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='spf-check')
    def spf_check(self, request):
        """
        Check SPF record for a domain
        POST /api/tools/spf-check/
        Body: { "domain": "example.com" }
        """
        serializer = DomainCheckSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        domain = serializer.validated_data['domain']

        checker = SPFChecker()
        result = checker.check_spf(domain)

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='dmarc-check')
    def dmarc_check(self, request):
        """
        Check DMARC record for a domain
        POST /api/tools/dmarc-check/
        Body: { "domain": "example.com" }
        """
        serializer = DomainCheckSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        domain = serializer.validated_data['domain']

        checker = DMARCChecker()
        result = checker.check_dmarc(domain)

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='dns-check')
    def dns_check(self, request):
        """
        Check DNS records for a domain
        POST /api/tools/dns-check/
        Body: { "domain": "example.com" }
        """
        serializer = DomainCheckSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        domain = serializer.validated_data['domain']

        checker = DNSChecker()
        result = checker.check_dns(domain)

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='header-analyze')
    def header_analyze(self, request):
        """
        Analyze email headers
        POST /api/tools/header-analyze/
        Body: { "headers": "Received: from ...\nFrom: ..." }
        """
        serializer = HeaderAnalyzerSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        headers = serializer.validated_data['headers']

        analyzer = EmailHeaderAnalyzer()
        result = analyzer.analyze_headers(headers)

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='phishing-check')
    def phishing_check(self, request):
        """
        Check if URL is potentially phishing
        POST /api/tools/phishing-check/
        Body: { "url": "https://example.com/login" }
        """
        serializer = URLCheckSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        url = serializer.validated_data['url']

        checker = PhishingChecker()
        result = checker.check_url(url)

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='txt-check')
    def txt_check(self, request):
        """
        Check TXT records for a domain
        POST /api/tools/txt-check/
        Body: { "domain": "example.com" }
        """
        serializer = DomainCheckSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        domain = serializer.validated_data['domain']

        checker = TXTChecker()
        result = checker.check_txt(domain)

        return Response(result, status=status.HTTP_200_OK)
