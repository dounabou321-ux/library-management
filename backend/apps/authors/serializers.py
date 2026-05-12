from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    full_name    = serializers.ReadOnlyField()
    books_count  = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model  = Author
        fields = ("id", "first_name", "last_name", "full_name", "bio",
                  "nationality", "birth_date", "books_count", "created_at")
        read_only_fields = ("id", "created_at")
