import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def admin_user(db):
    return User.objects.create_user(
        email="admin@lib.test", password="AdminPass1!", first_name="Admin",
        last_name="Test", role="ADMIN", is_staff=True
    )


@pytest.fixture
def member_user(db):
    return User.objects.create_user(
        email="member@lib.test", password="MemberPass1!", first_name="Jean",
        last_name="Dupont"
    )


@pytest.fixture
def author(db):
    from apps.authors.models import Author
    return Author.objects.create(first_name="Victor", last_name="Hugo",
                                 nationality="Française")


@pytest.fixture
def category(db):
    from apps.categories.models import Category
    return Category.objects.create(name="Roman", slug="roman")


@pytest.fixture
def book(db, author, category):
    from apps.books.models import Book
    return Book.objects.create(
        title="Les Misérables", author=author, category=category,
        isbn="9782070400041", publication_year=1862, copies_total=3, copies_available=3
    )


class TestAuthorAPI:
    def test_list_authors_authenticated(self, client, member_user, author):
        from rest_framework.test import APIClient
        c = APIClient()
        c.force_authenticate(user=member_user)
        res = c.get("/api/authors/")
        assert res.status_code == 200

    def test_create_author_admin(self, client, admin_user):
        from rest_framework.test import APIClient
        c = APIClient()
        c.force_authenticate(user=admin_user)
        res = c.post("/api/authors/", {
            "first_name": "Albert", "last_name": "Camus", "nationality": "Française"
        })
        assert res.status_code == 201

    def test_create_author_forbidden_for_member(self, client, member_user):
        from rest_framework.test import APIClient
        c = APIClient()
        c.force_authenticate(user=member_user)
        res = c.post("/api/authors/", {"first_name": "Test", "last_name": "Author"})
        assert res.status_code == 403


class TestBooksAPI:
    def test_list_books(self, client, member_user, book):
        from rest_framework.test import APIClient
        c = APIClient()
        c.force_authenticate(user=member_user)
        res = c.get("/api/books/")
        assert res.status_code == 200
        assert res.data["count"] >= 1

    def test_search_books(self, client, member_user, book):
        from rest_framework.test import APIClient
        c = APIClient()
        c.force_authenticate(user=member_user)
        res = c.get("/api/books/?search=Misérables")
        assert res.status_code == 200

    def test_create_book_admin(self, client, admin_user, author, category):
        from rest_framework.test import APIClient
        c = APIClient()
        c.force_authenticate(user=admin_user)
        res = c.post("/api/books/", {
            "title": "L'Étranger", "author": author.id,
            "category": category.id, "isbn": "9782070360024",
            "publication_year": 1942, "copies_total": 2, "copies_available": 2
        })
        assert res.status_code == 201


class TestBorrowingAPI:
    def test_borrow_book(self, client, member_user, book):
        from rest_framework.test import APIClient
        c = APIClient()
        c.force_authenticate(user=member_user)
        res = c.post("/api/borrowings/", {"book": book.id})
        assert res.status_code == 201

    def test_borrow_unavailable_book(self, client, member_user, book):
        from rest_framework.test import APIClient
        book.copies_available = 0
        book.save()
        c = APIClient()
        c.force_authenticate(user=member_user)
        res = c.post("/api/borrowings/", {"book": book.id})
        assert res.status_code == 400

    def test_dashboard_admin_only(self, client, admin_user, member_user):
        from rest_framework.test import APIClient
        c = APIClient()
        c.force_authenticate(user=member_user)
        res = c.get("/api/dashboard/stats/")
        assert res.status_code == 403

        c.force_authenticate(user=admin_user)
        res = c.get("/api/dashboard/stats/")
        assert res.status_code == 200
