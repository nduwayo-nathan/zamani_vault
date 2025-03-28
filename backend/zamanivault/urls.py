
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from rest_framework.documentation import include_docs_urls
from .health_check import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/content/', include('content.urls')),
    path('api/ml/', include('ml_service.urls')),
    path('api/subscriptions/', include('subscriptions.urls')),
    path('api/docs/', include_docs_urls(title='ZamaniVault API', permission_classes=[permissions.IsAuthenticated])),
    path('api/health/', health_check, name='health_check'),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
