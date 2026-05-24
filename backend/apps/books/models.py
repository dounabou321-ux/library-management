# apps/books/models.py
from django.db import models
from apps.authors.models import Author
from apps.categories.models import Category


class Book(models.Model):
    title = models.CharField(max_length=250)
    author = models.ForeignKey(Author, on_delete=models.SET_NULL,
                               null=True, related_name="books")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL,
                                 null=True, related_name="books")
    isbn = models.CharField(max_length=20, unique=True, null=True,
                            blank=True, default=None)
    description = models.TextField(blank=True)
    publication_year = models.PositiveIntegerField(null=True, blank=True)
    cover_image = models.ImageField(upload_to="books/covers/", null=True, blank=True)
    copies_total = models.PositiveIntegerField(default=1)
    copies_available = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "books"
        ordering = ["-created_at"]
        verbose_name = "Livre"

    @property
    def is_available(self):
        return self.copies_available > 0

    def __str__(self):
        return self.title
