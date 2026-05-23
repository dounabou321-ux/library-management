import { useState, useEffect } from "react";
import { BookOpen, Users, BookMarked, CheckCircle, AlertTriangle, Tag, UserCheck } from "lucide-react";
import { dashboardAPI } from "../api/endpoints";
import { StatsCard, Loader } from "../components/ui/index.jsx";
import { BorrowingsChart, CategoryChart, TopBooksTable, RecentBorrowings } from "../components/dashboard/DashboardCharts.jsx";

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.stats()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Chargement du tableau de bord..." />;
  if (!stats)  return <p className="text-red-500">Erreur de chargement.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de la bibliothèque</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total livres"       value={stats.total_books}       icon={BookOpen}   color="primary" />
        <StatsCard label="Membres"            value={stats.total_users}       icon={Users}      color="purple" />
        <StatsCard label="Emprunts en cours"  value={stats.active_borrowings} icon={BookMarked} color="amber" />
        <StatsCard label="Livres retournés"   value={stats.returned_books}    icon={CheckCircle} color="emerald" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="En retard"          value={stats.overdue_count}         icon={AlertTriangle} color="red"
          sub={stats.overdue_count > 0 ? "Action requise" : "Tout est à jour"} />
        <StatsCard label="Auteurs"            value={stats.total_authors}         icon={UserCheck}  color="blue" />
        <StatsCard label="Catégories"         value={stats.total_categories}      icon={Tag}        color="purple" />
        <StatsCard label="Emprunts aujourd'hui" value={stats.new_borrowings_today} icon={BookMarked} color="emerald" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <BorrowingsChart data={stats.daily_borrowings} />
        <CategoryChart   data={stats.by_category} />
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TopBooksTable    data={stats.top_books} />
        <RecentBorrowings data={stats.recent_borrowings} />
      </div>
    </div>
  );
}
