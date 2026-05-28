import pytest
from datetime import timedelta
from django.core.exceptions import ValidationError
from django.utils import timezone
from apps.authors.models import Author
from apps.books.models import Book
from apps.categories.models import Category
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
