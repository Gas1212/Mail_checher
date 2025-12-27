import re
import requests
from urllib.parse import urlparse
from typing import Dict, List


class PhishingChecker:
    """Phishing Link Checker using multiple detection methods"""

    def __init__(self):
        # Common phishing indicators
        self.suspicious_tlds = [
            '.tk', '.ml', '.ga', '.cf', '.gq', '.pw', '.cc', '.top', '.xyz'
        ]

        self.suspicious_keywords = [
            'verify', 'account', 'suspended', 'locked', 'confirm', 'urgent',
            'security', 'alert', 'update', 'login', 'signin', 'password',
            'banking', 'paypal', 'ebay', 'amazon', 'microsoft', 'apple'
        ]

    def check_url(self, url: str) -> Dict:
        """Check if URL is potentially phishing"""
        result = {
            'url': url,
            'is_safe': True,
            'risk_score': 0,  # 0-100, higher is more dangerous
            'threats': [],
            'warnings': [],
            'analysis': {},
            'error': None,
        }

        try:
            # Validate URL format
            if not url.startswith(('http://', 'https://')):
                url = 'http://' + url

            parsed = urlparse(url)

            # Analyze URL components
            result['analysis'] = {
                'scheme': parsed.scheme,
                'domain': parsed.netloc,
                'path': parsed.path,
                'has_ip': self._is_ip_address(parsed.netloc),
                'has_suspicious_tld': self._has_suspicious_tld(parsed.netloc),
                'has_suspicious_keywords': self._has_suspicious_keywords(url),
                'length': len(url),
                'subdomain_count': parsed.netloc.count('.'),
            }

            # Perform checks
            self._check_ip_address(result, parsed.netloc)
            self._check_suspicious_tld(result, parsed.netloc)
            self._check_suspicious_keywords(result, url)
            self._check_url_length(result, url)
            self._check_subdomains(result, parsed.netloc)
            self._check_https(result, parsed.scheme)
            self._check_url_shortener(result, parsed.netloc)

            # Calculate risk score
            result['risk_score'] = min(100, len(result['threats']) * 20 + len(result['warnings']) * 5)

            # Determine if safe
            result['is_safe'] = result['risk_score'] < 40

        except Exception as e:
            result['error'] = f'Error analyzing URL: {str(e)}'

        return result

    def _is_ip_address(self, domain: str) -> bool:
        """Check if domain is an IP address"""
        # Remove port if present
        domain = domain.split(':')[0]

        # Check IPv4
        ip_pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
        return bool(re.match(ip_pattern, domain))

    def _has_suspicious_tld(self, domain: str) -> bool:
        """Check if domain has suspicious TLD"""
        domain_lower = domain.lower()
        return any(domain_lower.endswith(tld) for tld in self.suspicious_tlds)

    def _has_suspicious_keywords(self, url: str) -> bool:
        """Check if URL contains suspicious keywords"""
        url_lower = url.lower()
        return any(keyword in url_lower for keyword in self.suspicious_keywords)

    def _check_ip_address(self, result: Dict, domain: str):
        """Check if URL uses IP address instead of domain"""
        if self._is_ip_address(domain):
            result['threats'].append('URL uses IP address instead of domain name')

    def _check_suspicious_tld(self, result: Dict, domain: str):
        """Check for suspicious TLDs"""
        if self._has_suspicious_tld(domain):
            result['warnings'].append('Domain uses a commonly abused TLD')

    def _check_suspicious_keywords(self, result: Dict, url: str):
        """Check for phishing keywords"""
        url_lower = url.lower()
        found_keywords = [kw for kw in self.suspicious_keywords if kw in url_lower]

        if len(found_keywords) >= 2:
            result['threats'].append(f'Multiple suspicious keywords found: {", ".join(found_keywords[:3])}')
        elif found_keywords:
            result['warnings'].append(f'Suspicious keyword found: {found_keywords[0]}')

    def _check_url_length(self, result: Dict, url: str):
        """Check if URL is suspiciously long"""
        if len(url) > 100:
            result['warnings'].append('URL is unusually long (possible obfuscation)')

    def _check_subdomains(self, result: Dict, domain: str):
        """Check for excessive subdomains"""
        subdomain_count = domain.count('.')
        if subdomain_count > 3:
            result['warnings'].append(f'Excessive subdomains ({subdomain_count}) - possible typosquatting')

    def _check_https(self, result: Dict, scheme: str):
        """Check if URL uses HTTPS"""
        if scheme != 'https':
            result['warnings'].append('URL does not use HTTPS (unencrypted)')

    def _check_url_shortener(self, result: Dict, domain: str):
        """Check if URL uses a shortener service"""
        shortener_domains = [
            'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
            'is.gd', 'buff.ly', 'adf.ly', 'bl.ink', 'lnkd.in'
        ]

        domain_lower = domain.lower()
        if any(shortener in domain_lower for shortener in shortener_domains):
            result['warnings'].append('URL uses a link shortener - destination unclear')

    def check_domain_age(self, domain: str) -> Dict:
        """Check domain age (placeholder - would require WHOIS API)"""
        result = {
            'domain': domain,
            'age_days': None,
            'created_date': None,
            'is_new': None,
            'error': 'Domain age check requires WHOIS API (not implemented in free version)',
        }

        return result
