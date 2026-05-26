from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    books_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description", "books_count", "created_at")
        read_only_fields = ("id", "slug", "created_at")
