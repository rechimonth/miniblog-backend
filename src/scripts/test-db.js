const pool = require('../config/db');

(async () => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    // eslint-disable-next-line no-console
    console.log('DB connection OK:', result.rows?.[0]?.now);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('DB connection ERROR:', err);
  } finally {
    try {
      await pool.end();
    } catch (_) {
      // ignore
    }
  }
})();

