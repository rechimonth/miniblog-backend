// src/middlewares/ensureDb.js
const fs = require('fs');

const pool = require('../config/db');

const ensureDbSchema = async () => {
  const setupPath = require('path').join(__dirname, '../../database/setup.sql');
  const sql = fs.readFileSync(setupPath, 'utf8');

  // Ejecuta el SQL (incluye IF NOT EXISTS), así evitamos fallar si ya existe.
  // split simple por ';' preserva compatibilidad con scripts sencillos.
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(`${statement};`);
  }
};

module.exports = ensureDbSchema;

