from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import RedirectView
from django.conf.urls.static import static
from rest_framework.documentation import include_docs_urls
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/',TokenObtainPairView.as_view(), name = 'token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name = 'token_refresh'),
    path('api/', include('apps.gastos.urls')),
    path('api/', include('apps.users.urls')),
    path('', RedirectView.as_view(url='http://localhost:5173', permanent=False)),
    path("api/docs/", include_docs_urls(title="Password Generator API")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

