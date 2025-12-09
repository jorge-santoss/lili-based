import { sign, verify } from "hono/jwt";
import env from "../config/env.js";

async function generateToken(user) {
  const accessToken = await sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role, // important for adminGuard
      exp: Math.floor(Date.now() / 1000) + 60 * env.JWT_EXPIRES_IN,
    },
    env.JWT_SECRET
  );

  // Generate refresh token
  const refreshToken = await sign(
    {
      userId: user.id,

      tokenType: 'refresh',
      exp: Math.floor(Date.now() / 1000) + 60 * env.JWT_EXPIRES_IN
    },
    env.JWT_SECRET,
  )

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Converts time string (e.g., '24h', '7d') to seconds
 * @param time Time string in format like '24h', '7d', '60m'
 * @returns number of seconds
 */
function parseTimeToSeconds(time) {
  const unit = time.slice(-1);
  const value = parseInt(time.slice(0, -1));

  switch (unit) {
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 24 * 60 * 60;
    case "m":
      return value * 60;
    case "s":
      return value;
    default:
      return 24 * 60 * 60; // default 24 hours
  }
}

/**
 * Decodes and verifies a JWT token
 * @param token The JWT token to decode
 * @returns The decoded token payload or null if invalid
 */
async function decodeToken(token) {
  try {
    const decoded = (await verify(token, env.JWT_SECRET));
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;

  }
}

export { generateToken, decodeToken };
