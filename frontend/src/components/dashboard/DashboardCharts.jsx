// src/components/dashboard/DashboardCharts.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

export function BorrowingsChart({ data }) {
  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
        Emprunts — 7 derniers jours
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }}
            tickFormatter={(v) => new Date(v).toLocaleDateString("fr-FR", { weekday: "short" })} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            labelFormatter={(v) => new Date(v).toLocaleDateString("fr-FR")}
            formatter={(v) => [v, "Emprunts"]}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart({ data }) {
  const cleaned = data
    .filter((d) => d["book__category__name"])
    .map((d) => ({ name: d["book__category__name"], value: d.count }));

  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
        Emprunts par catégorie
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={cleaned} dataKey="value" nameKey="name"
            cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            } labelLine={false}>
            {cleaned.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n) => [v, n]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopBooksTable({ data }) {
  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
        Top 5 livres les plus empruntés
      </h3>
      <div className="space-y-3">
        {data.map((book, i) => (
          <div key={book.id} className="flex items-center gap-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
              i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-600" : "bg-gray-300"
            }`}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{book.title}</p>
            </div>
            <span className="text-sm font-bold text-primary-600">{book.borrow_count}x</span>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">Aucune donnée disponible</p>
        )}
      </div>
    </div>
  );
}

export function RecentBorrowings({ data }) {
  const statusClass = { ACTIVE: "badge-active", RETURNED: "badge-returned", OVERDUE: "badge-overdue" };
  const statusLabel = { ACTIVE: "En cours", RETURNED: "Retourné", OVERDUE: "En retard" };

  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
        Emprunts récents
      </h3>
      <div className="space-y-3">
        {data.map((b) => (
          <div key={b.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{b.book}</p>
              <p className="text-xs text-gray-500">{b.user} · Retour le {new Date(b.due_date).toLocaleDateString("fr-FR")}</p>
            </div>
            <span className={statusClass[b.status] || "badge"}>
              {statusLabel[b.status] || b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
