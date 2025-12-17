// routes/asso.router.js
import { Hono } from "hono";
import { authGuard } from "../middlewares/authguard.js";
import bookingService from "../services/booking.service.js";
import beneficiaryService from "../services/beneficiary.service.js";
import restaurantService from "../services/restaurant.service.js";

const assoRouter = new Hono();

// all /asso/* need auth
assoRouter.use("*", authGuard());

// GET /api/asso/me – infos de l'asso (user connecté)
assoRouter.get("/me", async (c) => {
  const user = c.get("user");
  return c.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    association_id: user.association_id,
  });
});

// GET /api/asso/bookings – réservations pour l'association du user
assoRouter.get("/bookings", async (c) => {
  try {
    const user = c.get("user");
    const associationId = user.association_id;

    if (!associationId) {
      return c.json([], 200);
    }

    const rows = await bookingService.getBookingsForAssociation(associationId);
    return c.json(rows);
  } catch (err) {
    console.error("GET /asso/bookings ERROR", err);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// --- NEW: beneficiaries ---

// GET /api/asso/beneficiaries – liste des bénéficiaires de cette asso
assoRouter.get("/beneficiaries", async (c) => {
  try {
    const user = c.get("user");
    const associationId = user.association_id;
    if (!associationId) {
      return c.json([], 200);
    }
    const rows =
      await beneficiaryService.getBeneficiariesForAssociation(associationId);
    return c.json(rows);
  } catch (err) {
    console.error("GET /asso/beneficiaries ERROR", err);
    return c.json({ error: "Failed to fetch beneficiaries" }, 500);
  }
});

// POST /api/asso/beneficiaries – créer un bénéficiaire pour cette asso
assoRouter.post("/beneficiaries", async (c) => {
  try {
    const user = c.get("user");
    const associationId = user.association_id;
    if (!associationId) {
      return c.json(
        { error: "No association linked to this user" },
        400
      );
    }

    const body = await c.req.json();
    const created = await beneficiaryService.createBeneficiary({
      associationId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone ?? null,
      birthYear:
        typeof body.birthYear !== "undefined"
          ? Number(body.birthYear)
          : null,
      rgpdAccepted: !!body.rgpdAccepted,
    });

    return c.json(created, 201);
  } catch (err) {
    console.error("POST /asso/beneficiaries ERROR", err);
    return c.json({ error: "Failed to create beneficiary" }, 500);
  }
});

// POST /api/asso/bookings – créer une réservation pour cette association
assoRouter.post("/bookings", async (c) => {
  try {
    const user = c.get("user");
    const associationId = user.association_id;
    if (!associationId) {
      return c.json(
        { error: "No association linked to this user" },
        400
      );
    }

    const body = await c.req.json();
    const restaurantId = Number(body.restaurantId);
    const mealsBooked = Number(body.mealsBooked);
    const serviceType = body.serviceType || "ON_SITE";
    const beneficiaryId =
      typeof body.beneficiaryId === "number" ||
      typeof body.beneficiaryId === "string"
        ? Number(body.beneficiaryId)
        : null;
    const comment = body.comment || "";
    const serviceDateTime = body.serviceDateTime || null;

    if (!restaurantId || Number.isNaN(restaurantId)) {
      return c.json({ error: "Invalid restaurantId" }, 400);
    }
    if (!Number.isFinite(mealsBooked) || mealsBooked <= 0) {
      return c.json({ error: "Invalid mealsBooked" }, 400);
    }
    if (!serviceDateTime) {
      return c.json({ error: "Missing serviceDateTime" }, 400);
    }

    const booking = await bookingService.createBooking({
      associationId,
      restaurantId,
      mealsBooked,
      serviceType,
      beneficiaryId,
      beneficiarySnapshot: null,
      // you could also fetch beneficiary and pass snapshot if you want
      serviceDateTime,
    });

    return c.json(booking, 201);
  } catch (err) {
    console.error("POST /asso/bookings ERROR", err);
    return c.json({ error: "Failed to create booking" }, 500);
  }
});





// GET /api/asso/restaurants – restaurants disponibles pour les assos
assoRouter.get("/restaurants", async (c) => {
  try {
    // If later you need to filter by association, you can use user.association_id
    // const user = c.get("user");
    // const associationId = user.association_id;

    const rows = await restaurantService.getRestaurantsForAssociation();
    return c.json(rows);
  } catch (err) {
    console.error("GET /asso/restaurants ERROR", err);
    return c.json({ error: "Failed to fetch restaurants" }, 500);
  }
});

export default assoRouter;
