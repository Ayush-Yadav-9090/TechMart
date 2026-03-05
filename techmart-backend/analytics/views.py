from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from django.contrib.auth import get_user_model
from orders.models import Order
from products.models import Product
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import BasePermission
from rest_framework.decorators import api_view, permission_classes

User = get_user_model()

@api_view(["GET"])
@permission_classes([IsAdminUser])
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff==True

class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        stats = {
            "revenue": Order.objects.aggregate(total=Sum("total_amount"))["total"] or 0,
            "orders": Order.objects.count(),
            "products": Product.objects.count(),
            "customers": User.objects.count(),
        }

        recent_orders = Order.objects.select_related("user").order_by("-created_at")[:5]
        recent_orders_data = [
            {
                "order_number": o.id,
                "user": o.user.email,
                "total": o.total_amount,
                "status": o.status,
               "created_at": o.created_at,
            }
            for o in recent_orders
        ]

        return Response({
            "stats": stats,
            "recent_orders": recent_orders_data
        })
