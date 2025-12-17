// config/database.js
import Database from "libsql";

const db = new Database("mydb.db");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'ASSO_AGENT', 
  verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255),
  association_id INTEGER,
  restaurant_id INTEGER,                      
  FOREIGN KEY (association_id) REFERENCES associations(id)
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

CREATE TABLE IF NOT EXISTS restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  email TEXT,
  phone TEXT,
  cuisine TEXT,                      
  options TEXT,                      
  min_delay_minutes INTEGER DEFAULT 0, 
  is_closed BOOLEAN DEFAULT 0,         
  closed_until DATETIME  
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  association_id INTEGER NOT NULL,
  restaurant_id INTEGER NOT NULL,
  meals_booked INTEGER NOT NULL,
  booking_date DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  service_type TEXT NOT NULL DEFAULT 'ON_SITE',
  status TEXT NOT NULL DEFAULT 'PENDING',
  beneficiary_id INTEGER,
  beneficiary_first_name TEXT,
  beneficiary_last_name TEXT,
  beneficiary_email TEXT,
  beneficiary_phone TEXT,
  beneficiary_comment TEXT,
  service_datetime TEXT,
  FOREIGN KEY (association_id) REFERENCES associations(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id)
);

CREATE TABLE IF NOT EXISTS beneficiaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  association_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  birth_year INTEGER,
  rgpd_accepted BOOLEAN NOT NULL DEFAULT 0,
  UNIQUE (association_id, email, last_name),
  FOREIGN KEY (association_id) REFERENCES associations(id)
);
`);

export default db;
