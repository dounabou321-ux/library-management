import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookMarked,
  BookOpen,
  Search as SearchIcon,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";

import { useAuthStore } from "../store";

const BOOKS_IMAGE = {
  src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80",
  source: "https://unsplash.com/photos/8hJQKRIQZMY",
  alt: "Shelves filled with books in a warm library space",
};

const BOOKSTORE_BOOKS = [
  {
    id: 1,
    title: "The Midnight Archive",
    author: "Elena Hart",
    price: "$18.99",
    category: "Mystery",
    rating: 5,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",
    description:
      "A rare-books curator follows a trail of coded notes through a hidden city archive.",
  },
  {
    id: 2,
    title: "Designing Calm Systems",
    author: "Maya Chen",
    price: "$32.00",
    category: "Business",
    rating: 4,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=80",
    description:
      "A practical guide to building humane digital products with clarity and restraint.",
  },
  {
    id: 3,
    title: "Gardens of the Moonlit Sea",
    author: "Jonas Vale",
    price: "$21.50",
    category: "Fantasy",
    rating: 5,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
    description:
      "A lyrical fantasy about floating islands, old maps, and a botanist with a secret.",
  },
  {
    id: 4,
    title: "Modern JavaScript Patterns",
    author: "Nadia Brooks",
    price: "$44.99",
    category: "Technology",
    rating: 4,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80",
    description:
      "Clean architecture, resilient components, and production-ready patterns for teams.",
  },
  {
    id: 5,
    title: "Letters from Lisbon",
    author: "Amelia Duarte",
    price: "$16.75",
    category: "Romance",
    rating: 4,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80",
    description:
      "A warm, slow-burn story of chance meetings, old letters, and second beginnings.",
  },
  {
    id: 6,
    title: "The Data Detective",
    author: "Omar Ellis",
    price: "$27.25",
    category: "Technology",
    rating: 5,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f55770?auto=format&fit=crop&w=700&q=80",
    description:
      "A sharp introduction to analytics through memorable cases and visual storytelling.",
  },
  {
    id: 7,
    title: "Atlas of Quiet Cities",
    author: "Nora Whitman",
    price: "$24.90",
    category: "Travel",
    rating: 5,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=700&q=80",
    description:
      "A beautifully written journey through hidden streets, old bookshops, and slow mornings.",
  },
  {
    id: 8,
    title: "The Startup Library",
    author: "Daniel Reeves",
    price: "$29.99",
    category: "Business",
    rating: 4,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=80",
    description:
      "A founder-friendly playbook for strategy, teams, customer research, and focused execution.",
  },
  {
    id: 9,
    title: "Recipes for Rainy Sundays",
    author: "Clara Moreau",
    price: "$22.40",
    category: "Lifestyle",
    rating: 5,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=80",
    description:
      "Comforting recipes, thoughtful rituals, and small essays for cozy weekend cooking.",
  },
  {
    id: 10,
    title: "Python for Librarians",
    author: "Samir Haddad",
    price: "$39.00",
    category: "Technology",
    rating: 5,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=700&q=80",
    description:
      "Automation, data cleanup, APIs, and practical scripts for modern library workflows.",
  },
  {
    id: 11,
    title: "The Last Paper Lantern",
    author: "Iris Nakamura",
    price: "$19.25",
    category: "Fiction",
    rating: 4,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=700&q=80",
    description:
      "An intimate novel about memory, family archives, and a letter that changes everything.",
  },
  {
    id: 12,
    title: "Mindful Money",
    author: "Grace Collins",
    price: "$26.80",
    category: "Business",
    rating: 4,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=700&q=80",
    description:
      "A clear and calm approach to budgeting, investing, and making better financial choices.",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Catalogue complet",
    desc: "Accedez a des milliers de livres organises par categories et auteurs.",
  },
  {
    icon: SearchIcon,
    title: "Recherche avancee",
    desc: "Trouvez rapidement un livre par titre, auteur, ISBN ou categorie.",
  },
  {
    icon: BookMarked,
    title: "Gestion d'emprunts",
    desc: "Empruntez et retournez des livres facilement depuis votre espace.",
  },
  {
    icon: Users,
    title: "Espace membre",
    desc: "Suivez vos emprunts en cours et votre historique de lecture.",
  },
];

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300 dark:text-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

