// services/association.service.js
import db from "../config/database.js";

const ALLOWED_SORT_COLUMNS = new Set([
  "id",
  "name",
    "address",
  "email",
  "phone",
  "contact_name",
  "meals_available",
  "created_at",
  "updated_at",
]);

function sanitizeSortColumn(col) {
  if (!col) return "id";
  return ALLOWED_SORT_COLUMNS.has(col) ? col : "id";
}

function sanitizeOrder(order) {
  if (!order) return "ASC";
  const up = String(order).toUpperCase();
  return up === "DESC" ? "DESC" : "ASC";
}

/**
 * Get all associations with optional filters:
 * filters = { search, sort, order, limit, offset }
 */
async function getAllAssociations(filters = {}) {
  const { search, sort, order, limit, offset } = filters;
  const sortCol = sanitizeSortColumn(sort);
  const sortOrder = sanitizeOrder(order);

  let sql = `SELECT * FROM associations`;
  const params = [];

  if (search) {
    sql += ` WHERE name LIKE ? OR address LIKE ? OR email LIKE ? OR contact_name LIKE ?`;
    const like = `%${search}%`;
    params.push(like, like, like, like);
  }

  sql += ` ORDER BY ${sortCol} ${sortOrder}`;

  if (typeof limit !== "undefined" && limit !== null) {
    sql += ` LIMIT ?`;
    params.push(Number(limit));
    if (typeof offset !== "undefined" && offset !== null) {
      sql += ` OFFSET ?`;
      params.push(Number(offset));
    }
  } else if (typeof offset !== "undefined" && offset !== null) {
    // SQLite requires LIMIT when OFFSET is used; use a large LIMIT fallback
    sql += ` LIMIT -1 OFFSET ?`;
    params.push(Number(offset));
  }

  const stmt = db.prepare(sql);
  const rows = await stmt.all(...params);
  return rows;
}

/**
 * Get a single association by id
 */
async function getAssociationById(id) {
  const query = `SELECT * FROM associations WHERE id = ?`;
  const row = await db.prepare(query).get(id);
  return row;
}

/**
 * Update meals_available for an association.
 * Note: enforce admin checks in your route/controller before calling this.
 * Returns the updated association row.
 */
async function updateAssociationMeals(id, meals_available) {
  const query = `
    UPDATE associations
    SET meals_available = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const result = await db.prepare(query).run(meals_available, id);

  if (result.changes === 0) {
    return null; // no row updated (not found)
  }

  return await db.prepare(`SELECT * FROM associations WHERE id = ?`).get(id);
}

export default {
  getAllAssociations,
  getAssociationById,
  updateAssociationMeals,
};
