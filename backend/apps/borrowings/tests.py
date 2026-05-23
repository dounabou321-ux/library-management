import pytest
from apps.authors.models import Author
from apps.books.models import Book
from apps.borrowings.services import borrow_book, return_book
from apps.categories.models import Category
from apps.users.models import User


@pytest.mark.django_db
def test_borrow_and_return_updates_stock():
    user = User.objects.create_user(email="member@example.com", password="pass12345", first_name="Test", last_name="Member")
    author = Author.objects.create(first_name="Ursula", last_name="Le Guin")
    category = Category.objects.create(name="Fantasy", slug="fantasy")
    book = Book.objects.create(title="A Wizard of Earthsea", author=author, category=category, copies_total=1, copies_available=1)

    borrowing = borrow_book(user, book)
    book.refresh_from_db()
    assert borrowing.status == "ACTIVE"
    assert book.copies_available == 0

    return_book(borrowing)
    book.refresh_from_db()
    borrowing.refresh_from_db()
    assert borrowing.status == "RETURNED"
    assert book.copies_available == 1
