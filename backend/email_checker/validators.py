import re
import dns.resolver
import smtplib
import socket
from email_validator import validate_email, EmailNotValidError
from typing import Dict, List, Tuple
import requests


class EmailValidator:
    """Comprehensive email validation class"""

    def __init__(self):
        self.disposable_domains = self._load_disposable_domains()

    def _load_disposable_domains(self) -> set:
        """Load common disposable email domains"""
        common_disposable = {
            'tempmail.com', 'guerrillamail.com', '10minutemail.com',
            'throwaway.email', 'mailinator.com', 'getnada.com',
            'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
            'yopmail.com', 'maildrop.cc', 'sharklasers.com',
            'guerrillamail.info', 'grr.la', 'guerrillamail.biz',
            'guerrillamail.de', 'spam4.me', 'anonymousemail.me'
        }

        return common_disposable

    def validate_syntax(self, email: str) -> Tuple[bool, str]:
        """Validate email syntax"""
        try:
            validated = validate_email(email, check_deliverability=False)
            return True, f"Valid email syntax: {validated.normalized}"
        except EmailNotValidError as e:
            return False, str(e)

    def validate_dns(self, email: str) -> Tuple[bool, List[str], str]:
        """Validate DNS and MX records"""
        try:
            domain = email.split('@')[1]
            mx_records = []

            try:
                mx_records_dns = dns.resolver.resolve(domain, 'MX')
                mx_records = [str(r.exchange) for r in mx_records_dns]

                if mx_records:
                    return True, mx_records, f"Found {len(mx_records)} MX record(s)"
                else:
                    return False, [], "No MX records found"

            except dns.resolver.NXDOMAIN:
                return False, [], "Domain does not exist"
            except dns.resolver.NoAnswer:
                return False, [], "No MX records found"
            except dns.resolver.Timeout:
                return False, [], "DNS query timeout"
            except Exception as e:
                return False, [], f"DNS error: {str(e)}"

        except IndexError:
            return False, [], "Invalid email format"

    def validate_smtp(self, email: str, mx_records: List[str]) -> Tuple[bool, str]:
        """Validate email via SMTP"""
        if not mx_records:
            return False, "No MX records to check"

        domain = email.split('@')[1] if '@' in email else ''

        for mx in mx_records[:3]:
            try:
                mx_host = str(mx).rstrip('.')

                server = smtplib.SMTP(timeout=10)
                server.connect(mx_host)
                server.helo(server.local_hostname)
                server.mail('verify@example.com')
                code, message = server.rcpt(email)
                server.quit()

                if code == 250:
                    return True, "Email address exists"
                elif code == 550:
                    return False, "Email address does not exist"
                else:
                    return False, f"Uncertain (code {code}): {message.decode()}"

            except smtplib.SMTPServerDisconnected:
                continue
            except smtplib.SMTPConnectError:
                continue
            except socket.timeout:
                continue
            except Exception as e:
                continue

        return False, "Could not verify via SMTP (server not responding)"

    def check_disposable(self, email: str) -> Tuple[bool, str]:
        """Check if email is from a disposable domain"""
        try:
            domain = email.split('@')[1].lower()

            if domain in self.disposable_domains:
                return True, f"Disposable email domain detected: {domain}"

            return False, "Not a known disposable email"

        except IndexError:
            return False, "Invalid email format"

    def validate_email_complete(self, email: str, check_smtp: bool = True) -> Dict:
        """Perform complete email validation"""
        result = {
            'email': email,
            'is_valid_syntax': False,
            'is_valid_dns': False,
            'is_valid_smtp': False,
            'is_disposable': False,
            'mx_records': [],
            'validation_message': '',
            'details': {}
        }

        is_valid_syntax, syntax_msg = self.validate_syntax(email)
        result['is_valid_syntax'] = is_valid_syntax
        result['details']['syntax'] = syntax_msg

        if not is_valid_syntax:
            result['validation_message'] = f"Invalid syntax: {syntax_msg}"
            return result

        is_valid_dns, mx_records, dns_msg = self.validate_dns(email)
        result['is_valid_dns'] = is_valid_dns
        result['mx_records'] = mx_records
        result['details']['dns'] = dns_msg

        if not is_valid_dns:
            result['validation_message'] = f"DNS validation failed: {dns_msg}"
            return result

        is_disposable, disposable_msg = self.check_disposable(email)
        result['is_disposable'] = is_disposable
        result['details']['disposable'] = disposable_msg

        if check_smtp and mx_records:
            is_valid_smtp, smtp_msg = self.validate_smtp(email, mx_records)
            result['is_valid_smtp'] = is_valid_smtp
            result['details']['smtp'] = smtp_msg
        else:
            result['details']['smtp'] = "SMTP check skipped"

        if is_valid_syntax and is_valid_dns:
            if is_disposable:
                result['validation_message'] = "Valid email but from disposable domain"
            elif is_valid_smtp:
                result['validation_message'] = "Email is valid and verified"
            else:
                result['validation_message'] = "Email is syntactically valid with valid DNS"

        return result
