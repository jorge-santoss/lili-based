// src/api/resto.js
import instance from "./config";

export function getMyRestaurantBookings() {
  return instance.get("/api/resto/bookings");
}

export function confirmBooking(id) {
  return instance.post(`/api/resto/bookings/${id}/confirm`);
}

export function rejectBooking(id) {
  return instance.post(`/api/resto/bookings/${id}/reject`);
}

export function markBookingDone(id) {
  // ↳ ajouter /api comme les autres
  return instance.post(`/api/resto/bookings/${id}/done`);
}

export function getRestoStats() {
  return instance.get("/api/resto/stats");
}

export function getMyRestaurantProfile() {
  return instance.get("/api/resto/me");
}

export function updateMyRestaurantProfile(data) {
  return instance.patch("/api/resto/me", data);
}
