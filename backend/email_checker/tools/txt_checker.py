"""
TXT Record Checker Tool
Checks TXT records for a domain and identifies SPF, DMARC, DKIM, and other records.
"""

import dns.resolver
from typing import Dict, List


class TXTChecker:
    """
    Checker for TXT records of a domain
    """

    def check_txt(self, domain: str) -> Dict:
        """
        Check all TXT records for a domain and categorize them

        Args:
            domain: The domain to check

        Returns:
            Dictionary containing TXT records and categorized results
        """
        result = {
            'domain': domain,
            'has_txt': False,
            'txt_records': [],
            'spf_records': [],
            'dmarc_records': [],
            'dkim_records': [],
            'verification_records': [],
            'other_records': [],
            'record_count': 0,
        }

        try:
            # Query TXT records
            txt_records = dns.resolver.resolve(domain, 'TXT')

            for rdata in txt_records:
                # Combine all strings in the TXT record
                txt_value = ''.join([s.decode('utf-8') if isinstance(s, bytes) else s for s in rdata.strings])
                result['txt_records'].append(txt_value)

                # Categorize the record
                self._categorize_record(txt_value, result)

            result['has_txt'] = len(result['txt_records']) > 0
            result['record_count'] = len(result['txt_records'])

        except dns.resolver.NXDOMAIN:
            result['errors'] = ['Domain does not exist']
        except dns.resolver.NoAnswer:
            result['warnings'] = ['No TXT records found for this domain']
        except dns.resolver.Timeout:
            result['errors'] = ['DNS query timeout']
        except Exception as e:
            result['errors'] = [f'Error checking TXT records: {str(e)}']

        return result

    def _categorize_record(self, txt_value: str, result: Dict) -> None:
        """
        Categorize a TXT record by its content

        Args:
            txt_value: The TXT record value
            result: The result dictionary to update
        """
        txt_lower = txt_value.lower()

        # Check for SPF record
        if txt_value.startswith('v=spf1'):
            result['spf_records'].append({
                'record': txt_value,
                'type': 'SPF',
                'description': 'Sender Policy Framework record'
            })

        # Check for DMARC record (usually on _dmarc subdomain)
        elif txt_value.startswith('v=DMARC1'):
            result['dmarc_records'].append({
                'record': txt_value,
                'type': 'DMARC',
                'description': 'DMARC policy record'
            })

        # Check for DKIM record
        elif 'k=rsa' in txt_lower or 'p=' in txt_lower and 'MIG' in txt_value:
            result['dkim_records'].append({
                'record': txt_value,
                'type': 'DKIM',
                'description': 'DKIM public key'
            })

        # Check for common verification records
        elif any(prefix in txt_lower for prefix in [
            'google-site-verification=',
            'ms=',
            'facebook-domain-verification=',
            'adobe-idp-site-verification=',
            'docusign=',
            'apple-domain-verification='
        ]):
            verification_type = self._get_verification_type(txt_value)
            result['verification_records'].append({
                'record': txt_value,
                'type': verification_type,
                'description': f'{verification_type} domain verification'
            })

        # Other records
        else:
            # Try to identify the purpose
            purpose = self._identify_purpose(txt_value)
            result['other_records'].append({
                'record': txt_value,
                'type': 'Other',
                'description': purpose
            })

    def _get_verification_type(self, txt_value: str) -> str:
        """
        Identify the type of verification record

        Args:
            txt_value: The TXT record value

        Returns:
            The verification provider name
        """
        txt_lower = txt_value.lower()

        if 'google-site-verification=' in txt_lower:
            return 'Google'
        elif txt_value.startswith('MS='):
            return 'Microsoft'
        elif 'facebook-domain-verification=' in txt_lower:
            return 'Facebook'
        elif 'adobe-idp-site-verification=' in txt_lower:
            return 'Adobe'
        elif 'docusign=' in txt_lower:
            return 'DocuSign'
        elif 'apple-domain-verification=' in txt_lower:
            return 'Apple'
        else:
            return 'Unknown Provider'

    def _identify_purpose(self, txt_value: str) -> str:
        """
        Try to identify the purpose of a TXT record

        Args:
            txt_value: The TXT record value

        Returns:
            Description of the record's likely purpose
        """
        txt_lower = txt_value.lower()

        # Common patterns
        if '_globalsign-domain-verification=' in txt_lower:
            return 'GlobalSign domain verification'
        elif 'atlassian-domain-verification=' in txt_lower:
            return 'Atlassian domain verification'
        elif 'stripe-verification=' in txt_lower:
            return 'Stripe verification'
        elif 'protonmail-verification=' in txt_lower:
            return 'ProtonMail verification'
        elif 'have i been pwned' in txt_lower:
            return 'Have I Been Pwned verification'
        elif 'status-page-domain-verification=' in txt_lower:
            return 'Status page verification'
        elif txt_value.startswith('_') or '._' in txt_value:
            return 'Service configuration record'
        else:
            return 'Generic TXT record'
