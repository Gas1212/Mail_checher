from django.urls import path
from . import views

urlpatterns = [
    path('remove/', views.remove_background, name='remove-background'),
]
