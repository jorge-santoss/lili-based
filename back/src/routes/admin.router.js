// routes/admin.router.js
import { Hono } from "hono";
// import { json } from "hono/utils";
import associationService from "../services/association.service.js";
import { adminGuard } from "../middlewares/authguard.js";

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

export default adminRouter;
