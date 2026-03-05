# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from rest_framework_simplejwt.views import TokenRefreshView
# from .views import (
#     RegisterView,
#     LoginView,
#     ProfileView,
#     ChangePasswordView,
#     UserProfileViewSet,
#     AddressViewSet,
#     AdminUserViewSet,
# )

# router = DefaultRouter()
# router.register(r'profile-settings', UserProfileViewSet, basename='profile-settings')
# router.register(r'addresses', AddressViewSet, basename='addresses')
# router.register(r'admin/users', AdminUserViewSet, basename='admin-users')

# urlpatterns = [
#     path('register/', RegisterView.as_view(), name='register'),
#     path('login/', LoginView.as_view(), name='login'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('profile/', ProfileView.as_view(), name='profile'),
#     path('change-password/', ChangePasswordView.as_view(), name='change-password'),
#     path('', include(router.urls)),
# ]





from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView, AdminLoginView,AdminUserListView,AdminUserDetailView
from users.views import AdminUserListView, AdminUserDetailView, admin_dashboard_stats
from orders.views import AdminOrderListView, AdminOrderDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('admin/stats/', admin_dashboard_stats, name='admin-stats'),
     path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
     path("admin/users/", AdminUserListView.as_view()),
       path('orders/admin/', AdminOrderListView.as_view(), name='admin-orders'),
    path('orders/admin/<int:pk>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
     path("admin/users/<int:pk>/", AdminUserDetailView.as_view()),
    path('auth/admin/users/', AdminUserListView.as_view(), name='admin-users'),
]
