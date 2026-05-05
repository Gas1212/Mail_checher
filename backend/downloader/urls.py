from django.urls import path
from . import views

urlpatterns = [
    path('info/', views.extract_info),
]
