// src/page/asso/AssoBookings.jsx
import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "@/api/asso";

export default function AssoBookings() {
  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["asso-bookings"],
    queryFn: () => getMyBookings().then((res) => res.data),
  });

  if (isLoading) {
    return <div style={{ padding: 16 }}>Loading bookings...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 16, color: "red" }}>
        Failed to load bookings
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>My bookings</h1>

      <a
        href="/asso/bookings-test"
        style={{
          display: "inline-block",
          marginTop: 8,
          marginBottom: 16,
          color: "#2563eb",
        }}
      >
        Create booking
      </a>

      {bookings.length === 0 ? (
        <div>No bookings yet.</div>
      ) : (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: 8,
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                Date
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                Restaurant
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                Meals
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                Type
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: 8,
                  }}
                >
                  {new Date(b.booking_date).toLocaleString()}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: 8,
                  }}
                >
                  {b.restaurant_name ?? `Resto #${b.restaurant_id}`}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: 8,
                  }}
                >
                  {b.meals_booked}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: 8,
                  }}
                >
                  {b.service_type === "TAKEAWAY" ? "À emporter" : "Sur place"}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: 8,
                  }}
                >
                  {b.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
