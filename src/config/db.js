// src/config/db.js
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const requiredEnv = ['PGHOST', 'PGPORT', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // Mantener el comportamiento tolerante para que Jest pueda correr incluso si NO hay DB.
  // Las pruebas de integración reales fallarán con un error de conexión claro.
  // eslint-disable-next-line no-console
  console.warn(`[db] Missing env vars: ${missing.join(', ')}`);
}

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: Number(process.env.PG_POOL_MAX || 10),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS || 30000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT_MS || 15000),

  // Railway postgres-ssl requires SSL.
  // Using rejectUnauthorized:false because Railway manages certs internally.
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
