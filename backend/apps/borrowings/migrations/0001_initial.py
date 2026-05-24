# Generated manually to stabilize the initial migration graph.
import apps.borrowings.models
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("books", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Borrowing",
            fields=[
                ("id", models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "status",
                    models.CharField(
                        choices=[("ACTIVE", "En cours"), ("RETURNED", "Retourné"),
                                 ("OVERDUE", "En retard")],
                        default="ACTIVE",
                        max_length=10,
                    ),
                ),
                ("borrowed_at", models.DateField(auto_now_add=True)),
                ("due_date", models.DateField(default=apps.borrowings.models.default_due_date)),
                ("returned_at", models.DateField(blank=True, null=True)),
                ("notes", models.TextField(blank=True)),
                (
                    "book",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="borrowings",
                        to="books.book",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="borrowings",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Emprunt",
                "db_table": "borrowings",
                "ordering": ["-borrowed_at"],
                "constraints": [
                    models.UniqueConstraint(
                        condition=models.Q(("status", "ACTIVE")),
                        fields=("user", "book"),
                        name="unique_active_borrowing_per_user_book",
                    )
                ],
            },
        ),
    ]
