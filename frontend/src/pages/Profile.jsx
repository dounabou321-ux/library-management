import { useState } from "react";
import toast from "react-hot-toast";
import { User, Lock } from "lucide-react";
import { authAPI } from "../api/endpoints";
import { useAuthStore } from "../store";

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ first_name: user?.first_name || "", last_name: user?.last_name || "" });
  const [pw, setPw] = useState({ old_password: "", new_password: "" });
  const [saving, setSaving] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try { const { data } = await authAPI.updateProfile(form); updateUser(data); toast.success("Profil mis à jour !"); }
    catch { toast.error("Erreur."); }
    finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await authAPI.changePassword(pw); toast.success("Mot de passe modifié !"); setPw({ old_password: "", new_password: "" }); }
    catch (err) { toast.error(err.response?.data?.old_password?.[0] || "Erreur."); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon profil</h1>

      <div className="card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><User className="w-5 h-5" /> Informations personnelles</h2>
        <form onSubmit={handleProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <input value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={user?.email} disabled className="input opacity-60" />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            <span className="badge-admin">{user?.role}</span>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Lock className="w-5 h-5" /> Changer le mot de passe</h2>
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ancien mot de passe</label>
            <input type="password" value={pw.old_password} onChange={(e) => setPw({...pw, old_password: e.target.value})} required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
            <input type="password" value={pw.new_password} onChange={(e) => setPw({...pw, new_password: e.target.value})} required className="input" minLength={8} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">Changer le mot de passe</button>
        </form>
      </div>
    </div>
  );
}
