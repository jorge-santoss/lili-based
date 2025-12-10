import { Hono } from "hono";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";
import authRouter from "./auth.router.js";
import { verify } from "hono/jwt";
import authService from "../services/auth.service.js";
import env from "../config/env.js";
import { authGuard } from "../middlewares/authguard.js";
import adminRouter from "./admin.router.js";
import assoRouter from "./asso.router.js";



const app = new Hono();

// CORS for all routes
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (c) => c.text("Hello from Hono!"));

// Auth routes => /api/...
app.route("/api", authRouter);

// Admin routes => /admin/...
app.route("/admin", adminRouter);

// Asso routes => /api/asso/...
app.route("/api/asso", assoRouter);          // <--- add this

app.get("/authenticated", authGuard(), (c) => {
  const user = c.get("user");
  return c.text("Authenticated route, hi " + user.email);
});

export default app;