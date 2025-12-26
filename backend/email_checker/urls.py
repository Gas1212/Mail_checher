from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmailValidationViewSet

router = DefaultRouter()
router.register(r'emails', EmailValidationViewSet, basename='email-validation')

urlpatterns = [
    path('', include(router.urls)),
]
