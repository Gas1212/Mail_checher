import dns.resolver
from typing import Dict, List


class DNSChecker:
    """Comprehensive DNS Record Checker"""

    def check_dns(self, domain: str) -> Dict:
        """Check all DNS records for a domain"""
        result = {
            'domain': domain,
            'a_records': [],
            'aaaa_records': [],
            'mx_records': [],
            'txt_records': [],
            'cname_records': [],
            'ns_records': [],
            'soa_record': None,
            'errors': [],
        }

        # Check A records (IPv4)
        try:
            a_records = dns.resolver.resolve(domain, 'A')
            result['a_records'] = [str(r) for r in a_records]
        except Exception as e:
            result['errors'].append(f'A records: {str(e)}')

        # Check AAAA records (IPv6)
        try:
            aaaa_records = dns.resolver.resolve(domain, 'AAAA')
            result['aaaa_records'] = [str(r) for r in aaaa_records]
        except Exception:
            pass  # IPv6 is optional

        # Check MX records
        try:
            mx_records = dns.resolver.resolve(domain, 'MX')
            result['mx_records'] = [
                {'priority': r.preference, 'server': str(r.exchange).rstrip('.')}
                for r in mx_records
            ]
        except Exception as e:
            result['errors'].append(f'MX records: {str(e)}')

        # Check TXT records
        try:
            txt_records = dns.resolver.resolve(domain, 'TXT')
            result['txt_records'] = [r.to_text().strip('"') for r in txt_records]
        except Exception:
            pass  # TXT is optional

        # Check CNAME records
        try:
            cname_records = dns.resolver.resolve(domain, 'CNAME')
            result['cname_records'] = [str(r.target).rstrip('.') for r in cname_records]
        except Exception:
            pass  # CNAME is optional (and conflicts with other records)

        # Check NS records
        try:
            ns_records = dns.resolver.resolve(domain, 'NS')
            result['ns_records'] = [str(r.target).rstrip('.') for r in ns_records]
        except Exception as e:
            result['errors'].append(f'NS records: {str(e)}')

        # Check SOA record
        try:
            soa_records = dns.resolver.resolve(domain, 'SOA')
            soa = list(soa_records)[0]
            result['soa_record'] = {
                'mname': str(soa.mname).rstrip('.'),
                'rname': str(soa.rname).rstrip('.'),
                'serial': soa.serial,
                'refresh': soa.refresh,
                'retry': soa.retry,
                'expire': soa.expire,
                'minimum': soa.minimum,
            }
        except Exception as e:
            result['errors'].append(f'SOA record: {str(e)}')

        return result

    def check_specific_record(self, domain: str, record_type: str) -> Dict:
        """Check a specific DNS record type"""
        result = {
            'domain': domain,
            'record_type': record_type,
            'records': [],
            'error': None,
        }

        try:
            records = dns.resolver.resolve(domain, record_type)

            if record_type == 'MX':
                result['records'] = [
                    {'priority': r.preference, 'server': str(r.exchange).rstrip('.')}
                    for r in records
                ]
            elif record_type == 'TXT':
                result['records'] = [r.to_text().strip('"') for r in records]
            elif record_type == 'SOA':
                soa = list(records)[0]
                result['records'] = [{
                    'mname': str(soa.mname).rstrip('.'),
                    'rname': str(soa.rname).rstrip('.'),
                    'serial': soa.serial,
                    'refresh': soa.refresh,
                    'retry': soa.retry,
                    'expire': soa.expire,
                    'minimum': soa.minimum,
                }]
            else:
                result['records'] = [str(r).rstrip('.') for r in records]

        except dns.resolver.NXDOMAIN:
            result['error'] = 'Domain does not exist'
        except dns.resolver.NoAnswer:
            result['error'] = f'No {record_type} records found'
        except dns.resolver.Timeout:
            result['error'] = 'DNS query timeout'
        except Exception as e:
            result['error'] = str(e)

        return result
