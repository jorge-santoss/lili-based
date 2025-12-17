// routes/admin.router.js
import { Hono } from "hono";
// import { json } from "hono/utils";
import associationService from "../services/association.service.js";
import { adminGuard } from "../middlewares/authguard.js";

import db from "../config/database.js"; // add this import if not already
import restaurantService from "../services/restaurant.service.js";
import bookingService from "../services/booking.service.js";
import authService from "../services/auth.service.js";

const adminRouter = new Hono();

// Apply adminGuard to all admin routes
adminRouter.use("*", adminGuard());
/**
 * GET /admin/associations
 * Query params: search, sort (name, address, meals_available), order (asc|desc), limit, offset
 */
// routes/admin.router.js
adminRouter.get("/associations", async (c) => {
  try {
    const query = c.req.query(); // already an object

    const { search, sort, order, limit, offset } = query;

    const filters = {
      search,
      sort,
      order,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    };

    const rows = await associationService.getAllAssociations(filters);
    return c.json(rows);
  } catch (err) {
    console.error("ADMIN /associations ERROR:", err);
    return c.json({ error: "Failed to fetch associations" }, 500);
  }
});

/**
 * GET /admin/associations/:id
 */
adminRouter.get("/associations/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const assoc = await associationService.getAssociationById(id);
    if (!assoc) return c.json({ error: "Association not found" }, 404);
    return c.json(assoc);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch association" }, 500);
  }
});

/**
 * PATCH /admin/associations/:id/meals
 * Body: { mealsAvailable: number }
 */
adminRouter.patch("/associations/:id/meals", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const mealsAvailable = Number(
      body.mealsAvailable ?? body.meals_available ?? body.meals
    );
    if (Number.isNaN(mealsAvailable)) {
      return c.json({ error: "Invalid mealsAvailable value" }, 400);
    }

    const updated = await associationService.updateAssociationMeals(
      id,
      mealsAvailable
    );
    if (!updated)
      return c.json({ error: "Association not found or not updated" }, 404);
    return c.json(updated);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to update meals_available" }, 500);
  }
});

