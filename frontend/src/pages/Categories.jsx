import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { categoriesAPI } from "../api/endpoints";
import { Table, Modal, Loader, ConfirmDialog } from "../components/ui/index.jsx";

function CatForm({ cat, onSave, onClose }) {
  const [form, setForm] = useState({ name: cat?.name || "", description: cat?.description || "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (cat?.slug) { await categoriesAPI.update(cat.slug, form); toast.success("Catégorie modifiée !"); }
      else           { await categoriesAPI.create(form);            toast.success("Catégorie ajoutée !"); }
      onSave();
    } catch { toast.error("Erreur."); }
    finally  { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nom *</label>
        <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="input resize-none" />
      </div>
      <div className="flex gap-3 justify-end pt-2 border-t dark:border-gray-800">
        <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "..." : cat ? "Modifier" : "Ajouter"}</button>
      </div>
    </form>
  );
}

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await categoriesAPI.list(); setCats(data.results || data); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const COLS = [
    { key: "name", label: "Nom" },
    { key: "slug", label: "Slug" },
    { key: "books_count", label: "Livres", render: (r) => r.books_count || 0 },
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => { setEdit(r); setModal(true); }} className="btn-secondary text-xs py-1">Modifier</button>
        <button onClick={() => setDel(r)} className="btn-danger text-xs py-1">Supprimer</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Catégories</h1>
        <button onClick={() => { setEdit(null); setModal(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Ajouter</button>
      </div>
      {loading ? <Loader /> : <Table columns={COLS} data={cats} emptyMessage="Aucune catégorie." />}
      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "Modifier la catégorie" : "Nouvelle catégorie"}>
        <CatForm cat={edit} onSave={() => { setModal(false); load(); }} onClose={() => setModal(false)} />
      </Modal>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={async () => { await categoriesAPI.delete(del.slug); toast.success("Supprimée."); load(); }}
        title="Supprimer" message={`Supprimer la catégorie « ${del?.name} » ?`} />
    </div>
  );
}
