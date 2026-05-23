"""
Borrowing business logic - separated from views.
"""
from django.db import IntegrityError, transaction
from django.utils import timezone

from .models import Borrowing
from apps.books.services import release_copy, reserve_copy


def borrow_book(user, book) -> Borrowing:
    with transaction.atomic():
        if Borrowing.objects.filter(user=user, book=book, status="ACTIVE").exists():
            raise ValueError("Vous empruntez deja ce livre.")
        reserve_copy(book)
        try:
            return Borrowing.objects.create(user=user, book=book)
        except IntegrityError as exc:
            raise ValueError("Vous empruntez deja ce livre.") from exc


def return_book(borrowing: Borrowing) -> Borrowing:
    with transaction.atomic():
        borrowing = Borrowing.objects.select_for_update().select_related("book").get(pk=borrowing.pk)
        if borrowing.status == Borrowing.Status.RETURNED:
            raise ValueError("Ce livre a deja ete retourne.")
        borrowing.status = Borrowing.Status.RETURNED
        borrowing.returned_at = timezone.now().date()
        borrowing.save(update_fields=["status", "returned_at"])
        release_copy(borrowing.book)
        return borrowing
