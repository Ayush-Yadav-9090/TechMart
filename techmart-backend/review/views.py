# from django.shortcuts import render

# # Create your views here.
# from rest_framework import viewsets, permissions
# from django_filters.rest_framework import DjangoFilterBackend
# from .models import Review
# from .serializers import ReviewSerializer

# class ReviewViewSet(viewsets.ModelViewSet):
#     serializer_class = ReviewSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]
#     filter_backends = [DjangoFilterBackend]
#     filterset_fields = ["product"]

#     # def get_queryset(self):
#     #     queryset = Review.objects.select_related('user', 'product')
#     #     product_id = self.request.query_params.get('product')

#     #     if product_id:
#     #         queryset = queryset.filter(product_id=product_id)

#     #     return queryset

#     def get_queryset(self):
#         return Review.objects.select_related("user", "product")


#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)



# from rest_framework.viewsets import ModelViewSet
# from rest_framework.permissions import IsAuthenticatedOrReadOnly
# from django_filters.rest_framework import DjangoFilterBackend
# from .models import Review
# from .serializers import ReviewSerializer

# class ReviewViewSet(ModelViewSet):
#     serializer_class = ReviewSerializer
#     permission_classes = [IsAuthenticatedOrReadOnly]
#     filter_backends = [DjangoFilterBackend]
#     filterset_fields = ["product", "category"]
#     queryset = Review.objects.all().order_by('-created_at')

#     def get_queryset(self):
#         queryset = Review.objects.select_related("user", "product").all()
#         product_id = self.request.query_params.get("product")
#         if product_id:
#             queryset = queryset.filter(product_id=product_id)
#         return queryset

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)




from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend

from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.objects.select_related("user", "product").all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["product", "category"]

    # -------------------------
    # Queryset Logic
    # -------------------------
    def get_queryset(self):
        qs = Review.objects.select_related("user", "product").order_by("-created_at")

        product_id = self.request.query_params.get("product")

       
        # Product reviews → public
        if product_id:
            filtered = qs.filter(product_id=product_id)
            print("DEBUG filtered count =", filtered.count())
            return filtered

        # Global feedback → admin only
        if not self.request.user.is_staff:
            return qs.none()

        return qs

    # -------------------------
    # Permissions Logic
    # -------------------------
    def get_permissions(self):
        # anyone logged-in can create
        if self.action == "create":
            return [IsAuthenticatedOrReadOnly()]


        if self.action in ["list", "retrieve", "create"]:
            return [IsAuthenticatedOrReadOnly()]
        return [IsAdminUser()]


    # -------------------------
    # Auto attach user
    # -------------------------
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
 