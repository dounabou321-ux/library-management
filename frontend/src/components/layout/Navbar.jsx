// ═══════════════════════════════════════════════════════════
// src/components/layout/Navbar.jsx
// ═══════════════════════════════════════════════════════════
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, User, Moon, Sun, LogOut, LayoutDashboard, BookMarked } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store";

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
  const [dark, setDark] = useState(localStorage.getItem("dark") === "true");
  const navigate = useNavigate();

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("dark", next);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600 dark:text-primary-400">
          <BookOpen className="w-6 h-6" />
          <span>BiblioTech</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition">
            Accueil
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/books" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition">
                Livres
              </Link>
              <Link to="/borrowings" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition">
                <BookMarked className="w-4 h-4" /> Mes emprunts
              </Link>
            </>
          )}
          {isAdmin() && (
            <Link to="/admin" className="flex items-center gap-1 text-purple-600 font-medium hover:text-purple-700">
              <LayoutDashboard className="w-4 h-4" /> Administration
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm">
                <User className="w-4 h-4" />
                <span className="hidden sm:block">{user?.first_name}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link to="/profile" className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl">
                  Mon profil
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login"    className="btn-secondary text-sm py-1.5">Connexion</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5">Inscription</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
