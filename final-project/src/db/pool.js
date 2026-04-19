// src/db/pool.js
import pg from "pg";

const { Pool } = pg;

// Pool automatically reads from environment variables:
// PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
const pool = new Pool({});

export default pool;
