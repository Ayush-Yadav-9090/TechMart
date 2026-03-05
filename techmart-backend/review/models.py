# from django.db import models
# from django.conf import settings
# from products.models import Product
# from django.core.validators import MinValueValidator, MaxValueValidator


# class Review(models.Model):
#     product = models.ForeignKey(
#         Product,
#         related_name='reviews',
#         on_delete=models.CASCADE
#     )
#     user = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE
#     )
#     rating = models.PositiveSmallIntegerField(
#         validators=[MinValueValidator(1), MaxValueValidator(5)]
#     )
#     comment = models.TextField(blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     title = models.CharField(max_length=255) 
#     class Meta:
#         unique_together = ('product', 'user')
#         ordering = ['-created_at']

#     def __str__(self):
#         return f"{self.user} - {self.product} ({self.rating})"








from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from products.models import Product
class Review(models.Model):

    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('product', 'Product'),
        ('service', 'Service'),
        ('website', 'Website'),
        ('shipping', 'Shipping'),
        ('suggestion', 'Suggestion'),
    ]
    
    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reviews"
    )


    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=255)
    feedback = models.TextField(max_length=1000)
   
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.rating})"
