from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmailValidationViewSet
from .tool_views import SecurityToolsViewSet

router = DefaultRouter()
router.register(r'emails', EmailValidationViewSet, basename='email-validation')
router.register(r'tools', SecurityToolsViewSet, basename='security-tools')

urlpatterns = [
    path('', include(router.urls)),
]
