import os
from django.core.wsgi import get_wsgi_application
from decouple import config

# Load Groq API key into environment
os.environ['GROQ_API_KEY'] = config('GROQ_API_KEY', default='')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
application = get_wsgi_application()
