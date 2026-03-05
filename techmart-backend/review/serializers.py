# from rest_framework import serializers
# from .models import Review

# class ReviewSerializer(serializers.ModelSerializer):
#     user_name = serializers.CharField(source="user.email", read_only=True)

#     class Meta:
#         model = Review
#         fields = [
#              "id",
#             "product",
#             "user",
#             "user_name",
#             "rating",
#             "title",
#             "comment",
#             "created_at",
#         ]
#         read_only_fields = ["user", "created_at"]





from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product',  'user_email', 'user', 'rating', 'category', 'title', 'feedback', 'created_at']
        read_only_fields = ["user", "created_at"]
