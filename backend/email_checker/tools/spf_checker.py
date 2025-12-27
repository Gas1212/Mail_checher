import dns.resolver
from typing import Dict, List, Tuple


class SPFChecker:
    """SPF (Sender Policy Framework) Record Checker"""

    def check_spf(self, domain: str) -> Dict:
        """Check SPF record for a domain"""
        result = {
            'domain': domain,
            'has_spf': False,
            'spf_record': None,
            'spf_version': None,
            'mechanisms': [],
            'qualifiers': [],
            'all_mechanism': None,
            'warnings': [],
            'errors': [],
            'is_valid': False,
        }

        try:
            # Query TXT records
            txt_records = dns.resolver.resolve(domain, 'TXT')

            spf_records = []
            for record in txt_records:
                record_text = record.to_text().strip('"')
                if record_text.startswith('v=spf1'):
                    spf_records.append(record_text)

            if not spf_records:
                result['errors'].append('No SPF record found')
                return result

            if len(spf_records) > 1:
                result['warnings'].append('Multiple SPF records found (RFC violation)')

            # Parse the first SPF record
            spf_record = spf_records[0]
            result['has_spf'] = True
            result['spf_record'] = spf_record
            result['spf_version'] = 'spf1'

            # Parse mechanisms and qualifiers
            parts = spf_record.split()
            mechanisms = []
            qualifiers = []

            for part in parts[1:]:  # Skip 'v=spf1'
                if part.startswith('+') or part.startswith('-') or part.startswith('~') or part.startswith('?'):
                    qualifier = part[0]
                    mechanism = part[1:]
                    qualifiers.append(qualifier)
                else:
                    qualifier = '+'
                    mechanism = part

                mechanisms.append({
                    'qualifier': qualifier,
                    'mechanism': mechanism,
                    'description': self._get_mechanism_description(qualifier, mechanism)
                })

                # Check for 'all' mechanism
                if mechanism == 'all' or mechanism.startswith('all'):
                    result['all_mechanism'] = {
                        'qualifier': qualifier,
                        'policy': self._get_all_policy(qualifier)
                    }

            result['mechanisms'] = mechanisms
            result['is_valid'] = True

            # Validate
            self._validate_spf(result)

        except dns.resolver.NXDOMAIN:
            result['errors'].append('Domain does not exist')
        except dns.resolver.NoAnswer:
            result['errors'].append('No DNS answer for domain')
        except dns.resolver.Timeout:
            result['errors'].append('DNS query timeout')
        except Exception as e:
            result['errors'].append(f'Error checking SPF: {str(e)}')

        return result

    def _get_mechanism_description(self, qualifier: str, mechanism: str) -> str:
        """Get description for SPF mechanism"""
        qualifier_desc = {
            '+': 'PASS',
            '-': 'FAIL',
            '~': 'SOFTFAIL',
            '?': 'NEUTRAL'
        }

        if mechanism.startswith('ip4:'):
            return f"{qualifier_desc.get(qualifier, 'PASS')}: Allow IPv4 {mechanism[4:]}"
        elif mechanism.startswith('ip6:'):
            return f"{qualifier_desc.get(qualifier, 'PASS')}: Allow IPv6 {mechanism[4:]}"
        elif mechanism.startswith('a'):
            return f"{qualifier_desc.get(qualifier, 'PASS')}: Allow domain's A record"
        elif mechanism.startswith('mx'):
            return f"{qualifier_desc.get(qualifier, 'PASS')}: Allow domain's MX servers"
        elif mechanism.startswith('include:'):
            return f"{qualifier_desc.get(qualifier, 'PASS')}: Include SPF from {mechanism[8:]}"
        elif mechanism == 'all':
            return f"{qualifier_desc.get(qualifier, 'PASS')}: Default policy"
        else:
            return f"{qualifier_desc.get(qualifier, 'PASS')}: {mechanism}"

    def _get_all_policy(self, qualifier: str) -> str:
        """Get policy description for 'all' mechanism"""
        policies = {
            '+': 'Pass (Accept all - NOT RECOMMENDED)',
            '-': 'Fail (Reject all non-matching)',
            '~': 'SoftFail (Mark as spam)',
            '?': 'Neutral (No policy)'
        }
        return policies.get(qualifier, 'Unknown')

    def _validate_spf(self, result: Dict):
        """Validate SPF record and add warnings"""
        # Check for 'all' mechanism
        if not result['all_mechanism']:
            result['warnings'].append("No 'all' mechanism found - policy incomplete")

        # Check for too many DNS lookups
        dns_lookup_count = sum(1 for m in result['mechanisms']
                               if m['mechanism'].startswith('include:')
                               or m['mechanism'].startswith('a')
                               or m['mechanism'].startswith('mx'))

        if dns_lookup_count > 10:
            result['warnings'].append(f'Too many DNS lookups ({dns_lookup_count}). SPF limit is 10.')

        # Check for deprecated mechanisms
        for m in result['mechanisms']:
            if m['mechanism'].startswith('ptr'):
                result['warnings'].append("'ptr' mechanism is deprecated and should be avoided")
