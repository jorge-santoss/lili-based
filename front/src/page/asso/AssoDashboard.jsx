// src/page/asso/AssoDashboard.jsx
import { useQuery } from "@tanstack/react-query";
import { getMyBookings, getRestaurantsForAsso } from "@/api/asso";
import { Link } from "react-router-dom";

export default function AssoDashboard() {
  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useQuery({
    queryKey: ["asso-dashboard-bookings"],
    queryFn: () => getMyBookings().then((res) => res.data),
  });

  const {
    data: restaurants = [],
    isLoading: isLoadingRestaurants,
    error: restaurantsError,
  } = useQuery({
    queryKey: ["asso-dashboard-restaurants"],
    queryFn: () => getRestaurantsForAsso().then((res) => res.data),
  });

  if (isLoadingBookings || isLoadingRestaurants) {
    return (
      <div className="mx-auto mt-20 max-w-5xl px-4 text-sm text-zinc-600">
        Chargement…
      </div>
    );
  }

  if (bookingsError || restaurantsError) {
    return (
      <div className="mx-auto mt-20 max-w-5xl px-4 text-sm text-red-600">
        Erreur de chargement des données
      </div>
    );
  }

  const restaurantById = new Map(restaurants.map((r) => [r.id, r]));

  return (
    <div className="mx-auto mt-20 max-w-5xl px-4 pb-10">
      <h1 className="mb-2 text-lg font-semibold text-zinc-800">
        Dashboard association
      </h1>
      {/* <p className="mb-4 text-sm text-zinc-600">
        Vue d’ensemble de vos réservations. Pour créer ou modifier, utilisez la
        page{" "}
        <Link
          to="/asso/bookings"
          className="font-medium text-amber-600 hover:underline"
        >
          Mes réservations
        </Link>
        .
      </p> */}

      {/* Lien principal */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Link
          to="/asso/bookings"
          className="rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm hover:border-amber-500 hover:shadow"
        >
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Réservations
          </div>
          <div className="text-sm font-semibold text-zinc-900">
            Mes réservations
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Créer, consulter et suivre vos réservations en détail.
          </p>
        </Link>
      </div>

      {/* Historique comme sur /asso/bookings */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Historique des réservations
        </h2>

        {bookings.length === 0 ? (
          <div className="text-sm text-zinc-500">Aucune réservation.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-zinc-700">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-3 py-2 font-medium">Created at</th>
                  <th className="px-3 py-2 font-medium">Service date/time</th>
                  <th className="px-3 py-2 font-medium">Restaurant</th>
                  <th className="px-3 py-2 font-medium">Meals</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const restaurant = restaurantById.get(b.restaurant_id);
                  return (
                    <tr key={b.id} className="border-b border-zinc-100">
                      <td className="px-3 py-2">
                        {new Date(b.booking_date).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        {b.service_datetime
                          ? new Date(b.service_datetime).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {restaurant
                          ? `${restaurant.name}${
                              restaurant.cuisine
                                ? " - " + restaurant.cuisine
                                : ""
                            }`
                          : `#${b.restaurant_id}`}
                      </td>
                      <td className="px-3 py-2">{b.meals_booked}</td>
                      <td className="px-3 py-2">
                        {b.service_type === "TAKEAWAY"
                          ? "À emporter"
                          : "Sur place"}
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-700">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
