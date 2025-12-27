# Models are not needed - we use MongoDB directly via pymongo
# All user data is stored in MongoDB collections:
# - users: user accounts and authentication
# - user_profiles: user statistics and preferences
# - email_validations: email validation history

# See mongo_auth.py for MongoDB user management
# See db.py for MongoDB connection
