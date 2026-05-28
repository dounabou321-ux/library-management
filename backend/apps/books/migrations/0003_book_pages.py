from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("books", "0002_book_published_date"),
    ]

    operations = [
        migrations.AddField(
            model_name="book",
            name="pages",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
