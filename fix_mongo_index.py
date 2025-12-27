"""
Fix MongoDB google_id index to be sparse
"""
from pymongo import MongoClient
from decouple import config
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Get MongoDB connection from settings
from django.conf import settings
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Connect to MongoDB
client = MongoClient(settings.MONGODB_URI)
db = client[settings.MONGODB_NAME]
users_collection = db['users']

print("Checking existing indexes...")
indexes = users_collection.list_indexes()
for idx in indexes:
    print(f"  {idx}")

print("\nDropping google_id index if exists...")
try:
    users_collection.drop_index('google_id_1')
    print("  Index dropped successfully")
except Exception as e:
    print(f"  {e}")

print("\nCreating new sparse unique index for google_id...")
try:
    users_collection.create_index('google_id', unique=True, sparse=True)
    print("  Index created successfully")
except Exception as e:
    print(f"  Error: {e}")

print("\nFinal indexes:")
indexes = users_collection.list_indexes()
for idx in indexes:
    print(f"  {idx}")

print("\nDone!")
