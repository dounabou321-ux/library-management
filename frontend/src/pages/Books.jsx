import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, RotateCcw } from "lucide-react";

import { booksAPI, borrowingsAPI, categoriesAPI } from "../api/endpoints";
import { useAuthStore } from "../store";
import { BookCard, BookDetail, BookForm } from "../components/books/BookCard";
import { ConfirmDialog, Loader, Modal, Pagination, SearchInput } from "../components/ui/index.jsx";

const PAGE_SIZE = 12;

export default function Books({ admin = false }) {
  const { isAdmin } = useAuthStore();
  const isAdminView = admin || isAdmin();

  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(false);
  const [ordering, setOrdering] = useState("-created_at");
  const [formOpen, setFormOpen] = useState(false);
  const [detailBook, setDetailBook] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, page_size: PAGE_SIZE, ordering };
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (available) params.available = true;

      const { data } = await booksAPI.list(params);
      setBooks(data.results || data);
      setTotal(data.count ?? data.length ?? 0);
    } catch {
      toast.error("Erreur de chargement des livres.");
    } finally {
      setLoading(false);
    }
  }, [available, category, ordering, page, search]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    categoriesAPI
      .list()
      .then(({ data }) => setCategories(data.results || data))
      .catch(() => toast.error("Impossible de charger les categories."));
  }, []);

  const openCreateForm = () => {
    setEditBook(null);
    setFormOpen(true);
  };

  const openEditForm = (book) => {
    setEditBook(book);
    setFormOpen(true);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setAvailable(false);
    setOrdering("-created_at");
    setPage(1);
  };

  const handleBorrow = async (book) => {
    try {
      await borrowingsAPI.borrow(book.id);
      toast.success(`"${book.title}" emprunte avec succes.`);
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Impossible d'emprunter ce livre.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await booksAPI.delete(deleteTarget.id);
      toast.success("Livre supprime.");
      setDeleteTarget(null);
      fetchBooks();
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAdminView ? "Gestion des livres" : "Catalogue de livres"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{total} livre(s) trouve(s)</p>
        </div>
        {isAdminView && (
          <button type="button" onClick={openCreateForm} className="btn-primary justify-center">
            <Plus className="w-4 h-4" />
            Ajouter un livre
          </button>
        )}
      </div>

      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,1fr)_180px_180px_auto] gap-3 items-center">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Titre ou auteur..."
          />

          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="input"
          >
            <option value="">Toutes categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>{item.name}</option>
            ))}
          </select>

          <select
            value={ordering}
            onChange={(event) => {
              setOrdering(event.target.value);
              setPage(1);
            }}
            className="input"
          >
            <option value="-created_at">Plus recents</option>
            <option value="title">Titre A-Z</option>
            <option value="-published_date">Publication recente</option>
            <option value="-copies_available">Disponibilite</option>
          </select>

          <button type="button" onClick={resetFilters} className="btn-secondary justify-center">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={available}
            onChange={(event) => {
              setAvailable(event.target.checked);
              setPage(1);
            }}
            className="rounded border-gray-300"
          />
          Disponibles seulement
        </label>
      </div>

      {loading ? (
        <Loader />
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Aucun livre trouve.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                showAdminActions={isAdminView}
                onBorrow={!isAdminView ? handleBorrow : undefined}
                onView={setDetailBook}
                onEdit={openEditForm}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={!!detailBook}
        onClose={() => setDetailBook(null)}
        title="Detail du livre"
        size="xl"
      >
        <BookDetail book={detailBook} />
      </Modal>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editBook ? "Modifier le livre" : "Ajouter un livre"}
        size="xl"
      >
        <BookForm
          book={editBook}
          onSave={() => {
            setFormOpen(false);
            fetchBooks();
          }}
          onClose={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer le livre"
        message={`Voulez-vous supprimer "${deleteTarget?.title}" ? Cette action est irreversible.`}
      />
    </div>
  );
}
