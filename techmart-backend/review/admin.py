from django.contrib import admin

# Register your models here.


from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id",
        "title",
        "category",
        "product",
        "rating",
        "user",
        "created_at")
    list_filter = ("category", "rating", "created_at")
    search_fields = ("title", "feedback", "user__email")
    ordering = ("-created_at",)
