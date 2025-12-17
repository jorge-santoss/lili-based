// src/page/admin/AdminBookings.jsx
import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/admin";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [associationId, setAssociationId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data } = await getAllBookings({
          status: status || undefined,
          serviceType: serviceType || undefined,
          associationId: associationId || undefined,
          restaurantId: restaurantId || undefined,
          sort: "booking_date",
          order,
        });
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les réservations");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [status, serviceType, associationId, restaurantId, order]);

  if (loading) {
    return (
      <div className="mx-auto mt-20 max-w-6xl px-4 text-sm text-zinc-600">
        Chargement des réservations...
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

  return (
    <div className="mx-auto mt-20 max-w-6xl px-4 pb-10">
      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Toutes les réservations
      </h1>

      {/* Filtres */}
      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Filtres
        </h2>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="space-y-1">
            <label className="block text-zinc-700">Status</label>
            <select
              className="w-40 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-zinc-700">Type</label>
            <select
              className="w-40 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="ON_SITE">Sur place</option>
              <option value="TAKEAWAY">À emporter</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-zinc-700">Association ID</label>
            <input
              className="w-24 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={associationId}
              onChange={(e) => setAssociationId(e.target.value)}
              placeholder="id"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-zinc-700">Restaurant ID</label>
            <input
              className="w-24 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              placeholder="id"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-zinc-700">Date order</label>
            <select
              className="w-24 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Résultats ({bookings.length})
        </h2>

        {bookings.length === 0 ? (
          <div className="text-sm text-zinc-500">Aucune réservation.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-zinc-700">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Association</th>
                  <th className="px-3 py-2 font-medium">Restaurant</th>
                  <th className="px-3 py-2 font-medium">Meals</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Created at</th>
                  <th className="px-3 py-2 font-medium">Beneficiary</th>
                  <th className="px-3 py-2 font-medium">Beneficiary email</th>
                  <th className="px-3 py-2 font-medium">Comment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-zinc-100">
                    <td className="px-3 py-2">{b.id}</td>
                    <td className="px-3 py-2">
                      {b.association_name || `Asso #${b.association_id}`}
                    </td>
                    <td className="px-3 py-2">
                      {b.restaurant_name || `Resto #${b.restaurant_id}`}
                    </td>
                    <td className="px-3 py-2">{b.meals_booked}</td>
                    <td className="px-3 py-2">{b.service_type}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-700">
                        {b.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {b.booking_date
                        ? new Date(b.booking_date).toLocaleString()
                        : ""}
                    </td>
                    <td className="px-3 py-2">
                      {b.beneficiary_first_name || b.beneficiary_last_name
                        ? `${b.beneficiary_first_name ?? ""} ${
                            b.beneficiary_last_name ?? ""
                          }`.trim()
                        : b.beneficiary_id
                        ? `#${b.beneficiary_id}`
                        : "-"}
                    </td>
                    <td className="px-3 py-2">
                      {b.beneficiary_email || "-"}
                    </td>
                    <td className="px-3 py-2">
                      {b.beneficiary_comment || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
