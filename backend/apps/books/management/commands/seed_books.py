from datetime import date
from io import BytesIO
from textwrap import wrap
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from PIL import Image, ImageDraw, ImageFont

from apps.authors.models import Author
from apps.books.models import Book
from apps.categories.models import Category


BOOKS = [
    {
        "title": "Atomic Habits",
        "author": ("James", "Clear"),
        "description": "Un guide pratique pour construire de bonnes habitudes et eliminer les mauvaises grace a de petits changements quotidiens.",
        "category": "Developpement personnel",
        "pages": 320,
        "publication_year": 2018,
        "isbn": "9780735211292",
    },
    {
        "title": "The Midnight Library",
        "author": ("Matt", "Haig"),
        "description": "Entre la vie et la mort existe une bibliotheque infinie. Nora Seed y decouvre les vies qu'elle aurait pu vivre.",
        "category": "Fiction / Fantastique",
        "pages": 304,
        "publication_year": 2020,
        "isbn": "9780525559474",
    },
    {
        "title": "Dune",
        "author": ("Frank", "Herbert"),
        "description": "Sur la planete desertique Arrakis, Paul Atreides affronte des conflits de pouvoir, de trahison et de destinee.",
        "category": "Science-fiction",
        "pages": 896,
        "publication_year": 1965,
        "isbn": "9780441172719",
    },
    {
        "title": "L'Alchimiste",
        "author": ("Paulo", "Coelho"),
        "description": "Santiago, un jeune berger andalou part a la recherche d'un tresor et decouvre sa legende personnelle.",
        "category": "Fiction philosophique",
        "pages": 208,
        "publication_year": 1988,
        "isbn": "9780061122415",
    },
    {
        "title": "Fourth Wing",
        "author": ("Rebecca", "Yarros"),
        "description": "Violet Sorrengail integre une ecole militaire de dragons ou elle doit survivre aux epreuves, a la magie et a la guerre.",
        "category": "Fantasy / Romance",
        "pages": 528,
        "publication_year": 2023,
        "isbn": "9781649374042",
    },
    {
        "title": "The Psychology of Money",
        "author": ("Morgan", "Housel"),
        "description": "Un livre qui explique comment les emotions, les habitudes et le comportement influencent nos decisions financieres.",
        "category": "Finance / Developpement personnel",
        "pages": 256,
        "publication_year": 2020,
        "isbn": "9780857197689",
    },
    {
        "title": "1984",
        "author": ("George", "Orwell"),
        "description": "Dans une societe surveillee par Big Brother, Winston Smith cherche une verite interdite et une liberte presque impossible.",
        "category": "Dystopie",
        "pages": 328,
        "publication_year": 1949,
        "isbn": "9780451524935",
    },
    {
        "title": "To Kill a Mockingbird",
        "author": ("Harper", "Lee"),
        "description": "Un roman sur l'enfance, la justice et le racisme dans l'Amerique du Sud, raconte a travers le regard de Scout Finch.",
        "category": "Classique",
        "pages": 336,
        "publication_year": 1960,
        "isbn": "9780061120084",
    },
    {
        "title": "The Hobbit",
        "author": ("J.R.R.", "Tolkien"),
        "description": "Bilbo Baggins quitte sa vie tranquille pour accompagner des nains vers un royaume perdu garde par un dragon.",
        "category": "Fantasy",
        "pages": 310,
        "publication_year": 1937,
        "isbn": "9780547928227",
    },
    {
        "title": "Harry Potter and the Sorcerer's Stone",
        "author": ("J.K.", "Rowling"),
        "description": "Harry decouvre qu'il est sorcier et entre a Poudlard, ou l'attendent amities, mysteres et dangers.",
        "category": "Fantasy",
        "pages": 309,
        "publication_year": 1997,
        "isbn": "9780590353427",
    },
    {
        "title": "Educated",
        "author": ("Tara", "Westover"),
        "description": "Le recit autobiographique d'une jeune femme qui quitte une enfance isolee pour acceder a l'education et se reconstruire.",
        "category": "Memoire",
        "pages": 352,
        "publication_year": 2018,
        "isbn": "9780399590504",
    },
    {
        "title": "Becoming",
        "author": ("Michelle", "Obama"),
        "description": "Michelle Obama raconte son parcours, de Chicago a la Maison-Blanche, avec sincerite et force.",
        "category": "Biographie",
        "pages": 448,
        "publication_year": 2018,
        "isbn": "9781524763138",
    },
    {
        "title": "Project Hail Mary",
        "author": ("Andy", "Weir"),
        "description": "Un scientifique se reveille seul dans l'espace et doit sauver l'humanite en resolvant un mystere cosmique.",
        "category": "Science-fiction",
        "pages": 496,
        "publication_year": 2021,
        "isbn": "9780593135204",
    },
    {
        "title": "Sapiens",
        "author": ("Yuval Noah", "Harari"),
        "description": "Une histoire accessible de l'humanite, de l'apparition d'Homo sapiens aux revolutions qui ont transforme le monde.",
        "category": "Histoire",
        "pages": 464,
        "publication_year": 2011,
        "isbn": "9780062316097",
    },
    {
        "title": "The Little Prince",
        "author": ("Antoine de", "Saint-Exupery"),
        "description": "Un conte poetique ou un petit prince venu d'une autre planete explore l'amitie, l'amour et le sens de la vie.",
        "category": "Conte philosophique",
        "pages": 96,
        "publication_year": 1943,
        "isbn": "9780156012195",
    },
    {
        "title": "Pride and Prejudice",
        "author": ("Jane", "Austen"),
        "description": "Elizabeth Bennet et Mr Darcy s'affrontent entre orgueil, prejuges et sentiments dans l'Angleterre du XIXe siecle.",
        "category": "Classique / Romance",
        "pages": 432,
        "publication_year": 1813,
        "isbn": "9780141439518",
    },
]


