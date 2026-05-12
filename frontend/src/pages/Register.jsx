import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";
import { useAuthStore } from "../store";

export default function Register() {
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "", password: "", password2: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) { toast.error("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success("Compte créé avec succès !");
      navigate("/");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) Object.values(errors).flat().forEach((msg) => toast.error(msg));
      else toast.error("Erreur lors de l'inscription.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
            <BookOpen className="w-7 h-7 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Créer un compte</h1>
          <p className="text-gray-500 mt-1">Rejoignez BiblioTech</p>
        </div>
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                <input value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} required className="input" placeholder="Jean" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                <input value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} required className="input" placeholder="Dupont" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className="input" placeholder="vous@exemple.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
              <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required className="input" placeholder="••••••••" minLength={8} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmer</label>
              <input type="password" value={form.password2} onChange={(e) => setForm({...form, password2: e.target.value})} required className="input" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? "Inscription..." : "Créer mon compte"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Déjà un compte ? <Link to="/login" className="text-primary-600 font-medium hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
