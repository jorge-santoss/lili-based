// src/page/asso/MyBookings.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyBookings,
  getRestaurantsForAsso,
  createBooking,
  getBeneficiaries,
  createBeneficiary,
} from "@/api/asso";

export default function MyBookings() {
  const queryClient = useQueryClient();

  // Booking form state
  const [restaurantId, setRestaurantId] = useState("");
  const [mealsBooked, setMealsBooked] = useState("");
  const [serviceType, setServiceType] = useState("ON_SITE");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [comment, setComment] = useState("");
  const [serviceDateTime, setServiceDateTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Beneficiary form state
  const [bFirstName, setBFirstName] = useState("");
  const [bLastName, setBLastName] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [bPhone, setBPhone] = useState("");
  const [bBirthYear, setBBirthYear] = useState("");
  const [bRgpdAccepted, setBRgpdAccepted] = useState(false);
  const [bError, setBError] = useState("");
  const [bSuccess, setBSuccess] = useState("");

  // Load bookings
  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useQuery({
    queryKey: ["asso-my-bookings"],
    queryFn: () => getMyBookings().then((res) => res.data),
  });

  // Load restaurants
  const {
    data: restaurants = [],
    isLoading: isLoadingRestaurants,
    error: restaurantsError,
  } = useQuery({
    queryKey: ["asso-restaurants"],
    queryFn: () => getRestaurantsForAsso().then((res) => res.data),
  });

  // Load beneficiaries
  const {
    data: beneficiaries = [],
    isLoading: isLoadingBeneficiaries,
    error: beneficiariesError,
  } = useQuery({
    queryKey: ["asso-beneficiaries"],
    queryFn: () => getBeneficiaries().then((res) => res.data),
  });

  // Mutation: create booking
  const createBookingMutation = useMutation({
    mutationFn: (payload) => createBooking(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["asso-my-bookings"]);
      setRestaurantId("");
      setMealsBooked("");
      setServiceType("ON_SITE");
      setBeneficiaryId("");
      setComment("");
      setServiceDateTime("");
      setError("");
      setSuccess("Booking created successfully.");
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (err) => {
      console.error(err);
      setError("Failed to create booking");
    },
  });

  // Mutation: create beneficiary
  const createBeneficiaryMutation = useMutation({
    mutationFn: (payload) => createBeneficiary(payload).then((res) => res.data),
    onSuccess: (created) => {
      queryClient.invalidateQueries(["asso-beneficiaries"]);
      setBFirstName("");
      setBLastName("");
      setBEmail("");
      setBPhone("");
      setBBirthYear("");
      setBRgpdAccepted(false);
      setBError("");
      setBSuccess("Beneficiary created successfully.");
      if (created?.id) {
        setBeneficiaryId(String(created.id));
      }
      setTimeout(() => setBSuccess(""), 3000);
    },
    onError: (err) => {
      console.error(err);
      setBError("Failed to create beneficiary");
    },
  });

  const handleCreateBooking = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const meals = Number(mealsBooked);
    const restId = Number(restaurantId);

    if (!restId) {
      setError("Please select a restaurant.");
      return;
    }
    if (!Number.isFinite(meals) || meals <= 0) {
      setError("Please enter a positive number of meals.");
      return;
    }
    if (!serviceDateTime) {
      setError("Please choose a service date/time.");
      return;
    }

    createBookingMutation.mutate({
      restaurantId: restId,
      mealsBooked: meals,
      serviceType,
      beneficiaryId: beneficiaryId ? Number(beneficiaryId) : null,
      comment,
      serviceDateTime,
    });
  };

  const handleCreateBeneficiary = (e) => {
    e.preventDefault();
    setBError("");
    setBSuccess("");

    if (!bFirstName || !bLastName || !bEmail) {
      setBError("First name, last name and email are required.");
      return;
    }

    createBeneficiaryMutation.mutate({
      firstName: bFirstName,
      lastName: bLastName,
      email: bEmail,
      phone: bPhone || null,
      birthYear: bBirthYear ? Number(bBirthYear) : null,
      rgpdAccepted: bRgpdAccepted,
    });
  };

  if (
    isLoadingBookings ||
    isLoadingRestaurants ||
    isLoadingBeneficiaries
  ) {
    return (
      <div className="mx-auto mt-20 max-w-5xl px-4 text-sm text-zinc-600">
        Loading bookings...
      </div>
    );
  }

  if (bookingsError || restaurantsError || beneficiariesError) {
    return (
      <div className="mx-auto mt-20 max-w-5xl px-4 text-sm text-red-600">
        Failed to load data
      </div>
    );
  }

  const restaurantById = new Map(restaurants.map((r) => [r.id, r]));

  return (
    <div className="mx-auto mt-20 max-w-5xl px-4 pb-10">
      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Mes réservations
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Beneficiary card */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-zinc-800">
            Ajouter un bénéficiaire
          </h2>

          <form className="space-y-3" onSubmit={handleCreateBeneficiary}>
            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">First name</label>
              <input
                type="text"
                value={bFirstName}
                onChange={(e) => setBFirstName(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">Last name</label>
              <input
                type="text"
                value={bLastName}
                onChange={(e) => setBLastName(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">Email</label>
              <input
                type="email"
                value={bEmail}
                onChange={(e) => setBEmail(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">Phone</label>
              <input
                type="text"
                value={bPhone}
                onChange={(e) => setBPhone(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">Birth year</label>
              <input
                type="number"
                value={bBirthYear}
                onChange={(e) => setBBirthYear(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-zinc-700">
              <input
                type="checkbox"
                checked={bRgpdAccepted}
                onChange={(e) => setBRgpdAccepted(e.target.checked)}
                className="h-3 w-3 rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
              />
              RGPD accepted
            </label>

            <button
              type="submit"
              disabled={createBeneficiaryMutation.isLoading}
              className="mt-1 inline-flex items-center justify-center rounded-md border border-zinc-300 bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createBeneficiaryMutation.isLoading
                ? "Creating..."
                : "Create beneficiary"}
            </button>

            {bError && (
              <div className="text-xs text-red-600">{bError}</div>
            )}
            {bSuccess && (
              <div className="text-xs text-emerald-600">{bSuccess}</div>
            )}
          </form>
        </div>

        {/* Booking card */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-zinc-800">
            Créer une réservation
          </h2>

          <form className="space-y-3" onSubmit={handleCreateBooking}>
            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">Restaurant</label>
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                    {r.cuisine ? ` - ${r.cuisine}` : ""} (#{r.id})
                  </option>
                ))}
              </select>
            </div>

            {restaurantId && (() => {
              const selected = restaurantById.get(Number(restaurantId));
              if (!selected || selected.min_delay_minutes == null) return null;
              return (
                <p className="text-[11px] text-zinc-500">
                  Réservation au moins{" "}
                  <span className="font-medium">
                    {selected.min_delay_minutes} minutes
                  </span>{" "}
                  à l’avance.
                </p>
              );
            })()}

            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">Service date/time</label>
              <input
                type="datetime-local"
                value={serviceDateTime}
                onChange={(e) => setServiceDateTime(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">Meals booked</label>
              <input
                type="number"
                min="1"
                value={mealsBooked}
                onChange={(e) => setMealsBooked(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">Service type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="ON_SITE">Sur place</option>
                <option value="TAKEAWAY">À emporter</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">Beneficiary</label>
              <select
                value={beneficiaryId}
                onChange={(e) => setBeneficiaryId(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">Select a beneficiary</option>
                {beneficiaries.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.first_name} {b.last_name} ({b.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-zinc-700">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="h-16 w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={createBookingMutation.isLoading}
              className="mt-1 inline-flex items-center justify-center rounded-md border border-zinc-300 bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createBookingMutation.isLoading ? "Creating..." : "Create booking"}
            </button>

            {error && <div className="text-xs text-red-600">{error}</div>}
            {success && (
              <div className="text-xs text-emerald-600">{success}</div>
            )}
          </form>
        </div>
      </div>

      {/* Bookings table */}
      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Historique des réservations
        </h2>

        {bookings.length === 0 ? (
          <div className="text-sm text-zinc-500">No bookings yet.</div>
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
