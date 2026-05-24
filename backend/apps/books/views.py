from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Book
from .serializers import BookSerializer
from .filters import BookFilter
from apps.users.permissions import IsAdminOrReadOnly


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BookFilter
    search_fields = ["title", "author__first_name", "author__last_name",
                     "isbn", "category__name"]
    ordering_fields = ["title", "publication_year", "created_at", "copies_available"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Book.objects.select_related("author", "category").filter(is_active=True)

    def get_serializer_context(self):
        return {**super().get_serializer_context(), "request": self.request}

    @action(detail=False, methods=["get"], url_path="available")
    def available(self, request):
        qs = self.get_queryset().filter(copies_available__gt=0)
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(
                self.get_serializer(page, many=True, context={"request": request}).data
            )
        return Response(self.get_serializer(qs, many=True).data)
