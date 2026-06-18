// src/middlewares/ensureDb.js
const fs = require('fs');
const path = require('path');

const pool = require('../config/db');

const ensureDbSchema = async () => {
  // eslint-disable-next-line no-console
  console.log('[ensureDb] starting');

  const setupPath = path.join(__dirname, '../../database/setup.sql');
  // eslint-disable-next-line no-console
  console.log('[ensureDb] reading SQL:', setupPath);

  const sql = fs.readFileSync(setupPath, 'utf8');

  // eslint-disable-next-line no-console
  console.log('[ensureDb] SQL loaded, size:', sql.length);

  // Ejecuta el SQL (incluye IF NOT EXISTS), así evitamos fallar si ya existe.
  // split simple por ';' preserva compatibilidad con scripts sencillos.
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  // eslint-disable-next-line no-console
  console.log('[ensureDb] statements:', statements.length);

  // Nota: NO cerramos pool aquí; el proceso necesita pool para las requests.
  // Solo ejecutamos queries de inicialización.
  for (const [idx, statement] of statements.entries()) {
    // eslint-disable-next-line no-console
    console.log(`[ensureDb] running statement ${idx + 1}/${statements.length}`);
    await pool.query(`${statement};`);
  }

  // eslint-disable-next-line no-console
  console.log('[ensureDb] finished');
};

module.exports = ensureDbSchema;


