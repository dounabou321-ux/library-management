# Generated manually to stabilize the initial migration graph.
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("authors", "0001_initial"),
        ("categories", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Book",
            fields=[
                ("id", models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=250)),
                ("isbn", models.CharField(blank=True, default=None, max_length=20, null=True, unique=True)),
                ("description", models.TextField(blank=True)),
                ("publication_year", models.PositiveIntegerField(blank=True, null=True)),
                ("cover_image", models.ImageField(blank=True, null=True, upload_to="books/covers/")),
                ("copies_total", models.PositiveIntegerField(default=1)),
                ("copies_available", models.PositiveIntegerField(default=1)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "author",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="books",
                        to="authors.author",
                    ),
                ),
                (
                    "category",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="books",
                        to="categories.category",
                    ),
                ),
            ],
            options={
                "verbose_name": "Livre",
                "db_table": "books",
                "ordering": ["-created_at"],
            },
        ),
    ]
