import db from "../config/database.js";

async function getAllRestaurants() {
  const stmt = db.prepare("SELECT * FROM restaurants ORDER BY name ASC");
  return await stmt.all();
}

async function getRestaurantById(id) {
  return await db.prepare("SELECT * FROM restaurants WHERE id = ?").get(id);
}

async function createRestaurant({ name, address, email, phone }) {
  const stmt = db.prepare(`
    INSERT INTO restaurants (name, address, email, phone)
    VALUES (?, ?, ?, ?)
  `);
  const result = await stmt.run(name, address ?? null, email ?? null, phone ?? null);
  return await db.prepare("SELECT * FROM restaurants WHERE id = ?").get(result.lastInsertRowid);
}

export default {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
};
