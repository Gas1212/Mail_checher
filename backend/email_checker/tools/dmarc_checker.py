import dns.resolver
from typing import Dict


class DMARCChecker:
    """DMARC (Domain-based Message Authentication) Record Checker"""

    def check_dmarc(self, domain: str) -> Dict:
        """Check DMARC record for a domain"""
        result = {
            'domain': domain,
            'has_dmarc': False,
            'dmarc_record': None,
            'policy': None,
            'subdomain_policy': None,
            'percentage': 100,
            'rua': [],  # Aggregate reports
            'ruf': [],  # Forensic reports
            'alignment': {},
            'warnings': [],
            'errors': [],
            'is_valid': False,
        }

        try:
            # DMARC records are published at _dmarc.domain.com
            dmarc_domain = f'_dmarc.{domain}'
            txt_records = dns.resolver.resolve(dmarc_domain, 'TXT')

            dmarc_records = []
            for record in txt_records:
                record_text = record.to_text().strip('"')
                if record_text.startswith('v=DMARC1'):
                    dmarc_records.append(record_text)

            if not dmarc_records:
                result['errors'].append('No DMARC record found')
                return result

            if len(dmarc_records) > 1:
                result['warnings'].append('Multiple DMARC records found (should be only one)')

            # Parse the first DMARC record
            dmarc_record = dmarc_records[0]
            result['has_dmarc'] = True
            result['dmarc_record'] = dmarc_record

            # Parse DMARC tags
            tags = self._parse_dmarc_tags(dmarc_record)

            # Extract key values
            result['policy'] = tags.get('p', 'none')
            result['subdomain_policy'] = tags.get('sp', tags.get('p', 'none'))
            result['percentage'] = int(tags.get('pct', '100'))

            # Aggregate reports
            if 'rua' in tags:
                result['rua'] = [email.strip() for email in tags['rua'].split(',')]

            # Forensic reports
            if 'ruf' in tags:
                result['ruf'] = [email.strip() for email in tags['ruf'].split(',')]

            # Alignment modes
            result['alignment'] = {
                'dkim': tags.get('adkim', 'r'),  # r=relaxed, s=strict
                'spf': tags.get('aspf', 'r')
            }

            result['is_valid'] = True

            # Validate and add recommendations
            self._validate_dmarc(result, tags)

        except dns.resolver.NXDOMAIN:
            result['errors'].append(f'DMARC domain {dmarc_domain} does not exist')
        except dns.resolver.NoAnswer:
            result['errors'].append('No DMARC record found')
        except dns.resolver.Timeout:
            result['errors'].append('DNS query timeout')
        except Exception as e:
            result['errors'].append(f'Error checking DMARC: {str(e)}')

        return result

    def _parse_dmarc_tags(self, dmarc_record: str) -> Dict:
        """Parse DMARC tags into a dictionary"""
        tags = {}
        parts = dmarc_record.split(';')

        for part in parts:
            part = part.strip()
            if '=' in part:
                key, value = part.split('=', 1)
                tags[key.strip()] = value.strip()

        return tags

    def _validate_dmarc(self, result: Dict, tags: Dict):
        """Validate DMARC record and add warnings/recommendations"""
        # Check policy
        if result['policy'] == 'none':
            result['warnings'].append("Policy is 'none' - emails are monitored but not protected")
        elif result['policy'] == 'quarantine':
            result['warnings'].append("Policy is 'quarantine' - suspicious emails go to spam")
        elif result['policy'] == 'reject':
            # This is the most secure
            pass

        # Check for reporting addresses
        if not result['rua']:
            result['warnings'].append('No aggregate report address (rua) specified - you won\'t receive reports')

        # Check percentage
        if result['percentage'] < 100:
            result['warnings'].append(f'Policy applies to only {result["percentage"]}% of emails')

        # Recommend strict alignment
        if result['alignment']['dkim'] == 'r':
            result['warnings'].append('DKIM alignment is relaxed - consider using strict mode (adkim=s)')
        if result['alignment']['spf'] == 'r':
            result['warnings'].append('SPF alignment is relaxed - consider using strict mode (aspf=s)')

        # Check for forensic reports
        if not result['ruf']:
            result['warnings'].append('No forensic report address (ruf) specified')
