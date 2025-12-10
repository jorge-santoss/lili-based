// services/booking.service.js
import db from "../config/database.js";

// Créer une réservation
async function createBooking({ associationId, restaurantId, mealsBooked }) {
  const stmt = db.prepare(`
    INSERT INTO bookings (association_id, restaurant_id, meals_booked)
    VALUES (?, ?, ?)
  `);

  const result = await stmt.run(associationId, restaurantId, mealsBooked);

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

// (Optionnel) Récupérer les réservations d'un restaurant
async function getBookingsForRestaurant(restaurantId) {
  const stmt = db.prepare(`
    SELECT *
    FROM bookings
    WHERE restaurant_id = ?
    ORDER BY booking_date DESC
  `);

  return await stmt.all(restaurantId);
}

export default {
  createBooking,
  getBookingsForAssociation,
  getBookingsForRestaurant,
};
