import { Hono } from "hono";
import { adminGuard } from "../middlewares/authguard.js";
import restaurantService from "../services/restaurant.service.js";

const adminRestaurantsRouter = new Hono();

adminRestaurantsRouter.use("*", adminGuard());

// GET /admin/restaurants
adminRestaurantsRouter.get("/", async (c) => {
  try {
    const rows = await restaurantService.getAllRestaurants();
    return c.json(rows);
  } catch (err) {
    console.error("ADMIN /restaurants ERROR:", err);
    return c.json({ error: "Failed to fetch restaurants" }, 500);
  }
});

// GET /admin/restaurants/:id
adminRestaurantsRouter.get("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid id" }, 400);
    }

    const restaurant = await restaurantService.getRestaurantWithAssociation(id);

    if (!restaurant) {
      return c.json({ error: "Restaurant not found" }, 404);
    }

    return c.json(restaurant);
  } catch (err) {
    console.error("ADMIN GET /restaurants/:id ERROR:", err);
    return c.json({ error: "Failed to fetch restaurant" }, 500);
  }
});

// POST /admin/restaurants
adminRestaurantsRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { name, address, email, phone } = body;
    if (!name) return c.json({ error: "Name is required" }, 400);

    const restaurant = await restaurantService.createRestaurant({
      name,
      address,
      email,
      phone,
    });

    return c.json(restaurant, 201);
  } catch (err) {
    console.error("ADMIN POST /restaurants ERROR:", err);
    return c.json({ error: "Failed to create restaurant" }, 500);
  }
});

// PATCH /admin/restaurants/:id
adminRestaurantsRouter.patch("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid id" }, 400);
    }

    const body = await c.req.json();
    const payload = {
      name: body.name,
      address: body.address,
      email: body.email,
      phone: body.phone,
    };

    const updated = await restaurantService.updateRestaurant(id, payload);
    if (!updated) {
      return c.json({ error: "Restaurant not found" }, 404);
    }

    return c.json(updated);
  } catch (err) {
    console.error("ADMIN PATCH /restaurants/:id ERROR:", err);
    return c.json({ error: "Failed to update restaurant" }, 500);
  }
});

// DELETE /admin/restaurants/:id
adminRestaurantsRouter.delete("/:id", async (c) => {
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
    console.error("ADMIN DELETE /restaurants/:id ERROR:", err);
    return c.json({ error: "Failed to delete restaurant" }, 500);
  }
});

export default adminRestaurantsRouter;
