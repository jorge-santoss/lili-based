// routes/resto.router.js
import { Hono } from "hono";
import db from "../config/database.js";

import bookingService from "../services/booking.service.js";
import { authGuard } from "../middlewares/authguard.js";
import restaurantService from "../services/restaurant.service.js";

const restoRouter = new Hono();

// all /resto/* need auth
restoRouter.use("*", authGuard());

// GET /resto/bookings – bookings for current restaurant
restoRouter.get("/bookings", async (c) => {
  try {
    const user = c.get("user");
    console.log("RESTO GET user:", user); // add this log
    const restaurantId = user.restaurant_id;   // <-- use mapped restaurant

    if (!restaurantId) {
      return c.json([], 200);
    }

    const rows = await bookingService.getBookingsForRestaurant(restaurantId);
    return c.json(rows);
  } catch (err) {
    console.error("GET /resto/bookings ERROR", err);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// change booking status from PENDING to CONFIRMED or REJECTED

// POST /resto/bookings/:id/confirm
restoRouter.post("/bookings/:id/confirm", async (c) => {
  try {
    const user = c.get("user");
    const restaurantId = user.restaurant_id;
    const id = Number(c.req.param("id"));

    if (!restaurantId || Number.isNaN(id)) {
      return c.json({ error: "Invalid restaurant or booking id" }, 400);
    }

    // Ensure the booking belongs to this restaurant
    const updated = await bookingService.updateBookingStatus({
      id,
      restaurantId,
      status: "CONFIRMED",
    });

    if (!updated) {
      return c.json({ error: "Booking not found" }, 404);
    }

    return c.json(updated);
  } catch (err) {
    console.error("POST /resto/bookings/:id/confirm ERROR", err);
    return c.json({ error: "Failed to confirm booking" }, 500);
  }
});

// POST /resto/bookings/:id/reject
restoRouter.post("/bookings/:id/reject", async (c) => {
  try {
    const user = c.get("user");
    const restaurantId = user.restaurant_id;
    const id = Number(c.req.param("id"));

    if (!restaurantId || Number.isNaN(id)) {
      return c.json({ error: "Invalid restaurant or booking id" }, 400);
    }

    const updated = await bookingService.updateBookingStatus({
      id,
      restaurantId,
      status: "REJECTED",
    });

    if (!updated) {
      return c.json({ error: "Booking not found" }, 404);
    }

    return c.json(updated);
  } catch (err) {
    console.error("POST /resto/bookings/:id/reject ERROR", err);
    return c.json({ error: "Failed to reject booking" }, 500);
  }
});


// POST /resto/bookings/:id/done – marquer une réservation comme servie
restoRouter.post("/bookings/:id/done", async (c) => {
  try {
    const user = c.get("user");
    const restaurantId = user.restaurant_id;
    const id = Number(c.req.param("id"));

    if (!restaurantId || Number.isNaN(id)) {
      return c.json({ error: "Invalid restaurant or booking id" }, 400);
    }

    // On réutilise updateBookingStatus, mais on pourrait aussi vérifier
    // que le statut actuel est déjà CONFIRMED côté SQL si tu veux durcir.
    const updated = await bookingService.updateBookingStatus({
      id,
      restaurantId,
      status: "DONE",
    });

    if (!updated) {
      return c.json({ error: "Booking not found" }, 404);
    }

    return c.json(updated);
  } catch (err) {
    console.error("POST /resto/bookings/:id/done ERROR", err);
    return c.json({ error: "Failed to mark booking as done" }, 500);
  }
});



restoRouter.get("/stats", async (c) => {
  try {
    const user = c.get("user");
    const restaurantId = user.restaurant_id;
    if (!restaurantId) {
      return c.json({ error: "No restaurant linked to this user" }, 400);
    }

    const total = await db
      .prepare(
        "SELECT COUNT(*) AS count, COALESCE(SUM(meals_booked), 0) AS meals FROM bookings WHERE restaurant_id = ?"
      )
      .get(restaurantId);

    const byServiceType = await db
      .prepare(
        `
        SELECT service_type, COUNT(*) AS count, COALESCE(SUM(meals_booked), 0) AS meals
        FROM bookings
        WHERE restaurant_id = ?
        GROUP BY service_type
      `
      )
      .all(restaurantId);

    return c.json({
      totalBookings: total?.count ?? 0,
      totalMeals: total?.meals ?? 0,
      byServiceType,
    });
  } catch (err) {
    console.error("GET /resto/stats ERROR:", err);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});


// GET /resto/me -> profil du resto courant
restoRouter.get("/me", async (c) => {
  try {
    const user = c.get("user");
    const restaurantId = user.restaurant_id;
    if (!restaurantId) return c.json({ error: "No restaurant linked" }, 400);

    const resto = await restaurantService.getRestaurantById(restaurantId);
    if (!resto) return c.json({ error: "Restaurant not found" }, 404);
    return c.json(resto);
  } catch (err) {
    console.error("GET /resto/me ERROR", err);
    return c.json({ error: "Failed to fetch restaurant profile" }, 500);
  }
});

// PATCH /resto/me -> maj des options/cuisine/délai/fermeture
restoRouter.patch("/me", async (c) => {
  try {
    const user = c.get("user");
    const restaurantId = user.restaurant_id;
    if (!restaurantId) return c.json({ error: "No restaurant linked" }, 400);

    const body = await c.req.json();
    const payload = {
      cuisine: body.cuisine,
      options: body.options,
      min_delay_minutes:
        typeof body.min_delay_minutes !== "undefined"
          ? Number(body.min_delay_minutes)
          : undefined,
      is_closed:
        typeof body.is_closed !== "undefined" ? !!body.is_closed : undefined,
      closed_until: body.closed_until ?? undefined,
    };

    const updated = await restaurantService.updateRestaurant(
      restaurantId,
      payload
    );
    if (!updated) return c.json({ error: "Restaurant not found" }, 404);
    return c.json(updated);
  } catch (err) {
    console.error("PATCH /resto/me ERROR", err);
    return c.json({ error: "Failed to update restaurant profile" }, 500);
  }
});

restoRouter.get("/profile", async (c) => {
  try {
    const user = c.get("user");
    const restaurantId = user.restaurant_id;

    if (!restaurantId) {
      return c.json({ error: "No restaurant linked to this user" }, 400);
    }

    const resto = await restaurantService.getRestaurantById(restaurantId);
    if (!resto) {
      return c.json({ error: "Restaurant not found" }, 404);
    }

    return c.json(resto);
  } catch (err) {
    console.error("GET /resto/profile ERROR", err);
    return c.json({ error: "Failed to fetch restaurant profile" }, 500);
  }
});

// PATCH /resto/profile – mise à jour du restaurant du user connecté
restoRouter.patch("/profile", async (c) => {
  try {
    const user = c.get("user");
    const restaurantId = user.restaurant_id;

    if (!restaurantId) {
      return c.json({ error: "No restaurant linked to this user" }, 400);
    }

    const body = await c.req.json();

    const data = {
      name: body.name,
      address: body.address,
      email: body.email,
      phone: body.phone,
      cuisine: body.cuisine,
      options: body.options,
      min_delay_minutes: body.min_delay_minutes,
      is_closed: body.is_closed,
      closed_until: body.closed_until,
    };

    const updated = await restaurantService.updateRestaurant(restaurantId, data);
    if (!updated) {
      return c.json({ error: "Restaurant not found" }, 404);
    }

    return c.json(updated);
  } catch (err) {
    console.error("PATCH /resto/profile ERROR", err);
    return c.json({ error: "Failed to update restaurant profile" }, 500);
  }
});



export default restoRouter;