class Command(BaseCommand):
    help = "Seed the catalog with popular books and cover images."

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for item in BOOKS:
            author = self.get_author(item["author"])
            category = self.get_category(item["category"])
            defaults = {
                "title": item["title"],
                "author": author,
                "category": category,
                "description": item["description"],
                "published_date": date(item["publication_year"], 1, 1),
                "publication_year": item["publication_year"],
                "pages": item["pages"],
                "copies_total": 5,
                "copies_available": 5,
                "is_active": True,
            }
            book, created = Book.objects.update_or_create(
                isbn=item["isbn"],
                defaults=defaults,
            )
            self.ensure_cover(book, item)

            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete: {created_count} created, {updated_count} updated."
            )
        )

    def get_author(self, author_name):
        first_name, last_name = author_name
        author, _ = Author.objects.update_or_create(
            first_name=first_name,
            last_name=last_name,
            defaults={},
        )
        return author

    def get_category(self, name):
        category, _ = Category.objects.update_or_create(
            slug=slugify(name),
            defaults={
                "name": name,
                "description": f"Livres populaires de la categorie {name}.",
            },
        )
        return category

    def ensure_cover(self, book, item):
        filename = f"{slugify(item['title'])}-{item['isbn']}.jpg"
        if book.cover_image and book.cover_image.name.endswith(filename):
            return

        cover_bytes = self.download_openlibrary_cover(item["isbn"])
        if not cover_bytes:
            cover_bytes = self.generate_cover(item)

        book.cover_image.save(filename, ContentFile(cover_bytes), save=True)

    def download_openlibrary_cover(self, isbn):
        url = f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false"
        request = Request(url, headers={"User-Agent": "LibraryManagementSeeder/1.0"})

        try:
            with urlopen(request, timeout=12) as response:
                content_type = response.headers.get("Content-Type", "")
                data = response.read()
        except (HTTPError, URLError, TimeoutError):
            return None

        if "image" not in content_type or len(data) < 1000:
            return None
        return data

    def generate_cover(self, item):
        image = Image.new("RGB", (600, 900), color=(30, 41, 59))
        draw = ImageDraw.Draw(image)
        title_font = ImageFont.load_default(size=42)
        author_font = ImageFont.load_default(size=28)
        meta_font = ImageFont.load_default(size=22)

        draw.rectangle((32, 32, 568, 868), outline=(226, 232, 240), width=3)
        y = 150
        for line in wrap(item["title"], width=18):
            draw.text((70, y), line, fill=(248, 250, 252), font=title_font)
            y += 54

        author = f"{item['author'][0]} {item['author'][1]}"
        draw.text((70, 640), author, fill=(203, 213, 225), font=author_font)
        draw.text(
            (70, 700),
            f"{item['category']} - {item['publication_year']}",
            fill=(148, 163, 184),
            font=meta_font,
        )

        output = BytesIO()
        image.save(output, format="JPEG", quality=92)
        return output.getvalue()
