# ═══════════════════════════════════════════════════════════
# apps/authors/models.py
# ═══════════════════════════════════════════════════════════
from django.db import models


class Author(models.Model):
    first_name  = models.CharField(max_length=100)
    last_name   = models.CharField(max_length=100)
    bio         = models.TextField(blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    birth_date  = models.DateField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table     = "authors"
        ordering     = ["last_name", "first_name"]
        verbose_name = "Auteur"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.full_name
