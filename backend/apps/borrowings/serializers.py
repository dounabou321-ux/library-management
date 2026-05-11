from rest_framework import serializers
from .models import Borrowing
from apps.books.serializers import BookSerializer
from apps.users.serializers import UserSerializer


class BorrowingSerializer(serializers.ModelSerializer):
    book_detail    = BookSerializer(source="book", read_only=True)
    user_detail    = UserSerializer(source="user", read_only=True)
    is_overdue     = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()

    class Meta:
        model  = Borrowing
        fields = ("id", "user", "user_detail", "book", "book_detail", "status",
                  "borrowed_at", "due_date", "returned_at", "is_overdue",
                  "days_remaining", "notes")
        read_only_fields = ("id", "user", "status", "borrowed_at", "returned_at")
