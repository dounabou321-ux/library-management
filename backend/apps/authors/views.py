from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from .models import Author
from .serializers import AuthorSerializer
from .filters import AuthorFilter
from apps.users.permissions import IsAdminOrReadOnly

class AuthorViewSet(viewsets.ModelViewSet):
    serializer_class   = AuthorSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends    = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class    = AuthorFilter
    search_fields      = ["first_name", "last_name", "nationality"]
    ordering_fields    = ["last_name", "created_at"]

    def get_queryset(self):
        return Author.objects.annotate(books_count=Count("books")).order_by("last_name")
