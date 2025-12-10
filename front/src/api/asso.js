// src/api/asso.js
import instance from "./config";

// Create a booking
export function createBooking(data) {
  // data: { restaurantId, mealsBooked }
  return instance.post("/api/asso/bookings", data);
}

// List bookings for current association
export function getMyBookings() {
  return instance.get("/api/asso/bookings");
}


