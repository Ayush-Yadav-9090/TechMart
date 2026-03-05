# from rest_framework import generics, status, viewsets
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth import get_user_model
# from .models import UserProfile, Address
# from .serializers import (
#     UserSerializer,
#     RegisterSerializer,
#     LoginSerializer,
#     ChangePasswordSerializer,
#     UserUpdateSerializer,
#     UserProfileSerializer,
#     AddressSerializer,
#     AdminUserSerializer,
# )

# User = get_user_model()


# class RegisterView(generics.CreateAPIView):
#     """
#     User registration endpoint.
#     POST /api/auth/register/
#     """
#     queryset = User.objects.all()
#     serializer_class = RegisterSerializer
#     permission_classes = [AllowAny]
    
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
        
#         # Generate JWT tokens
#         refresh = RefreshToken.for_user(user)
        
#         return Response({
#             'user': UserSerializer(user).data,
#             'tokens': {
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             },
#             'message': 'User registered successfully'
#         }, status=status.HTTP_201_CREATED)


# class LoginView(generics.GenericAPIView):
#     """
#     User login endpoint.
#     POST /api/auth/login/
#     """
#     serializer_class = LoginSerializer
#     permission_classes = [AllowAny]
    
#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
        
#         # Generate JWT tokens
#         refresh = RefreshToken.for_user(user)
        
#         return Response({
#             'user': UserSerializer(user).data,
#             'tokens': {
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             },
#             'message': 'Login successful'
#         }, status=status.HTTP_200_OK)


# class ProfileView(generics.RetrieveUpdateAPIView):
#     """
#     Get or update user profile.
#     GET/PUT /api/auth/profile/
#     """
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_object(self):
#         return self.request.user


# class ChangePasswordView(generics.UpdateAPIView):
#     """
#     Change user password.
#     POST /api/auth/change-password/
#     """
#     serializer_class = ChangePasswordSerializer
#     permission_classes = [IsAuthenticated]
    
#     def update(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
        
#         # Set new password
#         user = request.user
#         user.set_password(serializer.validated_data['new_password'])
#         user.save()
        
#         return Response({
#             'message': 'Password changed successfully'
#         }, status=status.HTTP_200_OK)


# class UserProfileViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet for managing user profile preferences.
#     """
#     serializer_class = UserProfileSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return UserProfile.objects.filter(user=self.request.user)
    
#     def get_object(self):
#         return self.request.user.profile


# class AddressViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet for managing user addresses.
#     GET /api/auth/addresses/ - List all addresses
#     POST /api/auth/addresses/ - Create new address
#     PUT /api/auth/addresses/{id}/ - Update address
#     DELETE /api/auth/addresses/{id}/ - Delete address
#     """
#     serializer_class = AddressSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return Address.objects.filter(user=self.request.user)
    
#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)
    
#     @action(detail=True, methods=['post'])
#     def set_default(self, request, pk=None):
#         """Set address as default"""
#         address = self.get_object()
#         address.is_default = True
#         address.save()
#         return Response({
#             'message': 'Address set as default',
#             'address': AddressSerializer(address).data
#         })


# class AdminUserViewSet(viewsets.ModelViewSet):
#     """
#     Admin ViewSet for managing all users.
#     Requires admin permissions.
#     """
#     queryset = User.objects.all()
#     serializer_class = AdminUserSerializer
#     permission_classes = [IsAdminUser]
#     filterset_fields = ['role', 'is_active', 'is_verified']
#     search_fields = ['email', 'username', 'first_name', 'last_name']
#     ordering_fields = ['created_at', 'last_login']
    
#     @action(detail=True, methods=['post'])
#     def ban(self, request, pk=None):
#         """Ban/unban user"""
#         user = self.get_object()
#         user.is_active = not user.is_active
#         user.save()
        
#         return Response({
#             'message': f'User {"banned" if not user.is_active else "unbanned"} successfully',
#             'user': self.get_serializer(user).data
#         })
    
#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         """Get user statistics"""
#         total_users = User.objects.count()
#         active_users = User.objects.filter(is_active=True).count()
#         verified_users = User.objects.filter(is_verified=True).count()
#         admin_users = User.objects.filter(role='admin').count()
        
#         return Response({
#             'total_users': total_users,
#             'active_users': active_users,
#             'verified_users': verified_users,
#             'admin_users': admin_users,
#             'inactive_users': total_users - active_users,
#         })













# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import AllowAny
# from rest_framework_simplejwt.tokens import RefreshToken

# from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

# class RegisterView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()

#         tokens = RefreshToken.for_user(user)

#         return Response({
#             'user': UserSerializer(user).data,
#             'tokens': {
#                 'refresh': str(tokens),
#                 'access': str(tokens.access_token)
#             }
#         }, status=status.HTTP_201_CREATED)

# class LoginView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         user = serializer.validated_data
#         tokens = RefreshToken.for_user(user)

#         return Response({
#             'user': UserSerializer(user).data,
#             'tokens': {
#                 'refresh': str(tokens),
#                 'access': str(tokens.access_token)
#             }
#         })












from rest_framework import generics, permissions, status
# from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from .serializers import AdminUserSerializer
from core.permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
from products.models import Product
User = get_user_model()

# @api_view(['POST'])
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user
    
    #  @api_view(['POST'])
    def LoginView(request):
     return Response({"message": "Login OK"})

class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_staff:
            return Response(
                {"detail": "Admins only"},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            }
        })

class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    revenue = sum(order.total for order in Order.objects.all())
    orders_count = Order.objects.count()
    products_count = Product.objects.count()
    customers_count = User.objects.filter(is_staff=False).count()
    
    return Response({
        'revenue': revenue,
        'orders': orders_count,
        'products': products_count,
        'customers': customers_count
    })