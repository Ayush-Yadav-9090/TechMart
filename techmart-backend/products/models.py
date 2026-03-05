from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    # created_at = models.DateTimeField(auto_now_add=True)

    # class Meta:
    #     verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    # created_at = models.DateTimeField(auto_now_add=True)

    def generate_unique_slug(name):
     base_slug = slugify(name)
     slug = base_slug
     counter = 1
     while Product.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
     return slug
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    
    
    def __str__(self):
        return self.name

class Product(models.Model):
    # category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    # brand = models.ForeignKey(Brand, related_name='products', on_delete=models.CASCADE)
    category = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    # views = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)
    ai_score = models.IntegerField(default=0) # For your frontend recommendation
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_best_seller = models.BooleanField(default=False)
    sales_count = models.PositiveIntegerField(default=0)
    # is_new = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # image_url = models.URLField(blank=True, null=True)
    # main_images = models.ImageField(upload_to='products/', blank=True, null=True)
    main_image = models.ImageField(upload_to='products/main/', blank=True, null=True)

    # Optional: views count for trending products
    views = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    is_feature = models.BooleanField(default=False)

class ProductSpecification(models.Model):
    product = models.ForeignKey(Product, related_name='specifications', on_delete=models.CASCADE)
    name = models.CharField(max_length=255) # e.g., "Battery life"
    value = models.CharField(max_length=255) # e.g., "12 Hours"

