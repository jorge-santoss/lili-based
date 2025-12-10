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

export default adminRestaurantsRouter;
