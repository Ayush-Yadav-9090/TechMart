from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from products.serializers import ProductSerializer
from .services import (
    content_based_recommendations,
    trending_products,
    similar_user_recommendations,
    frequently_bought_together
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def for_you(request):
    qs = content_based_recommendations(request.user)
    return Response(ProductSerializer(qs, many=True).data)


@api_view(["GET"])
def trending(request):
    qs = trending_products()
    return Response(ProductSerializer(qs, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def similar_users(request):
    qs = similar_user_recommendations(request.user)
    return Response(ProductSerializer(qs, many=True).data)


@api_view(["GET"])
def frequently_paired(request, product_id):
    qs = frequently_bought_together(product_id)
    return Response(ProductSerializer(qs, many=True).data)
