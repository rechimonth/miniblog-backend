// src/server.js
require('dotenv').config();

const app = require('./app');

const PORT = Number(process.env.PORT || 3000);

const ensureDbSchema = require('./middlewares/ensureDb');

(async () => {
  try {
    await ensureDbSchema();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[server] Failed to ensure DB schema', err);
    // Importante: No tumbamos el proceso; dejar que el app responda con 500 ordenado.
    // La inicialización de rutas ya tiene manejador de errores.
  }

  app.listen(PORT, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`MiniBlog API listening on port ${PORT}`);
  });
})();
