from pymongo import MongoClient
from django.conf import settings
from datetime import datetime

# MongoDB client singleton
_client = None
_db = None
_collection = None


def get_mongo_client():
    """Get or create MongoDB client"""
    global _client, _db, _collection

    if _client is None:
        _client = MongoClient(settings.MONGODB_URI)
        _db = _client[settings.MONGODB_NAME]
        _collection = _db[settings.MONGODB_COLLECTION]

    return _client, _db, _collection


def get_db():
    """Get MongoDB database instance"""
    _, db, _ = get_mongo_client()
    return db


def save_validation(email, validation_result, ip_address=None):
    """Save email validation to MongoDB"""
    _, _, collection = get_mongo_client()

    document = {
        'email': email,
        'is_valid_syntax': validation_result['is_valid_syntax'],
        'is_valid_dns': validation_result['is_valid_dns'],
        'is_valid_smtp': validation_result['is_valid_smtp'],
        'is_disposable': validation_result['is_disposable'],
        'mx_records': validation_result['mx_records'],
        'validation_message': validation_result['validation_message'],
        'ip_address': ip_address,
        'created_at': datetime.utcnow()
    }

    result = collection.insert_one(document)
    document['_id'] = str(result.inserted_id)
    return document


def get_validation_history(limit=50):
    """Get validation history from MongoDB"""
    _, _, collection = get_mongo_client()

    validations = collection.find().sort('created_at', -1).limit(limit)

    results = []
    for doc in validations:
        doc['_id'] = str(doc['_id'])
        results.append(doc)

    return results


def get_validation_stats():
    """Get validation statistics from MongoDB"""
    _, _, collection = get_mongo_client()

    total = collection.count_documents({})
    valid = collection.count_documents({
        'is_valid_syntax': True,
        'is_valid_dns': True
    })
    disposable = collection.count_documents({'is_disposable': True})

    return {
        'total_validations': total,
        'valid_emails': valid,
        'invalid_emails': total - valid,
        'success_rate': round((valid / total * 100) if total > 0 else 0, 2)
    }
