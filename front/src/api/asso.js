// src/api/asso.js
import instance from "./config";

// Create a booking
export function createBooking(data) {
  // data: { restaurantId, mealsBooked, serviceType, beneficiaryId, comment, serviceDateTime }
  return instance.post("/api/asso/bookings", data);
}

// List bookings for the logged association
export function getMyBookings() {
  return instance.get("/api/asso/bookings");
}

// List restaurants visible to the association
export function getRestaurantsForAsso() {
  return instance.get("/api/asso/restaurants");
}

// List beneficiaries
export function getBeneficiaries() {
  return instance.get("/api/asso/beneficiaries");
}

// Create beneficiary
export function createBeneficiary(data) {
  return instance.post("/api/asso/beneficiaries", data);
}


export function getAssoStats() {
  return instance.get("/api/asso/stats");
}


export function getMyBeneficiaries() {
  return instance.get("/asso/beneficiaries");
}

export function updateMyBeneficiary(id, payload) {
  return instance.put(`/asso/beneficiaries/${id}`, payload);
}

export function deleteMyBeneficiary(id) {
  return instance.delete(`/asso/beneficiaries/${id}`);
}