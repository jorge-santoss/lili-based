// services/booking.service.js
import db from "../config/database.js";

// Créer une réservation
async function createBooking({
  associationId,
  restaurantId,
  mealsBooked,
  serviceType,
  serviceDateTime, // NEW
  beneficiaryId,
  beneficiarySnapshot, // { firstName, lastName, email, phone, comment }
}) {
  const stmt = db.prepare(`
    INSERT INTO bookings (
      association_id,
      restaurant_id,
      meals_booked,
      service_type,
      status,
      beneficiary_id,
      beneficiary_first_name,
      beneficiary_last_name,
      beneficiary_email,
      beneficiary_phone,
      beneficiary_comment,
      service_datetime         -- NEW
    )
    VALUES (?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = await stmt.run(
    associationId,
    restaurantId,
    mealsBooked,
    serviceType,
    beneficiaryId ?? null,
    beneficiarySnapshot?.firstName ?? null,
    beneficiarySnapshot?.lastName ?? null,
    beneficiarySnapshot?.email ?? null,
    beneficiarySnapshot?.phone ?? null,
    beneficiarySnapshot?.comment ?? null,
    serviceDateTime ?? null // NEW
  );

  return await db
    .prepare("SELECT * FROM bookings WHERE id = ?")
    .get(result.lastInsertRowid);
}

// Récupérer toutes les réservations d'une association
async function getBookingsForAssociation(associationId) {
  const stmt = db.prepare(`
    SELECT *
    FROM bookings
    WHERE association_id = ?
    ORDER BY booking_date DESC
  `);

  return await stmt.all(associationId);
}

// Récupérer les réservations d'un restaurant
async function getBookingsForRestaurant(restaurantId) {
  const stmt = db.prepare(`
    SELECT 
      id,
      association_id,
      restaurant_id,
      meals_booked,
      booking_date,
      status,
      service_type,
      beneficiary_id,
      beneficiary_first_name,
      beneficiary_last_name,
      beneficiary_email,
      beneficiary_phone,
      beneficiary_comment,
      service_datetime              -- NEW
    FROM bookings
    WHERE restaurant_id = ?
    ORDER BY booking_date DESC
  `);
  return await stmt.all(restaurantId);
}

async function updateBookingStatus({ id, restaurantId, status }) {
  const stmt = db.prepare(`
    UPDATE bookings
    SET status = ?
    WHERE id = ? AND restaurant_id = ?
  `);
  const result = await stmt.run(status, id, restaurantId);

  if (result.changes === 0) {
    return null;
  }

  return await db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
}

// Récupérer toutes les réservations (vue admin)
async function getAllBookings(filters = {}) {
  const {
    status,
    serviceType,
    associationId,
    restaurantId,
    sort = "booking_date",
    order = "desc",
  } = filters;

  const allowedSort = new Set(["booking_date", "meals_booked"]);
  const sortCol = allowedSort.has(sort) ? sort : "booking_date";
  const sortOrder = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

  let sql = `
    SELECT 
      b.id,
      b.booking_date,
      b.status,
      b.service_type,
      b.meals_booked,
      b.association_id,
      b.restaurant_id,
      b.beneficiary_id,
      b.beneficiary_first_name,
      b.beneficiary_last_name,
      b.beneficiary_email,
      b.beneficiary_phone,
      b.beneficiary_comment,
      b.service_datetime,          -- NEW
      a.name AS association_name,
      r.name AS restaurant_name
    FROM bookings b
    LEFT JOIN associations a ON a.id = b.association_id
    LEFT JOIN restaurants r ON r.id = b.restaurant_id
  `;

  const params = [];
  const where = [];

  if (status) {
    where.push("b.status = ?");
    params.push(status);
  }
  if (serviceType) {
    where.push("b.service_type = ?");
    params.push(serviceType);
  }
  if (associationId) {
    where.push("b.association_id = ?");
    params.push(Number(associationId));
  }
  if (restaurantId) {
    where.push("b.restaurant_id = ?");
    params.push(Number(restaurantId));
  }

  if (where.length > 0) {
    sql += " WHERE " + where.join(" AND ");
  }

  sql += ` ORDER BY b.${sortCol} ${sortOrder}`;

  const stmt = db.prepare(sql);
  return await stmt.all(...params);
}

export default {
  createBooking,
  getBookingsForAssociation,
  getBookingsForRestaurant,
  updateBookingStatus,
  getAllBookings,
};
