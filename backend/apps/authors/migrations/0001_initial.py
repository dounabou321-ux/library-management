# Generated manually to stabilize the initial migration graph.
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Author",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("first_name", models.CharField(max_length=100)),
                ("last_name", models.CharField(max_length=100)),
                ("bio", models.TextField(blank=True)),
                ("nationality", models.CharField(blank=True, max_length=100)),
                ("birth_date", models.DateField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "Auteur",
                "db_table": "authors",
                "ordering": ["last_name", "first_name"],
            },
        ),
    ]
