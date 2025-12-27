from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmailValidationViewSet
from .tool_views import SecurityToolsViewSet
from .auth_views import AuthViewSet

router = DefaultRouter()
router.register(r'emails', EmailValidationViewSet, basename='email-validation')
router.register(r'tools', SecurityToolsViewSet, basename='security-tools')
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]
