from rest_framework import serializers
from .models import Site, Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment', 'author_name', 'created_at']


class SiteSerializer(serializers.ModelSerializer):
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = Site
        fields = ['id', 'name', 'url', 'description', 'image_url', 'created_at',
                  'avg_rating', 'review_count', 'reviews']

    def get_avg_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return None
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_reviews(self, obj):
        latest = obj.reviews.all()[:5]
        return ReviewSerializer(latest, many=True).data
