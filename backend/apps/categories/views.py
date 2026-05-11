from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from django.utils.text import slugify
from django.db.models import Count
from .models import Category
from .serializers import CategorySerializer
from apps.users.permissions import IsAdminOrReadOnly

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class   = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends    = [SearchFilter]
    search_fields      = ["name"]
    lookup_field       = "slug"

    def get_queryset(self):
        return Category.objects.annotate(books_count=Count("books"))

    def _unique_slug(self, name, instance=None):
        base_slug = slugify(name) or "category"
        slug = base_slug
        suffix = 2
        queryset = Category.objects.all()
        if instance is not None:
            queryset = queryset.exclude(pk=instance.pk)

        while queryset.filter(slug=slug).exists():
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        return slug

    def perform_create(self, serializer):
        serializer.save(slug=self._unique_slug(serializer.validated_data["name"]))

    def perform_update(self, serializer):
        name = serializer.validated_data.get("name", serializer.instance.name)
        serializer.save(slug=self._unique_slug(name, serializer.instance))
