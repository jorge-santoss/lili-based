// src/api/admin.js
import instance from './config.js';

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

export default {
  getAssociations,
  getAssociation,
  updateAssociationMeals
};
