// src/components/layout/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Users, Tag,
  BookMarked, LogOut, ChevronRight, BookCopy
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store";

const NAV = [
  { path: "/admin",             icon: LayoutDashboard, label: "Tableau de bord" },
  { path: "/admin/books",       icon: BookOpen,        label: "Livres" },
  { path: "/admin/authors",     icon: Users,           label: "Auteurs" },
  { path: "/admin/categories",  icon: Tag,             label: "Catégories" },
  { path: "/admin/borrowings",  icon: BookMarked,      label: "Emprunts" },
];

export default function Sidebar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b dark:border-gray-800">
        <div className="flex items-center gap-2 font-bold text-lg text-primary-600">
          <BookCopy className="w-5 h-5" />
          <span>BiblioTech Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ path, icon: Icon, label }) => {
          const isActive = path === "/admin"
            ? location.pathname === "/admin"
            : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t dark:border-gray-800 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user?.full_name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          <span className="badge-admin mt-1">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
