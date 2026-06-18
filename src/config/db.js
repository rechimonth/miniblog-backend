// src/config/db.js
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

// Prefer Railway-style DB_* env vars, but keep PG* fallbacks for compatibility.
const DB_ENV = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const PG_ENV = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
};

const chosen = {
  host: DB_ENV.host || PG_ENV.host,
  port: DB_ENV.port || PG_ENV.port || 5432,
  database: DB_ENV.database || PG_ENV.database,
  user: DB_ENV.user || PG_ENV.user,
  password: DB_ENV.password || PG_ENV.password,
};

const missing = [];
if (!chosen.host) missing.push('DB_HOST/PGHOST');
if (!chosen.database) missing.push('DB_NAME/PGDATABASE');
if (!chosen.user) missing.push('DB_USER/PGUSER');
if (!chosen.password) missing.push('DB_PASSWORD/PGPASSWORD');

if (missing.length > 0) {
  // Mantener el comportamiento tolerante para que Jest pueda correr incluso si NO hay DB.
  // Las pruebas de integración reales fallarán con un error de conexión claro.
  // eslint-disable-next-line no-console
  console.warn(`[db] Missing env vars: ${missing.join(', ')}`);
}

const pool = new Pool({
  host: chosen.host,
  port: Number(chosen.port),
  database: chosen.database,
  user: chosen.user,
  password: chosen.password,
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
