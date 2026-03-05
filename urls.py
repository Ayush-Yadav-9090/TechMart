from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
   path('admin/', admin.site.urls),

    path('api/auth/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path("api/", include("reviews.urls")),
    path('api/orders/', include('orders.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/admin/', include('admin_dashboard.urls')),
    path("api/", include("reviews.urls")),
    path("api/ai/", include("ai_engine.urls")),

   
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
