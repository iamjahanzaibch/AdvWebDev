// src/db/pool.js
import pg from "pg";

const { Pool } = pg;

// Pool automatically reads from environment variables:
// PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
const pool = new Pool({
  // Explicitly ensure database is set from environment
  database: process.env.PGDATABASE || "booking_db",
});

export default pool;
