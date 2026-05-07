from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.tts_generate, name='tts-generate'),
]
