// src/server.js
require('dotenv').config();

const app = require('./app');

const PORT = Number(process.env.PORT || 3000 );


const ensureDbSchema = require('./middlewares/ensureDb');

(async () => {
  // eslint-disable-next-line no-console
  console.log('[server] boot: starting schema ensure');
  try {
    await ensureDbSchema();
    // eslint-disable-next-line no-console
    console.log('[server] boot: schema ensure finished');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[server] Failed to ensure DB schema', err);
  }

  // eslint-disable-next-line no-console
  console.log('[server] boot: starting listener');

  app.listen(PORT, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`MiniBlog API listening on port ${PORT}`);
  });
})();
