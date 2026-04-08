from django.contrib import admin
from django.urls import path, include
from wagtail import urls as wagtail_urls
from wagtail.admin import urls as wagtailadmin_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('wagtail-admin/', include(wagtailadmin_urls)),
    path('api/blog/', include('sugesto_blog.urls')),
    path('api/', include('email_checker.urls')),
    path('api/', include('seo_tools.urls')),
    path('api/', include('content_generator.urls')),
    path('wagtail/', include(wagtail_urls)),
]
