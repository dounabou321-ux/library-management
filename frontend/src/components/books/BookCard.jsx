import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  CheckCircle,
  Copy,
  Eye,
  Pencil,
  BookOpen,
  Tag,
  Trash2,
  User,
} from "lucide-react";

import { authorsAPI, booksAPI, categoriesAPI } from "../../api/endpoints";

const API_BASE = import.meta.env.VITE_API_URL || "";
const PLACEHOLDER_COVER = "/book-placeholder.svg";

function getCoverUrl(book) {
  const coverSrc = book.cover_image_url || book.cover_image;
  if (!coverSrc) return PLACEHOLDER_COVER;
  return coverSrc.startsWith("http") ? coverSrc : `${API_BASE}${coverSrc}`;
}

function getFieldError(error, fallback) {
  const data = error.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;

  const firstKey = Object.keys(data)[0];
  const firstValue = data[firstKey];
  if (Array.isArray(firstValue)) return `${firstKey}: ${firstValue[0]}`;
  return fallback;
}

export function BookCard({ book, onBorrow, showAdminActions, onEdit, onDelete, onView }) {
  const coverUrl = getCoverUrl(book);

  return (
    <article className="card p-0 overflow-hidden hover:shadow-md transition-shadow">
      <button
        type="button"
        onClick={() => onView?.(book)}
        className="block w-full h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden"
        aria-label={`Voir ${book.title}`}
      >
        <img
          src={coverUrl}
          alt={book.cover_image_url || book.cover_image ? book.title : "Couverture indisponible"}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER_COVER;
          }}
        />
      </button>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem]">
          {book.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{book.author_detail?.full_name || "Auteur inconnu"}</span>
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{book.category_detail?.name || "Sans categorie"}</span>
        </p>

        <div className="flex items-center justify-between gap-2 my-3">
          <span className={`badge ${book.is_available ? "badge-active" : "badge-overdue"}`}>
            {book.is_available ? "Disponible" : "Indisponible"}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Copy className="w-3.5 h-3.5" />
            {book.copies_available}/{book.copies_total}
          </span>
        </div>

        {showAdminActions ? (
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => onView?.(book)} className="btn-secondary justify-center px-2" title="Voir">
              <Eye className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => onEdit(book)} className="btn-secondary justify-center px-2" title="Modifier">
              <Pencil className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => onDelete(book)} className="btn-danger justify-center px-2" title="Supprimer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            <button type="button" onClick={() => onView?.(book)} className="btn-secondary justify-center text-sm py-1.5">
              <Eye className="w-4 h-4" />
              Details
            </button>
            {onBorrow && (
              <button
                type="button"
                onClick={() => onBorrow(book)}
                disabled={!book.is_available}
                className="btn-primary justify-center text-sm py-1.5 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Emprunter
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function BookDetail({ book }) {
  if (!book) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
      <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <img
          src={getCoverUrl(book)}
          alt={book.cover_image_url || book.cover_image ? book.title : "Couverture indisponible"}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER_COVER;
          }}
        />
      </div>
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{book.title}</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <User className="w-4 h-4" />
            {book.author_detail?.full_name || "Auteur inconnu"}
          </p>
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Tag className="w-4 h-4" />
            {book.category_detail?.name || "Sans categorie"}
          </p>
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <CalendarDays className="w-4 h-4" />
            {book.published_date || book.publication_year || "Date inconnue"}
          </p>
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <BookOpen className="w-4 h-4" />
            {book.pages ? `${book.pages} pages` : "Nombre de pages inconnu"}
          </p>
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Copy className="w-4 h-4" />
            {book.copies_available}/{book.copies_total} disponible(s)
          </p>
        </div>
        <div className="mt-5">
          <span className={`badge ${book.is_available ? "badge-active" : "badge-overdue"}`}>
            {book.is_available ? "Disponible" : "Indisponible"}
          </span>
        </div>
        <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-300 whitespace-pre-line">
          {book.description || "Aucune description pour ce livre."}
        </p>
      </div>
    </div>
  );
}

export function BookForm({ book, onSave, onClose }) {
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: book?.title || "",
    author: book?.author || "",
    category: book?.category || "",
    isbn: book?.isbn || "",
    description: book?.description || "",
    published_date: book?.published_date || "",
    publication_year: book?.publication_year || "",
    pages: book?.pages || "",
    copies_total: book?.copies_total || 1,
    copies_available: book?.copies_available || 1,
    cover_image: null,
  });

  const previewUrl = useMemo(() => {
    if (form.cover_image) return window.URL.createObjectURL(form.cover_image);
    return book ? getCoverUrl(book) : PLACEHOLDER_COVER;
  }, [book, form.cover_image]);

  useEffect(() => {
    return () => {
      if (form.cover_image && previewUrl.startsWith("blob:")) {
        window.URL.revokeObjectURL(previewUrl);
      }
    };
  }, [form.cover_image, previewUrl]);

  useEffect(() => {
    Promise.all([authorsAPI.list(), categoriesAPI.list()])
      .then(([authorsResponse, categoriesResponse]) => {
        setAuthors(authorsResponse.data.results || authorsResponse.data);
        setCategories(categoriesResponse.data.results || categoriesResponse.data);
      })
      .catch(() => toast.error("Impossible de charger les auteurs et categories."));
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Number(form.copies_available) > Number(form.copies_total)) {
      toast.error("Les exemplaires disponibles ne peuvent pas depasser le total.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") payload.append(key, value);
      });

      if (book?.id) {
        await booksAPI.update(book.id, payload);
        toast.success("Livre modifie.");
      } else {
        await booksAPI.create(payload);
        toast.success("Livre ajoute.");
      }
      onSave();
    } catch (error) {
      toast.error(getFieldError(error, "Erreur lors de l'enregistrement."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-5">
        <div>
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <img
              src={previewUrl}
              alt="Apercu de la couverture"
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = PLACEHOLDER_COVER;
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre *</label>
            <input name="title" value={form.title} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auteur *</label>
            <select name="author" value={form.author} onChange={handleChange} required className="input">
              <option value="">Selectionner</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>{author.full_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categorie *</label>
            <select name="category" value={form.category} onChange={handleChange} required className="input">
              <option value="">Selectionner</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISBN</label>
            <input name="isbn" value={form.isbn} onChange={handleChange} className="input" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de publication</label>
            <input name="published_date" type="date" value={form.published_date} onChange={handleChange} className="input" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annee</label>
            <input
              name="publication_year"
              type="number"
              value={form.publication_year}
              onChange={handleChange}
              className="input"
              min="1000"
              max="2100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pages</label>
            <input
              name="pages"
              type="number"
              value={form.pages}
              onChange={handleChange}
              className="input"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Couverture</label>
            <input name="cover_image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} className="input py-1.5" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total</label>
            <input name="copies_total" type="number" min="1" value={form.copies_total} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Disponibles</label>
            <input name="copies_available" type="number" min="0" value={form.copies_available} onChange={handleChange} required className="input" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input resize-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t dark:border-gray-800">
        <button type="button" onClick={onClose} className="btn-secondary justify-center">Annuler</button>
        <button type="submit" disabled={loading} className="btn-primary justify-center">
          {loading ? "Enregistrement..." : book ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
