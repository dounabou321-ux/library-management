from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import Borrowing
from .serializers import BorrowingSerializer
from .services import borrow_book, return_book
from apps.books.models import Book


class BorrowingListCreateView(generics.ListCreateAPIView):
    """GET /api/borrowings/  POST /api/borrowings/"""
    serializer_class = BorrowingSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status"]
    search_fields = ["book__title", "user__email"]
    ordering_fields = ["borrowed_at", "due_date"]

    def get_queryset(self):
        qs = Borrowing.objects.select_related("user", "book", "book__author", "book__category")
        if self.request.user.is_admin:
            return qs
        return qs.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        book = get_object_or_404(Book, pk=request.data.get("book"), is_active=True)
        try:
            borrowing = borrow_book(user=request.user, book=book)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = BorrowingSerializer(borrowing, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BorrowingDetailView(generics.RetrieveAPIView):
    """GET /api/borrowings/<id>/"""
    serializer_class = BorrowingSerializer

    def get_queryset(self):
        qs = Borrowing.objects.select_related("user", "book")
        if self.request.user.is_admin:
            return qs
        return qs.filter(user=self.request.user)


class ReturnBookView(APIView):
    """POST /api/borrowings/<id>/return/"""

    def post(self, request, pk):
        qs = Borrowing.objects.all() if request.user.is_admin \
            else Borrowing.objects.filter(user=request.user)
        borrowing = get_object_or_404(qs, pk=pk)
        try:
            borrowing = return_book(borrowing)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(BorrowingSerializer(borrowing).data)


class MyBorrowingsView(generics.ListAPIView):
    """GET /api/borrowings/mine/ — Current user's borrowings"""
    serializer_class = BorrowingSerializer

    def get_queryset(self):
        return Borrowing.objects.filter(user=self.request.user).select_related(
            "book", "book__author"
        )
