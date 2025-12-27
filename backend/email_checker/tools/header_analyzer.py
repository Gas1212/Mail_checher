import re
from email import message_from_string
from email.parser import Parser
from typing import Dict, List


class EmailHeaderAnalyzer:
    """Email Header Analyzer"""

    def analyze_headers(self, raw_headers: str) -> Dict:
        """Analyze email headers"""
        result = {
            'summary': {},
            'authentication': {},
            'routing': [],
            'security': {},
            'warnings': [],
            'errors': [],
        }

        try:
            # Parse headers
            if not raw_headers.strip():
                result['errors'].append('No headers provided')
                return result

            # Parse email headers
            msg = message_from_string(raw_headers)

            # Extract summary information
            result['summary'] = {
                'from': msg.get('From', 'N/A'),
                'to': msg.get('To', 'N/A'),
                'subject': msg.get('Subject', 'N/A'),
                'date': msg.get('Date', 'N/A'),
                'message_id': msg.get('Message-ID', 'N/A'),
            }

            # Extract authentication results
            result['authentication'] = self._extract_authentication(msg)

            # Extract routing information (Received headers)
            result['routing'] = self._extract_routing(msg)

            # Extract security headers
            result['security'] = self._extract_security_headers(msg)

            # Analyze and add warnings
            self._analyze_security(result)

        except Exception as e:
            result['errors'].append(f'Error parsing headers: {str(e)}')

        return result

    def _extract_authentication(self, msg) -> Dict:
        """Extract SPF, DKIM, DMARC results from headers"""
        auth = {
            'spf': None,
            'dkim': None,
            'dmarc': None,
        }

        # Check for Authentication-Results header
        auth_results = msg.get('Authentication-Results', '')

        if auth_results:
            # Extract SPF
            spf_match = re.search(r'spf=(\w+)', auth_results, re.IGNORECASE)
            if spf_match:
                auth['spf'] = spf_match.group(1).lower()

            # Extract DKIM
            dkim_match = re.search(r'dkim=(\w+)', auth_results, re.IGNORECASE)
            if dkim_match:
                auth['dkim'] = dkim_match.group(1).lower()

            # Extract DMARC
            dmarc_match = re.search(r'dmarc=(\w+)', auth_results, re.IGNORECASE)
            if dmarc_match:
                auth['dmarc'] = dmarc_match.group(1).lower()

        # Check individual headers
        if not auth['spf']:
            received_spf = msg.get('Received-SPF', '')
            if received_spf:
                auth['spf'] = received_spf.split()[0].lower() if received_spf else None

        if not auth['dkim']:
            dkim_sig = msg.get('DKIM-Signature', '')
            if dkim_sig:
                auth['dkim'] = 'present'

        return auth

    def _extract_routing(self, msg) -> List[Dict]:
        """Extract email routing path from Received headers"""
        routing = []
        received_headers = msg.get_all('Received', [])

        for i, received in enumerate(received_headers):
            hop = {
                'hop': i + 1,
                'server': None,
                'from': None,
                'by': None,
                'date': None,
            }

            # Extract 'from' server
            from_match = re.search(r'from\s+([^\s]+)', received, re.IGNORECASE)
            if from_match:
                hop['from'] = from_match.group(1)

            # Extract 'by' server
            by_match = re.search(r'by\s+([^\s]+)', received, re.IGNORECASE)
            if by_match:
                hop['by'] = by_match.group(1)

            # Extract date
            date_match = re.search(r';(.+)$', received)
            if date_match:
                hop['date'] = date_match.group(1).strip()

            routing.append(hop)

        return routing

    def _extract_security_headers(self, msg) -> Dict:
        """Extract security-related headers"""
        security = {
            'return_path': msg.get('Return-Path', 'N/A'),
            'reply_to': msg.get('Reply-To', 'N/A'),
            'x_mailer': msg.get('X-Mailer', 'N/A'),
            'x_originating_ip': msg.get('X-Originating-IP', 'N/A'),
            'list_unsubscribe': msg.get('List-Unsubscribe', 'N/A'),
        }

        return security

    def _analyze_security(self, result: Dict):
        """Analyze security and add warnings"""
        auth = result['authentication']

        # Check SPF
        if auth['spf'] == 'fail':
            result['warnings'].append('SPF check failed - sender may be spoofed')
        elif auth['spf'] == 'softfail':
            result['warnings'].append('SPF soft fail - sender verification uncertain')
        elif not auth['spf']:
            result['warnings'].append('No SPF check performed')

        # Check DKIM
        if auth['dkim'] == 'fail':
            result['warnings'].append('DKIM signature failed - email may be tampered')
        elif not auth['dkim']:
            result['warnings'].append('No DKIM signature found')

        # Check DMARC
        if auth['dmarc'] == 'fail':
            result['warnings'].append('DMARC check failed - email failed authentication')
        elif not auth['dmarc']:
            result['warnings'].append('No DMARC check performed')

        # Check Return-Path vs From mismatch
        summary = result['summary']
        security = result['security']

        if security['return_path'] != 'N/A' and summary['from'] != 'N/A':
            return_path_email = re.search(r'<(.+?)>', security['return_path'])
            from_email = re.search(r'<(.+?)>', summary['from'])

            if return_path_email and from_email:
                if return_path_email.group(1) != from_email.group(1):
                    result['warnings'].append('Return-Path differs from From address - possible spoofing')
