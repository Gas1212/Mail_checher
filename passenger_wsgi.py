"""
WSGI config for serv00 deployment
"""
import os
import sys

# Add the project directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Import Django application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
