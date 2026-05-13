// src/pages/Authors.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { authorsAPI } from "../api/endpoints";
import { Table, Modal, SearchInput, Loader, ConfirmDialog } from "../components/ui/index.jsx";

function AuthorForm({ author, onSave, onClose }) {
  const [form, setForm] = useState({
    first_name:  author?.first_name  || "",
    last_name:   author?.last_name   || "",
    nationality: author?.nationality || "",
    bio:         author?.bio         || "",
    birth_date:  author?.birth_date  || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (author?.id) { await authorsAPI.update(author.id, form); toast.success("Auteur modifié !"); }
      else             { await authorsAPI.create(form);             toast.success("Auteur ajouté !"); }
      onSave();
    } catch { toast.error("Erreur lors de l'enregistrement."); }
    finally  { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Prénom *</label>
          <input value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} required className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nom *</label>
          <input value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} required className="input" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Nationalité</label>
        <input value={form.nationality} onChange={(e) => setForm({...form, nationality: e.target.value})} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date de naissance</label>
        <input type="date" value={form.birth_date} onChange={(e) => setForm({...form, birth_date: e.target.value})} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Biographie</label>
        <textarea value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} rows={3} className="input resize-none" />
      </div>
      <div className="flex gap-3 justify-end pt-2 border-t dark:border-gray-800">
        <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Enregistrement..." : author ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState(false);
  const [edit,    setEdit]    = useState(null);
  const [del,     setDel]     = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await authorsAPI.list({ search });
      setAuthors(data.results || data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    try { await authorsAPI.delete(del.id); toast.success("Auteur supprimé."); load(); }
    catch { toast.error("Erreur."); }
  };

  const COLS = [
    { key: "full_name", label: "Nom complet" },
    { key: "nationality", label: "Nationalité" },
    { key: "books_count", label: "Livres", render: (r) => r.books_count || 0 },
    {
      key: "actions", label: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => { setEdit(r); setModal(true); }} className="btn-secondary text-xs py-1">Modifier</button>
          <button onClick={() => setDel(r)} className="btn-danger text-xs py-1">Supprimer</button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Auteurs</h1>
        <button onClick={() => { setEdit(null); setModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>
      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un auteur..." />
      </div>
      {loading ? <Loader /> : <Table columns={COLS} data={authors} emptyMessage="Aucun auteur." />}
      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "Modifier l'auteur" : "Nouvel auteur"}>
        <AuthorForm author={edit} onSave={() => { setModal(false); load(); }} onClose={() => setModal(false)} />
      </Modal>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={handleDelete}
        title="Supprimer l'auteur" message={`Supprimer ${del?.full_name} ?`} />
    </div>
  );
}
