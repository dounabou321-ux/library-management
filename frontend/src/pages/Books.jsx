import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Plus, Filter } from "lucide-react";
import { booksAPI, categoriesAPI } from "../api/endpoints";
import { useAuthStore } from "../store";
import { BookCard, BookForm } from "../components/books/BookCard";
import { Loader } from "../components/ui/index.jsx";
import { SearchInput } from "../components/ui/index.jsx";
import { Modal } from "../components/ui/index.jsx";
import { Pagination } from "../components/ui/index.jsx";
import { ConfirmDialog } from "../components/ui/index.jsx";
import { borrowingsAPI } from "../api/endpoints";

const PAGE_SIZE = 12;

export default function Books({ admin = false }) {
  const { isAdmin } = useAuthStore();
  const isAdminView = admin || isAdmin();

  const [books,      setBooks]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("");
  const [available,  setAvailable]  = useState(false);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editBook,   setEditBook]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, page_size: PAGE_SIZE };
      if (search)    params.search    = search;
      if (category)  params.category  = category;
      if (available) params.available = true;
      const { data } = await booksAPI.list(params);
      setBooks(data.results);
      setTotal(data.count);
    } catch { toast.error("Erreur de chargement."); }
    finally  { setLoading(false); }
  }, [page, search, category, available]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  useEffect(() => {
    categoriesAPI.list().then(({ data }) => setCategories(data.results || data));
  }, []);

  const handleBorrow = async (book) => {
    try {
      await borrowingsAPI.borrow(book.id);
      toast.success(`« ${book.title} » emprunté avec succès !`);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Impossible d'emprunter ce livre.");
    }
  };

  const handleDelete = async () => {
    try {
      await booksAPI.delete(deleteTarget.id);
      toast.success("Livre supprimé.");
      fetchBooks();
    } catch { toast.error("Erreur lors de la suppression."); }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAdminView ? "Gestion des livres" : "Catalogue de livres"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{total} livre(s) trouvé(s)</p>
        </div>
        {isAdminView && (
          <button onClick={() => { setEditBook(null); setModalOpen(true); }} className="btn-primary">
            <Plus className="w-4 h-4" /> Ajouter un livre
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Titre, auteur, ISBN..." />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="input w-auto">
          <option value="">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input type="checkbox" checked={available} onChange={(e) => { setAvailable(e.target.checked); setPage(1); }}
            className="rounded border-gray-300" />
          Disponibles seulement
        </label>
      </div>

      {/* Grid */}
      {loading ? (
        <Loader />
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Aucun livre trouvé.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                showAdminActions={isAdminView}
                onBorrow={!isAdminView ? handleBorrow : undefined}
                onEdit={(b) => { setEditBook(b); setModalOpen(true); }}
                onDelete={(b) => setDeleteTarget(b)}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Modal form */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editBook ? "Modifier le livre" : "Ajouter un livre"}
        size="lg"
      >
        <BookForm
          book={editBook}
          onSave={() => { setModalOpen(false); fetchBooks(); }}
          onClose={() => setModalOpen(false)}
        />
      </Modal>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer le livre"
        message={`Voulez-vous supprimer « ${deleteTarget?.title} » ? Cette action est irréversible.`}
      />
    </div>
  );
}
