// src/components/books/BookCard.jsx
import { BookOpen, User, Tag, Copy, CheckCircle } from "lucide-react";

export function BookCard({ book, onBorrow, showAdminActions, onEdit, onDelete }) {
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const coverSrc = book.cover_image_url || book.cover_image;
  const coverUrl = coverSrc?.startsWith("http") ? coverSrc : `${API_BASE}${coverSrc || ""}`;

  return (
    <div className="card p-0 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Cover */}
      <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center">
        {coverSrc ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <BookOpen className="w-16 h-16 text-primary-400 dark:text-primary-600" />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
          <User className="w-3.5 h-3.5" />
          {book.author_detail?.full_name || "—"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
          <Tag className="w-3.5 h-3.5" />
          {book.category_detail?.name || "—"}
        </p>

        {/* Availability */}
        <div className="flex items-center justify-between mb-3">
          <span className={`badge ${book.is_available ? "badge-active" : "badge-overdue"}`}>
            {book.is_available ? "Disponible" : "Indisponible"}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Copy className="w-3.5 h-3.5" />
            {book.copies_available}/{book.copies_total}
          </span>
        </div>

        {/* Actions */}
        {showAdminActions ? (
          <div className="flex gap-2">
            <button onClick={() => onEdit(book)} className="btn-secondary text-xs py-1.5 flex-1">
              Modifier
            </button>
            <button onClick={() => onDelete(book)} className="btn-danger text-xs py-1.5 flex-1">
              Supprimer
            </button>
          </div>
        ) : (
          onBorrow && (
            <button
              onClick={() => onBorrow(book)}
              disabled={!book.is_available}
              className="btn-primary w-full text-sm py-1.5 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Emprunter
            </button>
          )
        )}
      </div>
    </div>
  );
}

// src/components/books/BookForm.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { booksAPI } from "../../api/endpoints";
import { authorsAPI, categoriesAPI } from "../../api/endpoints";

export function BookForm({ book, onSave, onClose }) {
  const [authors,    setAuthors]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [form, setForm] = useState({
    title:            book?.title             || "",
    author:           book?.author            || "",
    category:         book?.category          || "",
    isbn:             book?.isbn              || "",
    description:      book?.description       || "",
    publication_year: book?.publication_year  || "",
    copies_total:     book?.copies_total      || 1,
    copies_available: book?.copies_available  || 1,
    cover_image:      null,
  });

  useEffect(() => {
    Promise.all([authorsAPI.list(), categoriesAPI.list()]).then(([a, c]) => {
      setAuthors(a.data.results || a.data);
      setCategories(c.data.results || c.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== "") fd.append(k, v);
      });
      if (book?.id) {
        await booksAPI.update(book.id, fd);
        toast.success("Livre modifié !");
      } else {
        await booksAPI.create(fd);
        toast.success("Livre ajouté !");
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre *</label>
          <input name="title" value={form.title} onChange={handleChange}
            required className="input" placeholder="Titre du livre" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auteur *</label>
          <select name="author" value={form.author} onChange={handleChange} required className="input">
            <option value="">— Sélectionner —</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.full_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie *</label>
          <select name="category" value={form.category} onChange={handleChange} required className="input">
            <option value="">— Sélectionner —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISBN</label>
          <input name="isbn" value={form.isbn} onChange={handleChange}
            className="input" placeholder="9782..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Année de publication</label>
          <input name="publication_year" type="number" value={form.publication_year}
            onChange={handleChange} className="input" placeholder="2024" min="1000" max="2100" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exemplaires total</label>
          <input name="copies_total" type="number" min="1" value={form.copies_total}
            onChange={handleChange} required className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exemplaires disponibles</label>
          <input name="copies_available" type="number" min="0" value={form.copies_available}
            onChange={handleChange} required className="input" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            rows={3} className="input resize-none" placeholder="Résumé du livre..." />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image de couverture</label>
          <input name="cover_image" type="file" accept="image/*" onChange={handleChange}
            className="input py-1.5 file:mr-3 file:btn-primary file:border-0 file:rounded-lg file:text-xs" />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2 border-t dark:border-gray-800">
        <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Enregistrement..." : book ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
