from django.urls import path
from . import views

urlpatterns = [
    path('sites/', views.site_list),
    path('sites/<int:site_id>/reviews/', views.add_review),
]
