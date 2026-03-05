
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, filters,permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product,ProductImage
from .serializers import CategorySerializer, ProductSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Category, Brand, Product, ProductImage
from .serializers import BrandSerializer,CategorySerializer,  ProductSerializer
from django.utils.text import slugify
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # lookup_field = 'slug'
    lookup_field = 'id'
    permission_classes = [permissions.AllowAny]
class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by("-created_at")
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = "id"
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'is_best_seller', 'brand']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']
    
    def get_queryset(self):
     return Product.objects.filter(is_active=True).order_by('-created_at')

    def get_serializer_context(self):
      context = super().get_serializer_context()
      context['request'] = self.request
      return context

    

        # 🔒 ADMIN-ONLY ACTIONS
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()


  

    # def perform_create(self, serializer):
    #     """
    # #     Handles creation of Product and attaches uploaded images.
    # #     """
    #     # Auto-generate SKU if not provided
    #     sku = serializer.validated_data.get('sku')
    #     if not sku:
    #         serializer.validated_data['sku'] = f'SKU-{Product.objects.count() + 1}'
        
       

    #     # Save product
    #     product = serializer.save()


    #     images = self.request.FILES.getlist("images")
    #     # MAIN IMAGE (explicit)
    #     main_image = self.request.FILES.get("main_image")
    #     if main_image:
    #         product.main_image = main_image
    #         product.save(update_fields=["main_image"])

    #     # if images:
    #     #  product.main_image = images[0]
    #     #  product.save()

    #     # Attach multiple extra images (optional)
    #     # images = self.request.FILES.getlist('images')
    #     # for img in images:
    #     #     ProductImage.objects.create(product=product, image=img)

    #    # GALLERY IMAGES
    #     images = self.request.FILES.getlist("images")
    #     for img in images:
    #         ProductImage.objects.create(product=product, image=img)

        
    #     if images:
    #         product.main_image = images[0]
    #         product.save(update_fields=["main_image"])

    #     # Save gallery images
    #     for img in images [1:]:
    #         ProductImage.objects.create(
    #             product=product,
    #             image=img,
    #         )


    def perform_create(self, serializer):
     """
       Clean, correct product + image creation
     """

    # Auto-generate SKU if not provided
     if not serializer.validated_data.get("sku"):
        serializer.validated_data["sku"] = f"SKU-{Product.objects.count() + 1}"

    # Save product FIRST
     product = serializer.save()

    # =========================
    # MAIN IMAGE (ONLY THIS)
    # =========================
     main_image = self.request.FILES.get("main_image")
     if main_image:
        product.main_image = main_image
        product.save(update_fields=["main_image"])

    # =========================
    # EXTRA / GALLERY IMAGES
    # =========================
     images = self.request.FILES.getlist("images[]")
     for img in images[0:1]:
        ProductImage.objects.create(
            product=product,
            image=img
        )


    def perform_update(self, serializer):
        """
        Handles updates of Product, including new uploaded images.
        """
        product = serializer.save()

        # Optional: handle new uploaded images on update
        images = self.request.FILES.getlist('images')
        for img in images:
            ProductImage.objects.create(product=product, image=img)

    @action(detail=True, methods=['post'])
    def increment_views(self, request, id=None):
        product = self.get_object()
        product.views += 1
        
        product.save(update_fields=['views'])
        return Response({'views': product.views}, status=status.HTTP_200_OK)


  
   
    # def get_queryset(self):
    #     queryset = Product.objects.all()
    #     category_slug = self.request.query_params.get('category')
    #     if category_slug:
    #         queryset = queryset.filter(category__slug=category_slug)
    #     return queryset
  
    # @action(detail=False, methods=['get'])
    # def latest(self, request):
    #     products = self.get_queryset().order_by('-created_at')[:10]
    #     serializer = self.get_serializer(products, many=True)
    #     return Response(serializer.data)

    # @action(detail=False, methods=['get'])
    # def latest(self, request):
    #     products = Product.objects.order_by('-created_at')[:8]
    #     return Response(ProductSerializer(products, many=True).data)
    
    
    # # @action(detail=False, methods=['get'])
    # # def trending(self, request):
    # #     products = self.get_queryset().order_by('-ai_score')[:10]
    # #     serializer = self.get_serializer(products, many=True)
    # #     return Response(serializer.data)

    # @action(detail=False, methods=['get'])
    # def trending(self, request):
    #     products = Product.objects.order_by('-views')[:8]
    #     return Response(ProductSerializer(products, many=True).data)


    


    # # @action(detail=False, methods=['get'])
    # # def bestsellers(self, request):
    # #     products = self.get_queryset().filter(is_best_seller=True)
    # #     serializer = self.get_serializer(products, many=True)
    # #     return Response(serializer.data)


    # @action(detail=False, methods=['get'])
    # def bestsellers(self, request):
    #     products = Product.objects.order_by('-sales_count')[:8]
    #     return Response(ProductSerializer(products, many=True).data)


    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def latest(self, request):
     products = self.get_queryset().order_by('-created_at')[:8]
     serializer = self.get_serializer(products, many=True)
     return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def trending(self, request):
     products = self.get_queryset().order_by('-views')[:8]
     serializer = self.get_serializer(products, many=True)
     return Response(serializer.data)
    # @action(detail=False, methods=['get'])
    # def trending(self, request):
    #  products = Product.objects.order_by('-views')[:8]
    #  return Response(ProductSerializer(products, many=True).data)


    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def bestsellers(self, request):
     products = self.get_queryset().order_by('-sales_count')[:8]
     serializer = self.get_serializer(products, many=True)
     return Response(serializer.data)
    
   
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def ai_recommendation(self, request):
     products = Product.objects.order_by('-views')[:10]
     serializer = self.get_serializer(products, many=True)
     return Response(serializer.data)

   
    # @action(detail=True, methods=['post'])
    # def increment_views(self, request, pk=None):
    #  product = self.get_object()
    #  product.views += 1
    #  product.save(update_fields=['views'])
    #  return Response({'views': product.views})



    # @action(detail=False, methods=["get"])
    # def latest(self, request):
    #     products = self.get_queryset().order_by("-created_at")[:8]
    #     return Response(self.get_serializer(products, many=True).data)

    # @action(detail=False, methods=["get"])
    # def trending(self, request):
    #     products = self.get_queryset().order_by("-views")[:8]
    #     return Response(self.get_serializer(products, many=True).data)

    # @action(detail=False, methods=["get"])
    # def bestsellers(self, request):
    #     products = self.get_queryset().order_by("-sales_count")[:8]
    #     return Response(self.get_serializer(products, many=True).data)

class ProductCreateView(viewsets.ReadOnlyModelViewSet):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # EXTRA IMAGES
        images = request.FILES.getlist("images[]")
        for img in images:
            ProductImage.objects.create(
                product=product,
                image=img
            )

        return Response(serializer.data, status=201)













