import { sign, verify } from "hono/jwt";
import db from "../config/database.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/email.js";
import { decodeToken, generateToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import env from "../config/env.js";

async function deleteUser(userId) {
  console.log("userId:", userId);
  const query = "DELETE FROM users WHERE id = ?";
  const result = db.prepare(query).run(userId);
  return result.changes > 0;
}

async function findUserByEmail(email) {
  const query = "SELECT * FROM users WHERE email = ?";
  const result = await db.prepare(query).get(email);
  return result;
}

async function createUser(data) {
  const query = `
    INSERT INTO users (email, password, name, verified)
    VALUES (?, ?, ?, ?)
  `;
  const values = [data.email, data.password, data.name, 0];
  const result = await db.prepare(query).run(values);
  return await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(result.lastInsertRowid);
}

async function updateUser(userId, data) {
  const setClauses = [];
  const values = [];

  Object.entries(data).forEach(([key, value]) => {
    setClauses.push(`${key} = ?`);
    values.push(value);
  });
  values.push(userId);

  const query = `
    UPDATE users 
    SET ${setClauses.join(", ")}
    WHERE id = ?
  `;

  await db.prepare(query).run(values);
  return await db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
}

// ✅ single, correct register
async function register(data) {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(data.password);
  data.password = hashedPassword;

  // build full name from firstname / lastname coming from frontend
  if (!data.name) {
    const first = data.firstname || "";
    const last = data.lastname || "";
    data.name = `${first} ${last}`.trim();
  }

  const user = await createUser(data);

  await sendVerificationEmail(user.email);

  return user;
}

async function login(email, password) {
  const user = await findUserByEmail(email);
  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  if (!user.verified) throw new Error("user-not-verified");

  return generateToken(user);
}

async function verifyEmail(token) {
  try {
    const decodedToken = await decodeToken(token);
    console.log("decodedToken:", decodedToken);
    if (decodedToken == null) throw new Error("token couldn't be decoded");

    const user = await findUserByEmail(decodedToken.email);
    if (!user) throw new Error("User not found");

    const updatedUser = await updateUser(user.id, { verified: 1 });
    console.log("updatedUser:", updatedUser);
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function forgotPassword(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    return true;
  }

  const resetToken = await sign(
    {
      id: user.id,
      email: user.email,
      type: "password-reset",
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    env.JWT_SECRET
  );

  await updateUser(user.id, {
    reset_token: resetToken,
  });

  await sendPasswordResetEmail(user.email, resetToken);

  return true;
}

async function resetPassword(token, newPassword) {
  const decoded = await verify(token, env.JWT_SECRET);
  if (!decoded) {
    throw new Error("Invalid or expired reset token");
  }

  const user = await findUserByEmail(decoded.email);
  if (!user || user.reset_token !== token) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await hashPassword(newPassword);

  await updateUser(user.id, {
    password: hashedPassword,
    reset_token: null,
  });

  return true;
}

async function sendEmailVerification(email) {
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new Error("User does not exist");
  }

  await sendVerificationEmail(email);
}

export default {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
