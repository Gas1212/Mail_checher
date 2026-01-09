from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContentGeneratorViewSet

router = DefaultRouter()
router.register(r'content-generator', ContentGeneratorViewSet, basename='content-generator')

urlpatterns = [
    path('', include(router.urls)),
]
