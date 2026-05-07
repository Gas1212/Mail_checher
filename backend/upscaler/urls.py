from django.urls import path
from . import views

urlpatterns = [
    path('upscale/', views.upscale, name='upscale'),
]
