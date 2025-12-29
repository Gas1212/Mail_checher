from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import EmailCheckRequestSerializer
from .validators import EmailValidator
from .db import save_validation, get_validation_history, get_validation_stats
import dns.resolver
from datetime import datetime


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

    @action(detail=False, methods=['post'], url_path='mx-lookup')
    def mx_lookup(self, request):
        """
        MX Record Lookup - Get detailed MX records for a domain
        POST /api/emails/mx-lookup/
        Body: { "domain": "example.com" }
        Free tool - no authentication required
        """
        domain = request.data.get('domain', '').strip().lower()

        if not domain:
            return Response(
                {'error': 'Domain is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Clean domain (remove http://, www., etc.)
        domain = domain.replace('http://', '').replace('https://', '').replace('www.', '').split('/')[0]

        result = {
            'domain': domain,
            'mx_records': [],
            'has_mx': False,
            'mx_count': 0,
            'checked_at': datetime.utcnow().isoformat(),
            'error': None
        }

        try:
            # Get MX records
            mx_records_dns = dns.resolver.resolve(domain, 'MX')
            mx_list = []

            for r in mx_records_dns:
                mx_list.append({
                    'priority': r.preference,
                    'host': str(r.exchange).rstrip('.'),
                    'exchange': str(r.exchange)
                })

            # Sort by priority (lower is higher priority)
            mx_list.sort(key=lambda x: x['priority'])

            result['mx_records'] = mx_list
            result['has_mx'] = len(mx_list) > 0
            result['mx_count'] = len(mx_list)

            # Try to get A record for the domain
            try:
                a_records = dns.resolver.resolve(domain, 'A')
                result['a_records'] = [str(r) for r in a_records]
            except:
                result['a_records'] = []

            return Response(result, status=status.HTTP_200_OK)

        except dns.resolver.NXDOMAIN:
            result['error'] = 'Domain does not exist'
            return Response(result, status=status.HTTP_404_NOT_FOUND)
        except dns.resolver.NoAnswer:
            result['error'] = 'No MX records found for this domain'
            return Response(result, status=status.HTTP_404_NOT_FOUND)
        except dns.resolver.Timeout:
            result['error'] = 'DNS query timeout'
            return Response(result, status=status.HTTP_408_REQUEST_TIMEOUT)
        except Exception as e:
            result['error'] = f'DNS lookup error: {str(e)}'
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='detect-role-account')
    def detect_role_account(self, request):
        """
        Role Account Detector - Detect if an email is a role-based account
        POST /api/emails/detect-role-account/
        Body: { "email": "info@example.com" } or { "emails": ["info@example.com", "john@example.com"] }
        Free tool - no authentication required
        """
        email = request.data.get('email', '').strip().lower()
        emails = request.data.get('emails', [])

        # Role-based email patterns
        role_accounts = {
            'admin', 'administrator', 'info', 'support', 'contact', 'sales', 'marketing',
            'help', 'service', 'billing', 'office', 'team', 'hello', 'inquiry', 'enquiry',
            'webmaster', 'hostmaster', 'postmaster', 'abuse', 'noreply', 'no-reply',
            'security', 'privacy', 'legal', 'compliance', 'hr', 'careers', 'jobs',
            'press', 'media', 'news', 'feedback', 'suggestions', 'complaints',
            'accounts', 'finance', 'invoices', 'orders', 'shipping', 'returns',
            'tech', 'technical', 'it', 'itsupport', 'helpdesk', 'customerservice'
        }

        def check_role_email(email_address):
            if not email_address or '@' not in email_address:
                return {
                    'email': email_address,
                    'is_role_account': False,
                    'confidence': 0,
                    'detected_role': None,
                    'error': 'Invalid email format'
                }

            local_part = email_address.split('@')[0].lower()

            # Direct match
            if local_part in role_accounts:
                return {
                    'email': email_address,
                    'is_role_account': True,
                    'confidence': 100,
                    'detected_role': local_part,
                    'type': 'generic'
                }

            # Check for variations with dots, hyphens, underscores
            clean_local = local_part.replace('.', '').replace('-', '').replace('_', '')
            if clean_local in role_accounts:
                return {
                    'email': email_address,
                    'is_role_account': True,
                    'confidence': 95,
                    'detected_role': clean_local,
                    'type': 'generic_variation'
                }

            # Check for composite patterns (e.g., support.team, sales.inquiry)
            parts = local_part.replace('-', '.').replace('_', '.').split('.')
            for part in parts:
                if part in role_accounts:
                    return {
                        'email': email_address,
                        'is_role_account': True,
                        'confidence': 85,
                        'detected_role': part,
                        'type': 'composite'
                    }

            # Not a role account
            return {
                'email': email_address,
                'is_role_account': False,
                'confidence': 0,
                'detected_role': None,
                'type': 'personal'
            }

        # Handle single email
        if email:
            result = check_role_email(email)
            return Response(result, status=status.HTTP_200_OK)

        # Handle bulk emails
        if emails and isinstance(emails, list):
            results = []
            stats = {
                'total': len(emails),
                'role_accounts': 0,
                'personal_accounts': 0
            }

            for email_address in emails:
                result = check_role_email(email_address.strip().lower())
                results.append(result)
                if result['is_role_account']:
                    stats['role_accounts'] += 1
                else:
                    stats['personal_accounts'] += 1

            return Response({
                'results': results,
                'stats': stats
            }, status=status.HTTP_200_OK)

        return Response(
            {'error': 'Please provide either "email" or "emails" parameter'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['post'], url_path='clean-list')
    def clean_list(self, request):
        """
        List Cleaner & Deduplicator - Clean and deduplicate email lists
        POST /api/emails/clean-list/
        Body: { "emails": ["john@example.com", "JOHN@EXAMPLE.COM", "invalid-email", "john@example.com"] }
        Free tool - no authentication required
        """
        emails = request.data.get('emails', [])

        if not emails or not isinstance(emails, list):
            return Response(
                {'error': 'Please provide an array of emails'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Statistics
        stats = {
            'total_input': len(emails),
            'duplicates_removed': 0,
            'invalid_removed': 0,
            'valid_unique': 0
        }

        # Process emails
        seen = set()
        valid_emails = []
        duplicates = []
        invalid_emails = []

        # Simple email regex
        import re
        email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

        for email in emails:
            email_str = str(email).strip().lower()

            # Skip empty
            if not email_str:
                continue

            # Check if valid email format
            if not email_pattern.match(email_str):
                invalid_emails.append(email_str)
                stats['invalid_removed'] += 1
                continue

            # Check for duplicates
            if email_str in seen:
                duplicates.append(email_str)
                stats['duplicates_removed'] += 1
                continue

            # Add to valid list
            seen.add(email_str)
            valid_emails.append(email_str)

        stats['valid_unique'] = len(valid_emails)

        return Response({
            'cleaned_emails': valid_emails,
            'duplicates': list(set(duplicates)),
            'invalid': invalid_emails,
            'stats': stats
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='generate-spf')
    def generate_spf(self, request):
        """
        SPF Record Generator - Generate SPF records for email authentication
        POST /api/emails/generate-spf/
        Body: {
            "domain": "example.com",
            "include_domains": ["_spf.google.com", "_spf.microsoft.com"],
            "ip4_addresses": ["192.168.1.1"],
            "ip6_addresses": [],
            "a_record": true,
            "mx_record": true,
            "policy": "~all"  # -all, ~all, ?all
        }
        Free tool - no authentication required
        """
        domain = request.data.get('domain', '').strip()
        include_domains = request.data.get('include_domains', [])
        ip4_addresses = request.data.get('ip4_addresses', [])
        ip6_addresses = request.data.get('ip6_addresses', [])
        use_a = request.data.get('a_record', False)
        use_mx = request.data.get('mx_record', False)
        policy = request.data.get('policy', '~all')

        if not domain:
            return Response(
                {'error': 'Domain is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Build SPF record
        spf_parts = ['v=spf1']

        # Add A record
        if use_a:
            spf_parts.append('a')

        # Add MX record
        if use_mx:
            spf_parts.append('mx')

        # Add IPv4 addresses
        for ip4 in ip4_addresses:
            if ip4.strip():
                spf_parts.append(f'ip4:{ip4.strip()}')

        # Add IPv6 addresses
        for ip6 in ip6_addresses:
            if ip6.strip():
                spf_parts.append(f'ip6:{ip6.strip()}')

        # Add include domains
        for inc_domain in include_domains:
            if inc_domain.strip():
                spf_parts.append(f'include:{inc_domain.strip()}')

        # Add policy
        if policy not in ['-all', '~all', '?all', '+all']:
            policy = '~all'  # Default to soft fail
        spf_parts.append(policy)

        spf_record = ' '.join(spf_parts)

        # Validate SPF record length (DNS TXT record limit is 255 characters per string)
        warnings = []
        if len(spf_record) > 255:
            warnings.append('SPF record exceeds 255 characters. Consider splitting into multiple includes.')

        # Count DNS lookups (max 10 per RFC)
        lookup_count = len(include_domains) + (1 if use_a else 0) + (1 if use_mx else 0)
        if lookup_count > 10:
            warnings.append(f'SPF record requires {lookup_count} DNS lookups (max recommended: 10). This may cause validation failures.')

        # Generate explanation
        explanation = {
            'v=spf1': 'SPF version 1',
            'a': 'Allow emails from IP addresses in the A record of this domain' if use_a else None,
            'mx': 'Allow emails from IP addresses in the MX records of this domain' if use_mx else None,
            'ip4': f'Allow emails from specific IPv4 addresses: {", ".join(ip4_addresses)}' if ip4_addresses else None,
            'ip6': f'Allow emails from specific IPv6 addresses: {", ".join(ip6_addresses)}' if ip6_addresses else None,
            'include': f'Include SPF records from: {", ".join(include_domains)}' if include_domains else None,
            'policy': {
                '-all': 'Hard fail - reject emails from unauthorized servers',
                '~all': 'Soft fail - accept but mark emails from unauthorized servers',
                '?all': 'Neutral - no policy for unauthorized servers',
                '+all': 'Pass all - allow all servers (not recommended)'
            }.get(policy, 'Unknown policy')
        }

        # Remove None values
        explanation = {k: v for k, v in explanation.items() if v is not None}

        return Response({
            'domain': domain,
            'spf_record': spf_record,
            'dns_record': f'{domain}. IN TXT "{spf_record}"',
            'length': len(spf_record),
            'lookup_count': lookup_count,
            'warnings': warnings,
            'explanation': explanation,
            'instructions': {
                'step1': f'Log in to your DNS provider for {domain}',
                'step2': 'Create a new TXT record',
                'step3': f'Set the hostname to: @ or {domain}',
                'step4': f'Set the value to: {spf_record}',
                'step5': 'Save the record and wait for DNS propagation (up to 48 hours)'
            }
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='check-blacklist')
    def check_blacklist(self, request):
        """
        Blacklist Checker - Check if domain/IP is on email blacklists
        POST /api/emails/check-blacklist/
        Body: { "domain": "example.com" } or { "ip": "192.168.1.1" }
        Free tool - no authentication required
        """
        domain = request.data.get('domain', '').strip()
        ip_address = request.data.get('ip', '').strip()

        if not domain and not ip_address:
            return Response(
                {'error': 'Please provide either domain or IP address'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Common blacklists to check
        blacklists = [
            {'name': 'Spamhaus ZEN', 'host': 'zen.spamhaus.org', 'type': 'ip'},
            {'name': 'Spamhaus DBL', 'host': 'dbl.spamhaus.org', 'type': 'domain'},
            {'name': 'Spamcop', 'host': 'bl.spamcop.net', 'type': 'ip'},
            {'name': 'Barracuda', 'host': 'b.barracudacentral.org', 'type': 'ip'},
            {'name': 'SORBS', 'host': 'dnsbl.sorbs.net', 'type': 'ip'},
            {'name': 'URIBL', 'host': 'multi.uribl.com', 'type': 'domain'},
            {'name': 'SURBL', 'host': 'multi.surbl.org', 'type': 'domain'},
        ]

        results = []
        listed_count = 0

        # Check IP blacklists
        if ip_address:
            # Reverse IP for DNSBL queries
            reversed_ip = '.'.join(reversed(ip_address.split('.')))

            for bl in blacklists:
                if bl['type'] != 'ip':
                    continue

                query = f'{reversed_ip}.{bl["host"]}'
                is_listed = False

                try:
                    answers = dns.resolver.resolve(query, 'A')
                    is_listed = True
                    listed_count += 1
                except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer):
                    is_listed = False
                except Exception:
                    # Skip on error
                    continue

                results.append({
                    'blacklist': bl['name'],
                    'host': bl['host'],
                    'is_listed': is_listed,
                    'type': 'ip'
                })

        # Check domain blacklists
        if domain:
            for bl in blacklists:
                if bl['type'] != 'domain':
                    continue

                query = f'{domain}.{bl["host"]}'
                is_listed = False

                try:
                    answers = dns.resolver.resolve(query, 'A')
                    is_listed = True
                    listed_count += 1
                except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer):
                    is_listed = False
                except Exception:
                    # Skip on error
                    continue

                results.append({
                    'blacklist': bl['name'],
                    'host': bl['host'],
                    'is_listed': is_listed,
                    'type': 'domain'
                })

        total_checked = len(results)
        clean_count = total_checked - listed_count

        return Response({
            'domain': domain if domain else None,
            'ip': ip_address if ip_address else None,
            'total_checked': total_checked,
            'listed_count': listed_count,
            'clean_count': clean_count,
            'is_clean': listed_count == 0,
            'results': results,
            'checked_at': datetime.utcnow().isoformat(),
            'recommendation': 'Clean - Not listed on any blacklists' if listed_count == 0 else f'Warning - Listed on {listed_count} blacklist(s). Contact the blacklist operators to request removal.'
        }, status=status.HTTP_200_OK)


# DisposableEmailDomainViewSet removed - not needed for MVP
# Disposable email detection is handled via external API in validators.py
