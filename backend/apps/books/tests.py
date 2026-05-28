import pytest
from datetime import timedelta
from io import BytesIO
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.utils import timezone
from PIL import Image
from apps.authors.models import Author
from apps.books.models import Book
from apps.categories.models import Category
from apps.books.management.commands import seed_books
from apps.books.services import reserve_copy, release_copy


@pytest.mark.django_db
def test_reserve_and_release_book_copy():
    author = Author.objects.create(first_name="Octavia", last_name="Butler")

    category = Category.objects.create(
        name="Science Fiction",
        slug="science-fiction",
    )

    book = Book.objects.create(
        title="Kindred",
        author=author,
        category=category,
        copies_total=2,
        copies_available=2,
    )

    reserve_copy(book)
    book.refresh_from_db()

    assert book.copies_available == 1

    release_copy(book)
    book.refresh_from_db()

    assert book.copies_available == 2


@pytest.mark.django_db
def test_book_rejects_future_published_date():
    author = Author.objects.create(first_name="Ursula", last_name="Le Guin")
    category = Category.objects.create(name="Fantasy", slug="fantasy")
    book = Book(
        title="A Wizard of Earthsea",
        author=author,
        category=category,
        published_date=timezone.now().date() + timedelta(days=1),
    )

    with pytest.raises(ValidationError):
        book.full_clean()


@pytest.mark.django_db
def test_seed_books_command_creates_popular_books_without_duplicates(monkeypatch):
    def fake_cover_bytes(self, item):
        image = Image.new("RGB", (40, 60), color=(30, 41, 59))
        output = BytesIO()
        image.save(output, format="JPEG")
        return output.getvalue()

    monkeypatch.setattr(
        seed_books.Command,
        "download_openlibrary_cover",
        fake_cover_bytes,
    )

    call_command("seed_books")
    call_command("seed_books")

    assert Book.objects.count() == len(seed_books.BOOKS)

    atomic_habits = Book.objects.get(isbn="9780735211292")
    assert atomic_habits.title == "Atomic Habits"
    assert atomic_habits.author.full_name == "James Clear"
    assert atomic_habits.category.name == "Developpement personnel"
    assert atomic_habits.pages == 320
    assert atomic_habits.publication_year == 2018
    assert atomic_habits.cover_image.name.startswith("books/covers/")
