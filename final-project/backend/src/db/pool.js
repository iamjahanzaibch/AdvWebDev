// src/db/pool.js
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  database: process.env.PGDATABASE || "booking_db",
});

export default pool;
