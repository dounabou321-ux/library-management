# apps/borrowings/models.py
from django.db import models
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from apps.users.models import User
from apps.books.models import Book


def default_due_date():
    return timezone.now().date() + timedelta(days=14)


class Borrowing(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE",    "En cours"
        RETURNED = "RETURNED",  "Retourné"
        OVERDUE = "OVERDUE",   "En retard"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="borrowings")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="borrowings")
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    borrowed_at = models.DateField(auto_now_add=True)
    due_date = models.DateField(default=default_due_date)
    returned_at = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = "borrowings"
        ordering = ["-borrowed_at"]
        verbose_name = "Emprunt"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "book"],
                condition=Q(status="ACTIVE"),
                name="unique_active_borrowing_per_user_book",
            )
        ]

    @property
    def is_overdue(self):
        if self.status == self.Status.ACTIVE:
            return timezone.now().date() > self.due_date
        return False

    @property
    def days_remaining(self):
        if self.status == self.Status.ACTIVE:
            delta = self.due_date - timezone.now().date()
            return delta.days
        return None

    def __str__(self):
        return f"{self.user.email} → {self.book.title} [{self.status}]"
