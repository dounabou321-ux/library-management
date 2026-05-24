from django.contrib import admin
from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "copies_total",
                    "copies_available", "is_active")
    list_filter = ("is_active", "category")
    search_fields = ("title", "author__last_name", "isbn")
    list_editable = ("copies_available", "is_active")
