// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store";

export default function Login() {
  const [form, setForm]   = useState({ email: "", password: "" });
  const [show, setShow]   = useState(false);
  const [loading, setLoading] = useState(false);
  const { login }         = useAuthStore();
  const navigate          = useNavigate();
  const location          = useLocation();
  const from              = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Bienvenue, ${data.user.first_name} !`);
      navigate(data.user.role === "ADMIN" ? "/admin" : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
            <BookOpen className="w-7 h-7 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BiblioTech</h1>
          <p className="text-gray-500 mt-1">Connectez-vous à votre compte</p>
        </div>

        <div className="card p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={form.email} required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input" placeholder="vous@exemple.com" autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={form.password} required
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">
              S'inscrire
            </Link>
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300">
            <strong>Démo admin :</strong> admin@library.com / admin123<br />
            <strong>Démo membre :</strong> member@library.com / member123
          </div>
        </div>
      </div>
    </div>
  );
}
