// config/database.js
import Database from "libsql";

const db = new Database("mydb.db");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'ASSO_AGENT', -- or another sensible default
  verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS associations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  email TEXT,
  phone TEXT,
  contact_name TEXT,
  meals_available INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
`);

export default db;
