// src/page/admin/AdminStats.jsx
import { useState, useEffect } from "react";
import { getBookingStats } from "../../api/admin";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  PENDING: "#f1e0c5",   // amber
  CONFIRMED: "#c9b79c", // green
  REJECTED: "#ef4444",  // red
};

const TYPE_COLORS = {
  ON_SITE: "#c9cba3",   // teal-ish
  TAKEAWAY: "#e26d5c",  // orange
};

export default function AdminStats() {
  const [period, setPeriod] = useState("all");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const { data } = await getBookingStats({ period });
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les statistiques");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [period]);

  if (loading) {
    return (
      <div className="mx-auto mt-20 max-w-6xl px-4 text-sm text-zinc-600">
        Chargement des statistiques...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-20 max-w-6xl px-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mx-auto mt-20 max-w-6xl px-4 pb-10">
      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Statistiques des réservations
      </h1>

      {/* Période */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-zinc-700">Période :</span>
        <select
          className="rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="all">Toutes</option>
          <option value="week">7 derniers jours</option>
          <option value="month">30 derniers jours</option>
        </select>
      </div>

      {/* Cards globales */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Réservations totales
          </div>
          <div className="mt-1 text-2xl font-bold text-zinc-900">
            {stats.total}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Valeur des repas (1€)
          </div>
          <div className="mt-1 text-2xl font-bold text-zinc-900">
            {stats.totalValue}
            <span className="ml-1 text-base font-normal text-zinc-600">€</span>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        {/* Par statut */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-zinc-800">
            Répartition par statut
          </h2>
          <div className="h-60 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.byStatus}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={70}
                  label
                >
                  {stats.byStatus.map((entry) => (
                    <Cell
                      key={`cell-status-${entry.status}`}
                      fill={STATUS_COLORS[entry.status] || "#78716c"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Par type de service */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-zinc-800">
            Répartition par type de service
          </h2>
          <div className="h-60 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.byServiceType}
                  dataKey="count"
                  nameKey="service_type"
                  outerRadius={70}
                  label={(entry) =>
                    entry.service_type === "TAKEAWAY"
                      ? "À emporter"
                      : "Sur place"
                  }
                >
                  {stats.byServiceType.map((entry) => (
                    <Cell
                      key={`cell-type-${entry.service_type}`}
                      fill={TYPE_COLORS[entry.service_type] || "#6b7280"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, item) => [
                    value,
                    item.payload.service_type === "TAKEAWAY"
                      ? "À emporter"
                      : "Sur place",
                  ]}
                />
                <Legend
                  formatter={(value) =>
                    value === "TAKEAWAY" ? "À emporter" : "Sur place"
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Par statut (texte) */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-zinc-800">
          Détail par statut
        </h2>
        <ul className="list-inside list-disc text-sm text-zinc-700">
          {stats.byStatus.map((s) => (
            <li key={s.status}>
              {s.status} :{" "}
              <span className="font-semibold">{s.count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Par type de service (texte) */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-zinc-800">
          Détail par type de service
        </h2>
        <ul className="list-inside list-disc text-sm text-zinc-700">
          {stats.byServiceType.map((s) => (
            <li key={s.service_type}>
              {s.service_type === "TAKEAWAY" ? "À emporter" : "Sur place"} :{" "}
              <span className="font-semibold">{s.count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Associations */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-zinc-800">
          Associations (repas réservés)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-3 py-2 font-medium">Association</th>
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">Réservations</th>
                <th className="px-3 py-2 font-medium">Repas</th>
                <th className="px-3 py-2 font-medium">Valeur (€)</th>
              </tr>
            </thead>
            <tbody>
              {stats.byAssociation.map((a) => (
                <tr key={a.association_id} className="border-b border-zinc-100">
                  <td className="px-3 py-2">
                    {a.association_name || `Asso #${a.association_id}`}
                  </td>
                  <td className="px-3 py-2">{a.association_id}</td>
                  <td className="px-3 py-2">{a.bookings_count}</td>
                  <td className="px-3 py-2">{a.meals}</td>
                  <td className="px-3 py-2">{a.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restaurants */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-zinc-800">
          Restaurants (repas servis)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-3 py-2 font-medium">Restaurant</th>
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">Réservations</th>
                <th className="px-3 py-2 font-medium">Repas</th>
                <th className="px-3 py-2 font-medium">Valeur (€)</th>
              </tr>
            </thead>
            <tbody>
              {stats.byRestaurant.map((r) => (
                <tr
                  key={r.restaurant_id}
                  className="border-b border-zinc-100"
                >
                  <td className="px-3 py-2">
                    {r.restaurant_name || `Resto #${r.restaurant_id}`}
                  </td>
                  <td className="px-3 py-2">{r.restaurant_id}</td>
                  <td className="px-3 py-2">{r.bookings_count}</td>
                  <td className="px-3 py-2">{r.meals}</td>
                  <td className="px-3 py-2">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
