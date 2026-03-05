# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import OrderViewSet

# router = DefaultRouter()
# router.register(r'', OrderViewSet, basename='orders')

# urlpatterns = [
#     path('', include(router.urls)),
# ]








from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, OrderViewSet, AdminOrderListView



router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='orders')

urlpatterns = [
    path('', include(router.urls)),
    path("admin/", AdminOrderListView.as_view(), name="admin-orders"),
    
]

