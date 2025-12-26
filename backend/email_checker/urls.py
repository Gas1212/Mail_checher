from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmailValidationViewSet, DisposableEmailDomainViewSet

router = DefaultRouter()
router.register(r'emails', EmailValidationViewSet, basename='email-validation')
router.register(r'disposable-domains', DisposableEmailDomainViewSet, basename='disposable-domains')

urlpatterns = [
    path('', include(router.urls)),
]
