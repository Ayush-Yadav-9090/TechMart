from django.contrib import admin
from .models import Order, OrderItem
from core.permissions import IsAdmin
from .serializers import OrderSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'total', 'created_at']
    list_filter = ['status', 'is_paid', 'created_at']
    search_fields = ['order_number', 'user__email']
    inlines = [OrderItemInline]

class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdmin]