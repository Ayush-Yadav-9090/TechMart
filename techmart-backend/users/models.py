# File: users/models.py
from django.contrib.auth.models import AbstractUser,  PermissionsMixin, BaseUserManager
from django.db import models
from .managers import UserManager

class User(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('vendor', 'Vendor'),
    )
    # This is where your custom fields go (e.g., bio, phone)
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)

    # is_staff = models.BooleanField(default=False)
    # is_superuser = models.BooleanField(default=False)

    is_verified = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, null=True, blank=True)
    role=models.CharField(max_length=20,choices=ROLE_CHOICES,default='customer')

    # Add these two lines to fix the "Reverse Accessor" error
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='techmart_user_set', # This must be unique
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='techmart_user_permissions_set', # This must be unique
        blank=True
    )
    object=UserManager()
    USERNAME_FIELD='email' # Link the customer manager
    REQUIRED_FIELDS=['username'] # 'email' is already the username field 
    def __str__(self):
        return self.username


