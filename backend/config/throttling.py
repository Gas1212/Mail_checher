"""
Custom Throttling Classes for Rate Limiting
"""
from rest_framework.throttling import UserRateThrottle


class AuthenticatedUserThrottle(UserRateThrottle):
    """
    Rate limiting for authenticated users: 3 requests per minute
    """
    rate = '3/min'

    def get_cache_key(self, request, view):
        """
        Use user ID for authenticated requests
        """
        if request.user.is_authenticated:
            ident = request.user.pk
        else:
            # For non-authenticated, use IP-based throttling
            ident = self.get_ident(request)

        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }


class BurstRateThrottle(UserRateThrottle):
    """
    Burst rate limiting: 10 requests per minute (for quick successive requests)
    """
    scope = 'burst'
    rate = '10/min'


class SustainedRateThrottle(UserRateThrottle):
    """
    Sustained rate limiting: 100 requests per hour
    """
    scope = 'sustained'
    rate = '100/hour'
