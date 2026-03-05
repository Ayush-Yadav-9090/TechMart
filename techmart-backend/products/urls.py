# # Product endpoints

# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import CategoryViewSet, BrandViewSet, ProductViewSet

# router = DefaultRouter()
# router.register(r'categories', CategoryViewSet)
# router.register(r'brands', BrandViewSet)
# router.register(r'', ProductViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
# ]



# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import CategoryViewSet, ProductViewSet

# router = DefaultRouter()
# router.register(r'categories', CategoryViewSet)
# router.register(r'', ProductViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet ,BrandViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet,basename='categories')
router.register(r'brands', BrandViewSet, basename='brands') 
router.register(r'', ProductViewSet,basename='products')


urlpatterns = [
    path('', include(router.urls)),
]
