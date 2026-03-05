# from rest_framework import serializers
# from .models import Category, Brand, Product, ProductImage, ProductSpecification

# class CategorySerializer(serializers.ModelSerializer):
#     products_count = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Category
#         fields = ['id', 'name', 'slug', 'description', 'image', 'is_active', 'products_count']
    
#     def get_products_count(self, obj):
#         return obj.products.filter(is_active=True).count()

# class BrandSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Brand
#         fields = ['id', 'name', 'slug', 'description', 'logo', 'website']

# class ProductImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductImage
#         fields = ['id', 'image', 'alt_text', 'is_primary']

# class ProductSpecificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductSpecification
#         fields = ['id', 'name', 'value']

# class ProductListSerializer(serializers.ModelSerializer):
#     category_name = serializers.CharField(source='category.name', read_only=True)
#     brand_name = serializers.CharField(source='brand.name', read_only=True)
#     primary_image = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Product
#         fields = [
#             'id', 'name', 'slug', 'price', 'original_price', 'category_name',
#             'brand_name', 'stock', 'is_new', 'is_best_seller', 'average_rating',
#             'review_count', 'primary_image', 'discount_percentage'
#         ]
    
#     def get_primary_image(self, obj):
#         image = obj.images.filter(is_primary=True).first()
#         if image:
#             return self.context['request'].build_absolute_uri(image.image.url)
#         return None

# class ProductDetailSerializer(serializers.ModelSerializer):
#     category = CategorySerializer(read_only=True)
#     brand = BrandSerializer(read_only=True)
#     images = ProductImageSerializer(many=True, read_only=True)
#     specifications = ProductSpecificationSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = Product
#         fields = '__all__'











from rest_framework import serializers
from .models import Category, Product,ProductImage, Brand

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_feature']

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    # category_name = serializers.ReadOnlyField(source='category.name')
    # brand_name = serializers.ReadOnlyField(source='brand.name')
    category_name = serializers.ReadOnlyField(source='category')
    brand_name = serializers.ReadOnlyField(source='brand')

    # main_image = serializers.ImageField(source='main_images', read_only=True)
    # average_rating = serializers.SerializerMethodField()
    # main_images = serializers.ImageField(required=False)
    sku = serializers.CharField(required=False)
    images = ProductImageSerializer(many=True, read_only=True)  # extra images
    main_image = serializers.SerializerMethodField()


    class Meta:
        model = Product
        fields = [
             'id',
            'name',
            'slug',
            'price',
            'stock',
            'description',
            'category',
            'category_name',
            'brand',
            'brand_name',
            'sku',
            # 'main_images',
            'main_image', 
            'images',
            'is_active',
            'is_featured',
            'is_best_seller',
            'created_at',
        ]
    # def get_average_rating(self, obj):
    #     avg = obj.reviews.aggregate(avg=avg("rating"))["avg"]
    #     return round(avg or 0, 1)
    
    # def get_image(self, obj):
    #     request = self.context.get('request')
    #     if obj.main_images and request:
    #          return request.build_absolute_uri(obj.main_images.url)
    #     return None
    
    def create(self, validated_data):
        validated_data.setdefault("is_active", True)
        return super().create(validated_data) 
    
    def get_main_image(self, obj):
        request = self.context.get("request")
        if obj.main_image and request:
            return request.build_absolute_uri(obj.main_image.url)
        return None






