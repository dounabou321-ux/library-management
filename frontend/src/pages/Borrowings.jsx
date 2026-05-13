// src/pages/Borrowings.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BookMarked, RotateCcw } from "lucide-react";
import { borrowingsAPI } from "../api/endpoints";
import { useAuthStore } from "../store";
import { Table, Loader } from "../components/ui/index.jsx";

const STATUS_LABEL = { ACTIVE: "En cours", RETURNED: "Retourné", OVERDUE: "En retard" };
const STATUS_CLASS  = { ACTIVE: "badge-active", RETURNED: "badge-returned", OVERDUE: "badge-overdue" };

export default function Borrowings({ admin = false }) {
  const { isAdmin } = useAuthStore();
  const isAdminView = admin || isAdmin();

  const [borrowings, setBorrowings] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const fn = isAdminView ? borrowingsAPI.list : borrowingsAPI.mine;
      const { data } = await fn(params);
      setBorrowings(data.results || data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleReturn = async (b) => {
    try {
      await borrowingsAPI.return_(b.id);
      toast.success(`« ${b.book_detail?.title} » retourné avec succès !`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur lors du retour.");
    }
  };

  const COLS = [
    { key: "book",   label: "Livre",    render: (r) => r.book_detail?.title || "—" },
    ...(isAdminView ? [{ key: "user", label: "Membre", render: (r) => r.user_detail?.full_name || "—" }] : []),
    { key: "borrowed_at", label: "Emprunté le", render: (r) => new Date(r.borrowed_at).toLocaleDateString("fr-FR") },
    { key: "due_date",    label: "Retour avant", render: (r) => new Date(r.due_date).toLocaleDateString("fr-FR") },
    { key: "status", label: "Statut", render: (r) => (
      <span className={STATUS_CLASS[r.status] || "badge"}>{STATUS_LABEL[r.status] || r.status}</span>
    )},
    { key: "actions", label: "", render: (r) => r.status === "ACTIVE" ? (
      <button onClick={() => handleReturn(r)} className="btn-success text-xs py-1 flex items-center gap-1">
        <RotateCcw className="w-3.5 h-3.5" /> Retourner
      </button>
    ) : null }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-primary-600" />
            {isAdminView ? "Gestion des emprunts" : "Mes emprunts"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{borrowings.length} emprunt(s)</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-auto">
          <option value="">Tous les statuts</option>
          <option value="ACTIVE">En cours</option>
          <option value="RETURNED">Retournés</option>
          <option value="OVERDUE">En retard</option>
        </select>
      </div>
      {loading ? <Loader /> : <Table columns={COLS} data={borrowings} emptyMessage="Aucun emprunt." />}
    </div>
  );
}
