from django.utils import timezone
from rest_framework import serializers

from .models import Book
from apps.authors.serializers import AuthorSerializer
from apps.categories.serializers import CategorySerializer


ALLOWED_IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024


class BookSerializer(serializers.ModelSerializer):
    author_detail = AuthorSerializer(source="author", read_only=True)
    category_detail = CategorySerializer(source="category", read_only=True)
    is_available = serializers.ReadOnlyField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "author",
            "author_detail",
            "category",
            "category_detail",
            "isbn",
            "description",
            "published_date",
            "publication_year",
            "pages",
            "cover_image",
            "cover_image_url",
            "copies_total",
            "copies_available",
            "is_available",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_cover_image_url(self, obj):
        request = self.context.get("request")
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def validate_isbn(self, value):
        return value or None

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Title is required.")
        return value

    def validate_published_date(self, value):
        if value and value > timezone.now().date():
            raise serializers.ValidationError(
                "Published date cannot be in the future."
            )
        return value

    def validate_cover_image(self, value):
        if not value:
            return value

        content_type = getattr(value, "content_type", "")
        if content_type and content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
            raise serializers.ValidationError(
                "Cover image must be a JPG, PNG, or WebP file."
            )
        if value.size > MAX_COVER_IMAGE_SIZE:
            raise serializers.ValidationError(
                "Cover image must be 5 MB or smaller."
            )
        return value

    def validate(self, attrs):

        total = attrs.get(
            "copies_total",
            getattr(self.instance, "copies_total", 1),
        )
        available = attrs.get(
            "copies_available",
            getattr(self.instance, "copies_available", 1),
        )

        total = attrs.get("copies_total", getattr(self.instance, "copies_total", 1))
        available = attrs.get("copies_available", getattr(self.instance, "copies_available", 1))

        if available > total:
            raise serializers.ValidationError(
                {
                    "copies_available": (
                        "Available copies cannot exceed total copies."
                    ),
                }
            )
        return attrs
