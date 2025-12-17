// src/page/admin/AdminDashboard.jsx
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="mx-auto mt-20 max-w-5xl px-4 pb-10">
      <h1 className="mb-2 text-lg font-semibold text-zinc-800">
        Admin dashboard
      </h1>
      <p className="mb-4 text-sm text-zinc-600">
        Depuis cette page, gérez les associations, les restaurants et les
        réservations.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/admin/associations"
          className="rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm hover:border-amber-500 hover:shadow"
        >
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Associations
          </div>
          <div className="text-sm font-semibold text-zinc-900">
            Gérer les associations
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Création, édition et suppression des associations partenaires.
          </p>
        </Link>

        <Link
          to="/admin/restaurants"
          className="rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm hover:border-amber-500 hover:shadow"
        >
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Restaurants
          </div>
          <div className="text-sm font-semibold text-zinc-900">
            Gérer les restaurants
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Liste des restaurants, fiches détaillées et suppression.
          </p>
        </Link>

        <Link
          to="/admin/bookings"
          className="rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm hover:border-amber-500 hover:shadow"
        >
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Réservations
          </div>
          <div className="text-sm font-semibold text-zinc-900">
            Voir toutes les réservations
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Filtrer par statut, type, association et restaurant.
          </p>
        </Link>
      </div>

      <div className="mt-6">
        <Link
          to="/admin/stats"
          className="text-xs font-medium text-zinc-700 hover:underline"
        >
          ↗ Voir les statistiques globales
        </Link>
      </div>
    </div>
  );
}
