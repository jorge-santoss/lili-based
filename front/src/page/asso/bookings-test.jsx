// src/page/asso/bookings-test.jsx
import { useState } from "react";
import { createBooking, getMyBookings } from "@/api/asso";

export default function BookingsTest() {
  const [restaurantId, setRestaurantId] = useState("");
  const [mealsBooked, setMealsBooked] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await createBooking({
        restaurantId: Number(restaurantId),
        mealsBooked: Number(mealsBooked),
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to create booking");
    }
  };

  const handleLoad = async () => {
    setError("");
    try {
      const res = await getMyBookings();
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Test Bookings</h1>
      <form onSubmit={handleCreate}>
        <div>
          <label>Restaurant ID: </label>
          <input
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
          />
        </div>
        <div>
          <label>Meals booked: </label>
          <input
            value={mealsBooked}
            onChange={(e) => setMealsBooked(e.target.value)}
          />
        </div>
        <button type="submit">Create booking</button>
      </form>

      <button onClick={handleLoad}>Load my bookings</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
