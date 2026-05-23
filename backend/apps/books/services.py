"""
Business logic layer — keeps views thin.
"""
from django.db import transaction
from .models import Book


def can_borrow(book: Book) -> bool:
    return book.is_active and book.copies_available > 0


def reserve_copy(book: Book) -> Book:
    """Atomically decrement available copies."""
    with transaction.atomic():
        b = Book.objects.select_for_update().get(pk=book.pk)
        if not can_borrow(b):
            raise ValueError(f"Le livre « {b.title} » n'est pas disponible.")
        b.copies_available -= 1
        b.save(update_fields=["copies_available"])
    return b


def release_copy(book: Book) -> Book:
    """Atomically increment available copies on return."""
    with transaction.atomic():
        b = Book.objects.select_for_update().get(pk=book.pk)
        if b.copies_available < b.copies_total:
            b.copies_available += 1
            b.save(update_fields=["copies_available"])
    return b
