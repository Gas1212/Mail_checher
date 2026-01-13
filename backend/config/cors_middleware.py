"""
Custom CORS Middleware to handle OPTIONS preflight requests
This is needed when Nginx doesn't properly forward OPTIONS requests
"""
from django.http import HttpResponse
from decouple import config


class CorsMiddleware:
    """
    Custom CORS middleware to handle preflight requests
    """
    def __init__(self, get_response):
        self.get_response = get_response
        self.allowed_origins = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000').split(',')

    def __call__(self, request):
        # Get the origin from the request
        origin = request.META.get('HTTP_ORIGIN')

        # Handle preflight OPTIONS requests
        if request.method == 'OPTIONS':
            response = HttpResponse()
            response.status_code = 200

            # Check if origin is allowed
            if origin in self.allowed_origins:
                response['Access-Control-Allow-Origin'] = origin
                response['Access-Control-Allow-Credentials'] = 'true'
                response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
                response['Access-Control-Allow-Headers'] = 'accept, accept-encoding, authorization, content-type, dnt, origin, user-agent, x-csrftoken, x-requested-with'
                response['Access-Control-Max-Age'] = '86400'

            return response

        # Process the request normally
        response = self.get_response(request)

        # Add CORS headers to all responses
        if origin in self.allowed_origins:
            response['Access-Control-Allow-Origin'] = origin
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'accept, accept-encoding, authorization, content-type, dnt, origin, user-agent, x-csrftoken, x-requested-with'

        return response
