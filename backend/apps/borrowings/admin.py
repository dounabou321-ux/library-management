from django.contrib import admin
from .models import Borrowing


@admin.register(Borrowing)
class BorrowingAdmin(admin.ModelAdmin):
    list_display = ("user", "book", "status", "borrowed_at", "due_date", "returned_at")
    list_filter = ("status",)
    search_fields = ("user__email", "book__title")
    readonly_fields = ("borrowed_at",)
