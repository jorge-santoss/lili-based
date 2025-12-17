// src/page/resto/RestoBookings.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyRestaurantBookings,
  confirmBooking,
  rejectBooking,
  markBookingDone,
} from "@/api/resto";

export default function RestoBookings() {
  const queryClient = useQueryClient();

  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resto-bookings"],
    queryFn: () => getMyRestaurantBookings().then((res) => res.data),
  });

  const confirmMutation = useMutation({
    mutationFn: (id) => confirmBooking(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["resto-bookings"]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectBooking(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["resto-bookings"]);
    },
  });

  const markDoneMutation = useMutation({
    mutationFn: (id) => markBookingDone(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["resto-bookings"]);
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto mt-20 max-w-5xl px-4 text-sm text-zinc-600">
        Loading bookings…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-20 max-w-5xl px-4 text-sm text-red-600">
        Failed to load bookings
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-5xl px-4 pb-10">
      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Réservations du restaurant
      </h1>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Demandées par les associations
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
                  <th className="px-3 py-2 font-medium">Association</th>
                  <th className="px-3 py-2 font-medium">Meals</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                  <th className="px-3 py-2 font-medium">Beneficiary</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Phone</th>
                  <th className="px-3 py-2 font-medium">Comment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
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
                      {b.association_name ?? `Asso #${b.association_id}`}
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
                    <td className="px-3 py-2">
                      {b.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => confirmMutation.mutate(b.id)}
                            disabled={confirmMutation.isLoading}
                            className="rounded-md border border-emerald-500 bg-emerald-500 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => rejectMutation.mutate(b.id)}
                            disabled={rejectMutation.isLoading}
                            className="rounded-md border border-red-500 bg-white px-2 py-0.5 text-[11px] font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {b.status === "CONFIRMED" && (
                        <button
                          onClick={() => markDoneMutation.mutate(b.id)}
                          disabled={markDoneMutation.isLoading}
                          className="rounded-md border border-zinc-300 bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {markDoneMutation.isLoading
                            ? "Updating..."
                            : "Mark as served"}
                        </button>
                      )}

                      {b.status !== "PENDING" &&
                        b.status !== "CONFIRMED" && (
                          <span className="text-[11px] text-zinc-500">—</span>
                        )}
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
                      {b.beneficiary_phone || "-"}
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
