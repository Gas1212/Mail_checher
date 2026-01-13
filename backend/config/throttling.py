"""
Custom Throttling Classes for Rate Limiting
Applied only to tool endpoints (Content Generator, Email tools, etc.)
NOT applied to authentication endpoints
"""
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle


class ToolsThrottle(UserRateThrottle):
    """
    Rate limiting for authenticated users on tools: 3 requests per minute
    Applied to: Content Generator, Email tools, SEO tools
    NOT applied to: Auth, Profile, Dashboard endpoints
    """
    scope = 'content_gen'
    rate = '3/min'


class AnonymousToolsThrottle(AnonRateThrottle):
    """
    Rate limiting for anonymous users on tools: 3 requests per minute
    """
    scope = 'content_gen'
    rate = '3/min'
