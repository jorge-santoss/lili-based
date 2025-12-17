import db from "../config/database.js";

async function getAllRestaurants() {
  const stmt = db.prepare("SELECT * FROM restaurants ORDER BY name ASC");
  return await stmt.all();
}

async function getRestaurantById(id) {
  return await db.prepare("SELECT * FROM restaurants WHERE id = ?").get(id);
}

async function createRestaurant({ name, address, email, phone, cuisine, options, min_delay_minutes, is_closed, closed_until }) {
  const stmt = db.prepare(`
    INSERT INTO restaurants (name, address, email, phone, cuisine, options, min_delay_minutes, is_closed, closed_until)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = await stmt.run(
    name,
    address ?? null,
    email ?? null,
    phone ?? null,
    cuisine ?? null,
    options ?? null,
    typeof min_delay_minutes === "number" ? min_delay_minutes : 0,
    is_closed ? 1 : 0,
    closed_until ?? null
  );
  return await db.prepare("SELECT * FROM restaurants WHERE id = ?").get(result.lastInsertRowid);
}

async function updateRestaurant(id, data) {
  const fields = [];
  const params = [];

  if (typeof data.name !== "undefined") {
    fields.push("name = ?");
    params.push(data.name);
  }
  if (typeof data.address !== "undefined") {
    fields.push("address = ?");
    params.push(data.address);
  }
  if (typeof data.email !== "undefined") {
    fields.push("email = ?");
    params.push(data.email);
  }
  if (typeof data.phone !== "undefined") {
    fields.push("phone = ?");
    params.push(data.phone);
  }

  if (fields.length === 0) {
    return await getRestaurantById(id);
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");

  if (typeof data.cuisine !== "undefined") {
  fields.push("cuisine = ?");
  params.push(data.cuisine);
}
if (typeof data.options !== "undefined") {
  fields.push("options = ?");
  params.push(data.options);
}
if (typeof data.min_delay_minutes !== "undefined") {
  fields.push("min_delay_minutes = ?");
  params.push(Number(data.min_delay_minutes) || 0);
}
if (typeof data.is_closed !== "undefined") {
  fields.push("is_closed = ?");
  params.push(data.is_closed ? 1 : 0);
}
if (typeof data.closed_until !== "undefined") {
  fields.push("closed_until = ?");
  params.push(data.closed_until ?? null);
}


  const sql = `
    UPDATE restaurants
    SET ${fields.join(", ")}
    WHERE id = ?
  `;
  params.push(id);

  const result = await db.prepare(sql).run(...params);
  if (result.changes === 0) {
    return null;
  }

  return await getRestaurantById(id);
}

async function deleteRestaurant(id) {
  // delete dependent bookings first
  await db.prepare("DELETE FROM bookings WHERE restaurant_id = ?").run(id);

  const result = await db
    .prepare("DELETE FROM restaurants WHERE id = ?")
    .run(id);

  return result.changes > 0;
}

//  to join associations
async function getRestaurantWithAssociation(id) {
  return await db
    .prepare(
      `
      SELECT r.*, a.name AS association_name
      FROM restaurants r
      LEFT JOIN associations a ON a.id = r.association_id
      WHERE r.id = ?
    `
    )
    .get(id);
}


async function getRestaurantsForAssociation() {
  const sql = `
    SELECT
      id,
      name,
      address,
      email,
      phone,
      cuisine,
      options,
      min_delay_minutes,
      is_closed,
      closed_until
    FROM restaurants
    WHERE is_closed = 0 OR is_closed IS NULL
  `;
  return await db.prepare(sql).all();
}





export default {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantWithAssociation,
  getRestaurantsForAssociation,
};
