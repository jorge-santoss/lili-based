import { Hono } from "hono";
import bookingService from "../services/booking.service.js";
import { authGuard } from "../middlewares/authguard.js";

const assoRouter = new Hono();

// Toutes les routes asso nécessitent d'être connectées
assoRouter.use("*", authGuard());

// POST /asso/bookings  -> créer une réservation
assoRouter.post("/bookings", async (c) => {
  try {
    const user = c.get("user"); // vient de authGuard, contient user.id, role, etc.

console.log("ASSO POST user:", user);   // <--- add here

    // Pour l’instant on suppose que user.id = association_id
    // (on pourra ajuster si tu as une vraie table de liaison user ↔ association)
    // const associationId = user.id;

    const body = await c.req.json();
    const restaurantId = Number(body.restaurantId);
    const mealsBooked = Number(body.mealsBooked);
console.log("ASSO POST body:", body, { restaurantId, mealsBooked });
    if (!restaurantId || Number.isNaN(restaurantId)) {
      return c.json({ error: "Invalid restaurantId" }, 400);
    }
    if (!mealsBooked || Number.isNaN(mealsBooked) || mealsBooked <= 0) {
      return c.json({ error: "Invalid mealsBooked" }, 400);
    }

    const associationId = user.id;  // <--- you forgot this line

    const booking = await bookingService.createBooking({
      associationId,
      restaurantId,
      mealsBooked,
    });


     console.log("ASSO POST created booking:", booking);
    return c.json(booking, 201);
  } catch (err) {
    console.error("POST /asso/bookings ERROR:", err);
    return c.json({ error: "Failed to create booking" }, 500);
  }
});

// GET /asso/bookings  -> liste des réservations de l’asso connectée
assoRouter.get("/bookings", async (c) => {
  try {
    const user = c.get("user");

console.log("ASSO GET user:", user);    // <--- and here

    const associationId = user.id; // même hypothèse temporaire

    const rows = await bookingService.getBookingsForAssociation(associationId);
    return c.json(rows);
  } catch (err) {
    console.error("GET /asso/bookings ERROR:", err);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

export default assoRouter;
