from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SitemapToolsViewSet

router = DefaultRouter()
router.register(r'seo', SitemapToolsViewSet, basename='seo')

urlpatterns = [
    path('', include(router.urls)),
]
