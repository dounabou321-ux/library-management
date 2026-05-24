from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as Base
from .models import User


@admin.register(User)
class UserAdmin(Base):
    list_display = ("email", "full_name", "role", "is_active", "created_at")
    list_filter = ("role", "is_active")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("-created_at",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Infos", {"fields": ("first_name", "last_name", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )
    add_fieldsets = (
        (None, {"fields": ("email", "first_name", "last_name", "password1", "password2", "role")}),
    )
