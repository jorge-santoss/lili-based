// src/page/asso/bookings-test.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createBooking, getMyBookings } from "@/api/asso";
// import { getRestaurants } from "@/api/restaurants";
import { getRestaurantsForAsso } from "@/api/asso";

export default function BookingsTest() {
  const [restaurantId, setRestaurantId] = useState("");
  const [mealsBooked, setMealsBooked] = useState("");
  const [serviceType, setServiceType] = useState("ON_SITE"); // <- NEW
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Load restaurants for the select
  const { data: restaurants = [], isLoading: isLoadingRestaurants } = useQuery({
    queryKey: ["asso-restaurants"],
    queryFn: () => getRestaurantsForAsso().then(res => res.data),
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await createBooking({
        restaurantId: Number(restaurantId),
        mealsBooked: Number(mealsBooked),
        serviceType, // <- NEW
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
    <div style={{ padding: 16 }}>
      <h1>Test Bookings</h1>

      {isLoadingRestaurants ? (
        <div>Loading restaurants...</div>
      ) : (
        <form onSubmit={handleCreate}>
          <div>
            <label>
              Restaurant:
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                required
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} (#{r.id})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Meals booked:
              <input
                type="number"
                min="1"
                value={mealsBooked}
                onChange={(e) => setMealsBooked(e.target.value)}
                required
              />
            </label>
          </div>
          

{/* NEW: service type select */}
          <div>
            <label>
              Service type:
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="ON_SITE">Sur place</option>
                <option value="TAKEAWAY">À emporter</option>
              </select>
            </label>
          </div>
          
          <button type="submit">Create booking</button>
        </form>
      )}

      <button onClick={handleLoad} style={{ marginTop: 16 }}>
        Load my bookings
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