function StoreBookCard({ book, compact = false }) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 ${
        compact ? "grid sm:grid-cols-[160px_1fr]" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${compact ? "h-64 sm:h-full" : "h-72"}`}>
        <img
          src={book.image}
          alt={`${book.title} book cover`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-sm backdrop-blur dark:bg-gray-950/85 dark:text-primary-300">
          {book.category}
        </span>
      </div>

      <div className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {book.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {book.author}
            </p>
          </div>
          <p className="shrink-0 rounded-xl bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            {book.price}
          </p>
        </div>

        <div className="mt-3">
          <RatingStars rating={book.rating} />
        </div>

        <p className="mt-4 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {book.description}
        </p>

        <button
          type="button"
          className="btn-primary mt-5 w-full justify-center"
          aria-label={`Add ${book.title} to cart`}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [bookSearch, setBookSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(BOOKSTORE_BOOKS.map((book) => book.category))],
    []
  );

  const filteredBooks = useMemo(() => {
    const normalizedSearch = bookSearch.trim().toLowerCase();

    return BOOKSTORE_BOOKS.filter((book) => {
      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        `${book.title} ${book.author} ${book.description}`
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [bookSearch, selectedCategory]);

  const featuredBooks = BOOKSTORE_BOOKS.filter((book) => book.featured);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Bienvenue sur <span className="text-primary-200">BiblioTech</span>
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
            Gerez vos emprunts, decouvrez de nouveaux livres et accedez a votre bibliotheque en ligne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/books" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition">
                <BookOpen className="w-5 h-5" /> Parcourir les livres
              </Link>
            ) : (
              <>
                <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition">
                  Commencer maintenant
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 border border-white/40 rounded-xl font-semibold hover:bg-white/10 transition">
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Books image section */}
      <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
            <img
              src={BOOKS_IMAGE.src}
              alt={BOOKS_IMAGE.alt}
              className="h-72 sm:h-96 lg:h-[460px] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/45 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-xs text-white/85">
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                Selection bibliotheque
              </span>
              <a
                href={BOOKS_IMAGE.source}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                Image Unsplash
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400 mb-3">
              Collection vivante
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Des rayons plus clairs pour trouver le bon livre plus vite.
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-300">
              Parcourez les couvertures, filtrez par categorie, verifiez la disponibilite et gardez une vue nette sur chaque ouvrage. BiblioTech transforme le catalogue en experience simple, rapide et agreable.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                ["Recherche", "Titre et auteur"],
                ["Images", "Couvertures visibles"],
                ["Emprunts", "Disponibilite claire"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                  <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Store books */}
      <section className="bg-gray-50 py-16 dark:bg-gray-950 lg:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
                Bookstore picks
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Featured books for curious readers
              </h2>
              <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
                Explore a curated set of realistic titles with modern covers, useful categories, quick search, ratings, and clean purchase actions.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={bookSearch}
                onChange={(event) => setBookSearch(event.target.value)}
                placeholder="Search books or authors..."
                className="input pl-10"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-primary-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredBooks.map((book) => (
              <StoreBookCard key={book.id} book={book} compact />
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map((book) => (
              <StoreBookCard key={book.id} book={book} />
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="font-semibold text-gray-900 dark:text-white">
                No books found
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try another title, author, or category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
          Tout ce dont vous avez besoin
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl mb-4">
                <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="bg-gray-100 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Pret a decouvrir votre bibliotheque ?
            </h2>
            <Link to="/register" className="btn-primary text-base px-8 py-3 inline-flex">
              Creer un compte gratuit
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