// POST /admin/associations - create a new association
adminRouter.post("/associations", async (c) => {
  try {
    const body = await c.req.json();
    const name = String(body.name ?? "").trim();
    const address = body.address ?? "";
    const email = body.email ?? "";
    const phone = body.phone ?? "";
    const contact_name = body.contact_name ?? "";
    const meals_available = Number(body.meals_available ?? 0);

    if (!name) {
      return c.json({ error: "Name is required" }, 400);
    }
    if (Number.isNaN(meals_available) || meals_available < 0) {
      return c.json({ error: "Invalid meals_available" }, 400);
    }

    const stmt = db.prepare(`
      INSERT INTO associations (name, address, email, phone, contact_name, meals_available)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = await stmt.run(
      name,
      address,
      email,
      phone,
      contact_name,
      meals_available
    );

    const created = await db
      .prepare("SELECT * FROM associations WHERE id = ?")
      .get(result.lastInsertRowid);

    return c.json(created, 201);
  } catch (err) {
    console.error("ADMIN POST /associations ERROR:", err);
    return c.json({ error: "Failed to create association" }, 500);
  }
});


// PATCH /admin/associations/:id - general update
adminRouter.patch("/associations/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();

    const payload = {
      name: body.name,
      address: body.address,
      email: body.email,
      phone: body.phone,
      contact_name: body.contact_name,
      meals_available:
        typeof body.meals_available !== "undefined"
          ? Number(body.meals_available)
          : undefined,
    };

    if (
      typeof payload.meals_available !== "undefined" &&
      (Number.isNaN(payload.meals_available) || payload.meals_available < 0)
    ) {
      return c.json(
        { error: "Invalid meals_available value" },
        400
      );
    }

    const updated = await associationService.updateAssociation(id, payload);
    if (!updated) {
      return c.json({ error: "Association not found" }, 404);
    }

    return c.json(updated);
  } catch (err) {
    console.error("ADMIN PATCH /associations/:id ERROR", err);
    return c.json({ error: "Failed to update association" }, 500);
  }
});

// ⬇️ ADD RESTAURANT ROUTES HERE

// GET /admin/restaurants
adminRouter.get("/restaurants", async (c) => {
  try {
    const rows = await restaurantService.getAllRestaurants();
    return c.json(rows);
  } catch (err) {
    console.error("ADMIN GET /restaurants ERROR", err);
    return c.json({ error: "Failed to fetch restaurants" }, 500);
  }
});


// GET /admin/restaurants/:id
adminRouter.get("/restaurants/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const restaurant = await restaurantService.getRestaurantWithAssociation(id);
    if (!restaurant) {
      return c.json({ error: "Restaurant not found" }, 404);
    }
    return c.json(restaurant);
  } catch (err) {
    console.error("ADMIN GET /restaurants/:id ERROR", err);
    return c.json({ error: "Failed to fetch restaurant" }, 500);
  }
});

// POST /admin/restaurants
adminRouter.post("/restaurants", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.name || !body.name.trim()) {
      return c.json({ error: "Name is required" }, 400);
    }

    const created = await restaurantService.createRestaurant({
      name: body.name.trim(),
      address: body.address?.trim() || null,
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
    });

    return c.json(created, 201);
  } catch (err) {
    console.error("ADMIN POST /restaurants ERROR", err);
    return c.json({ error: "Failed to create restaurant" }, 500);
  }
});

// PATCH /admin/restaurants/:id
adminRouter.patch("/restaurants/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();

    const updated = await restaurantService.updateRestaurant(id, {
      name: body.name,
      address: body.address,
      email: body.email,
      phone: body.phone,
    });

    if (!updated) {
      return c.json({ error: "Restaurant not found" }, 404);
    }

    return c.json(updated);
  } catch (err) {
    console.error("ADMIN PATCH /restaurants/:id ERROR", err);
    return c.json({ error: "Failed to update restaurant" }, 500);
  }
});

// DELETE /admin/restaurants/:id
// DELETE /admin/restaurants/:id
adminRouter.delete("/restaurants/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid id" }, 400);
    }

    const deleted = await restaurantService.deleteRestaurant(id);
    if (!deleted) {
      return c.json({ error: "Restaurant not found" }, 404);
    }

    return c.json({ success: true });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      console.error(
        "ADMIN DELETE /restaurants/:id FK ERROR (still referenced):",
        err
      );
      return c.json(
        {
          error:
            "Cannot delete restaurant while it has related bookings or users.",
        },
        400
      );
    }

    console.error("ADMIN DELETE /restaurants/:id ERROR", err);
    return c.json({ error: "Failed to delete restaurant" }, 500);
  }
});


// Liste globale des réservations pour l'admin
// GET /admin/bookings
adminRouter.get("/bookings", async (c) => {
  try {
    const q = c.req.query();
    const filters = {
      status: q.status,
      serviceType: q.serviceType,
      associationId: q.associationId,
      restaurantId: q.restaurantId,
      sort: q.sort,
      order: q.order,
    };

    const rows = await bookingService.getAllBookings(filters);
    return c.json(rows);
  } catch (err) {
    console.error("ADMIN GET /bookings ERROR:", err);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// GET /admin/stats/bookings
adminRouter.get("/stats/bookings", async (c) => {
  try {
    const q = c.req.query();
    const period = q.period || "all"; // all | week | month

    let dateFilter = "";
    const params = [];

    if (period === "week") {
      dateFilter = "WHERE booking_date >= datetime('now', '-7 days')";
    } else if (period === "month") {
      dateFilter = "WHERE booking_date >= datetime('now', '-30 days')";
    }

    // total
    const total = await db
      .prepare(`SELECT COUNT(*) as count FROM bookings ${dateFilter}`)
      .get(...params);


      // total valeur (repas à 1€)
const totalValue = await db
  .prepare(
    `SELECT COALESCE(SUM(meals_booked), 0) AS value
     FROM bookings
     ${dateFilter}`
  )
  .get(...params);


  // par asso
const byAssociation = await db
  .prepare(
    `
    SELECT 
      a.id AS association_id,
      a.name AS association_name,
      COUNT(b.id) AS bookings_count,
      COALESCE(SUM(b.meals_booked), 0) AS meals,
      COALESCE(SUM(b.meals_booked), 0) AS value
    FROM bookings b
    JOIN associations a ON a.id = b.association_id
    ${dateFilter ? dateFilter.replace("WHERE", "WHERE") : ""}
    GROUP BY a.id, a.name
  `
  )
  .all(...params);

  // par resto
const byRestaurant = await db
  .prepare(
    `
    SELECT 
      r.id AS restaurant_id,
      r.name AS restaurant_name,
      COUNT(b.id) AS bookings_count,
      COALESCE(SUM(b.meals_booked), 0) AS meals,
      COALESCE(SUM(b.meals_booked), 0) AS value
    FROM bookings b
    JOIN restaurants r ON r.id = b.restaurant_id
    ${dateFilter ? dateFilter.replace("WHERE", "WHERE") : ""}
    GROUP BY r.id, r.name
  `
  )
  .all(...params);

    // par statut
    const byStatus = await db
      .prepare(
        `
        SELECT status, COUNT(*) as count
        FROM bookings
        ${dateFilter}
        GROUP BY status
      `
      )
      .all(...params);

    // par type
    const byServiceType = await db
      .prepare(
        `
        SELECT service_type, COUNT(*) as count
        FROM bookings
        ${dateFilter}
        GROUP BY service_type
      `
      )
      .all(...params);

    return c.json({
  period,
  total: total?.count ?? 0,
  totalValue: totalValue?.value ?? 0,
  byStatus,
  byServiceType,
  byAssociation,
  byRestaurant,
});

  } catch (err) {
    console.error("ADMIN GET /stats/bookings ERROR:", err);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

// DELETE /admin/associations/:id
// DELETE /admin/associations/:id
adminRouter.delete("/associations/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid id" }, 400);
    }

    const deleted = await associationService.deleteAssociation(id);
    if (!deleted) {
      return c.json({ error: "Association not found" }, 404);
    }

    return c.json({ success: true });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      console.error(
        "ADMIN DELETE /associations/:id FK ERROR (still referenced):",
        err
      );
      return c.json(
        {
          error:
            "Cannot delete association while it has related bookings or users.",
        },
        400
      );
    }

    console.error("ADMIN DELETE /associations/:id ERROR", err);
    return c.json({ error: "Failed to delete association" }, 500);
  }
});



// PATCH /admin/users/:id/link
// Body possible: { associationId, restaurantId }
adminRouter.patch("/users/:id/link", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid user id" }, 400);
    }

    const body = await c.req.json();

    const associationId =
      typeof body.associationId !== "undefined"
        ? Number(body.associationId)
        : undefined;
    const restaurantId =
      typeof body.restaurantId !== "undefined"
        ? Number(body.restaurantId)
        : undefined;

    // build dynamic SQL
    const fields = [];
    const params = [];

    if (typeof associationId !== "undefined") {
      if (Number.isNaN(associationId)) {
        return c.json({ error: "Invalid associationId" }, 400);
      }
      fields.push("association_id = ?");
      params.push(associationId || null);
    }

    if (typeof restaurantId !== "undefined") {
      if (Number.isNaN(restaurantId)) {
        return c.json({ error: "Invalid restaurantId" }, 400);
      }
      fields.push("restaurant_id = ?");
      params.push(restaurantId || null);
    }

    if (fields.length === 0) {
      return c.json({ error: "Nothing to update" }, 400);
    }

    fields.push("updated_at = CURRENT_TIMESTAMP");

    const sql = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = ?
    `;
    params.push(id);

    const result = await db.prepare(sql).run(...params);
    if (result.changes === 0) {
      return c.json({ error: "User not found" }, 404);
    }

    const user = await db
      .prepare(
        "SELECT id, email, role, association_id, restaurant_id FROM users WHERE id = ?"
      )
      .get(id);

    return c.json(user);
  } catch (err) {
    console.error("ADMIN PATCH /users/:id/link ERROR", err);
    return c.json({ error: "Failed to link user" }, 500);
  }
});

// PATCH /admin/users/:id/role
adminRouter.patch("/users/:id/role", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid user id" }, 400);
    }

    const body = await c.req.json();
    const role = String(body.role || "").toUpperCase();

    const allowedRoles = ["ADMIN", "ASSO_AGENT", "RESTO_AGENT"];
    if (!allowedRoles.includes(role)) {
      return c.json({ error: "Invalid role" }, 400);
    }

    const sql = `
      UPDATE users
      SET role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await db.prepare(sql).run(role, id);

    if (result.changes === 0) {
      return c.json({ error: "User not found" }, 404);
    }

    const user = await db
      .prepare(
        "SELECT id, email, name, role, association_id, restaurant_id FROM users WHERE id = ?"
      )
      .get(id);

    return c.json(user);
  } catch (err) {
    console.error("ADMIN PATCH /users/:id/role ERROR", err);
    return c.json({ error: "Failed to update role" }, 500);
  }
});

// DELETE /admin/users/:id
adminRouter.delete("/users/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid user id" }, 400);
    }

    // si FK un jour (bookings.created_by etc.), les nettoyer ici avant le DELETE
    const result = await db
      .prepare("DELETE FROM users WHERE id = ?")
      .run(id);

    if (result.changes === 0) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ success: true });
  } catch (err) {
    console.error("ADMIN DELETE /users/:id ERROR", err);
    return c.json({ error: "Failed to delete user" }, 500);
  }
});





// GET /admin/users
adminRouter.get("/users", async (c) => {
  try {
    const rows = await db
      .prepare(
        "SELECT id, email, name, role, association_id, restaurant_id FROM users ORDER BY id ASC"
      )
      .all();
    return c.json(rows);
  } catch (err) {
    console.error("ADMIN GET /users ERROR", err);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});


// PATCH /admin/users/:id – update role + links
adminRouter.patch("/users/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid user id" }, 400);
    }

    const body = await c.req.json();
    const payload = {};

    // Optional: role change
    if (typeof body.role !== "undefined") {
      const allowedRoles = ["ADMIN", "ASSO_AGENT", "RESTO_AGENT"];
      if (!allowedRoles.includes(body.role)) {
        return c.json({ error: "Invalid role" }, 400);
      }
      payload.role = body.role;
    }

    // Optional: link to association
    if (typeof body.association_id !== "undefined") {
      payload.association_id =
        body.association_id === null ? null : Number(body.association_id);
    }

    // Optional: link to restaurant
    if (typeof body.restaurant_id !== "undefined") {
      const restId =
        body.restaurant_id === null ? null : Number(body.restaurant_id);

      if (restId !== null && Number.isNaN(restId)) {
        return c.json({ error: "Invalid restaurant_id" }, 400);
      }

      // Validate that restaurant exists if not null
      if (restId !== null) {
        const resto = await restaurantService.getRestaurantById(restId);
        if (!resto) {
          return c.json({ error: "Restaurant not found" }, 404);
        }
      }

      payload.restaurant_id = restId;
    }

    if (Object.keys(payload).length === 0) {
      return c.json({ error: "Nothing to update" }, 400);
    }

    const updated = await authService.updateUser(id, payload);
    if (!updated) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(updated);
  } catch (err) {
    console.error("ADMIN PATCH /users/:id ERROR", err);
    return c.json({ error: "Failed to update user" }, 500);
  }
});


export default adminRouter;
