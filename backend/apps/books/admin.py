from django.contrib import admin
from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "author",
        "category",
        "published_date",
        "pages",
        "copies_total",
        "copies_available",
        "is_active",
    )
    list_filter = ("is_active", "category", "published_date")
    search_fields = (
        "title",
        "author__first_name",
        "author__last_name",
        "isbn",
    )
    list_editable = ("copies_available", "is_active")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("title", "author", "category", "description")}),
        (
            "Publication",
            {
                "fields": (
                    "isbn",
                    "published_date",
                    "publication_year",
                    "pages",
                    "cover_image",
                ),
            },
        ),
        (
            "Inventory",
            {"fields": ("copies_total", "copies_available", "is_active")},
        ),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
