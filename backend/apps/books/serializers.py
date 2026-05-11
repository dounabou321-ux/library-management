from rest_framework import serializers
from .models import Book
from apps.authors.serializers import AuthorSerializer
from apps.categories.serializers import CategorySerializer


class BookSerializer(serializers.ModelSerializer):
    author_detail   = AuthorSerializer(source="author", read_only=True)
    category_detail = CategorySerializer(source="category", read_only=True)
    is_available    = serializers.ReadOnlyField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model  = Book
        fields = (
            "id", "title", "author", "author_detail", "category", "category_detail",
            "isbn", "description", "publication_year", "cover_image", "cover_image_url",
            "copies_total", "copies_available", "is_available", "is_active", "created_at"
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_cover_image_url(self, obj):
        request = self.context.get("request")
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def validate_isbn(self, value):
        return value or None

    def validate(self, attrs):
        total     = attrs.get("copies_total", getattr(self.instance, "copies_total", 1))
        available = attrs.get("copies_available", getattr(self.instance, "copies_available", 1))
        if available > total:
            raise serializers.ValidationError(
                {"copies_available": "Ne peut pas dépasser le nombre total d'exemplaires."}
            )
        return attrs
