// middleware/authguard.js
import { verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import env from "../config/env.js";
import authService from "../services/auth.service.js";
import { decodeToken } from "../utils/jwt.js";

export function authGuard() {
  return createMiddleware(async (c, next) => {
    const [prefix, token] =
      c.req.header("Authorization")?.split(" ") || [null, undefined];

    if (prefix !== "Bearer" || !token) {
      return c.json(
        { error: "You must be authenticated to access this resource" },
        401
      );
    }

    try {
      const decoded = await verify(token, env.JWT_SECRET);
      if (!decoded) {
        return c.json({ error: "Invalid payload" }, 401);
      }

      const user = await authService.findUserByEmail(decoded.email);
      if (!user) {
        return c.json(
          {
            error:
              "Permission denied, you are not authorized to access this resource",
          },
          401
        );
      }

      c.set("user", user);
      await next();
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 401);
    }
  });
}

export function adminGuard() {
  return createMiddleware(async (c, next) => {
    const [prefix, token] =
      c.req.header("Authorization")?.split(" ") || [null, undefined];

    if (prefix !== "Bearer" || !token) {
      return c.json(
        { error: "You must be authenticated to access this resource" },
        401
      );
    }

    try {
      const decoded =
        typeof decodeToken === "function"
          ? await decodeToken(token)
          : await verify(token, env.JWT_SECRET);

      if (!decoded) {
        return c.json({ error: "Invalid token" }, 401);
      }

      // If role is inside the token, prefer that
      if (decoded.role === "ADMIN") {
        const user = await authService.findUserByEmail(decoded.email);
        if (user) c.set("user", user);
        await next();
        return;
      }

      // Fallback: check DB role
      const user = await authService.findUserByEmail(decoded.email);
      if (!user) return c.json({ error: "Permission denied" }, 403);
      if (user.role === "ADMIN") {
        c.set("user", user);
        await next();
        return;
      }

      return c.json({ error: "Forbidden: admin only" }, 403);
    } catch (err) {
      console.error(err);
      return c.json({ error: "Internal server error" }, 401);
    }
  });
}
