// src/api/admin.js
import instance from './config.js';

// api/admin.js
import axios from "./config";

/**
 * Fetch list of associations with optional query params:
 * { search, sort, order, limit, offset }
 */
export function getAssociations(params) {
  return instance.get('/admin/associations', { params });
}

/** Fetch a single association by id */
export function getAssociation(id) {
  return instance.get(`/admin/associations/${id}`);
}

/** Update mealsAvailable for an association (admin only) */
export function updateAssociationMeals(id, mealsAvailable) {
  return instance.patch(`/admin/associations/${id}/meals`, { mealsAvailable });
}

export function createAssociation(payload) {
  return axios.post("/admin/associations", payload);
}

export function updateAssociation(id, payload) {
  return axios.patch(`/admin/associations/${id}`, payload);
}


export function deleteAssociation(id) {
  return instance.delete(`/admin/associations/${id}`);
}



// restaurants

export function getRestaurants(params) {
  return instance.get("/admin/restaurants", { params });
}

export function createRestaurant(payload) {
  return instance.post("/admin/restaurants", payload);
}


export function getRestaurant(id) {
  return instance.get(`/admin/restaurants/${id}`);
}

export function updateRestaurant(id, payload) {
  return instance.patch(`/admin/restaurants/${id}`, payload);
}

export function deleteRestaurant(id) {
  return instance.delete(`/admin/restaurants/${id}`);
}



export function getAllBookings(params) {
  return instance.get("/admin/bookings", { params });
}

export function getBookingStats(params) {
  return instance.get("/admin/stats/bookings", { params });
}

export function linkUser(id, payload) {
  // payload: { associationId?, restaurantId? }
  return instance.patch(`/admin/users/${id}/link`, payload);
}


export function getUsers() {
  return instance.get("/admin/users");
}

export function updateUserRole(id, role) {
  return instance.patch(`/admin/users/${id}/role`, { role });
}

export function deleteUser(id) {
  return instance.delete(`/admin/users/${id}`);
}




export function updateUser(id, payload) {
  return instance.patch(`/api/admin/users/${id}`, payload);
}




export default {
  getAssociations,
  getAssociation,
  updateAssociationMeals,
  createAssociation,
  updateAssociation,
 deleteRestaurant,
 
  getRestaurants,
  createRestaurant,
  updateRestaurant,

  getAllBookings,

  getBookingStats,

  linkUser,
  getUsers,

  updateUserRole,
  deleteUser, 
  updateUser,
};
