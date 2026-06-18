// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('[errorHandler]', err);

  // PostgreSQL unique violation
  // https://www.postgresql.org/docs/current/errcodes-appendix.html
  if (err && err.code === '23505') {
    return res.status(409).json({
      error: 'Email already exists',
    });
  }


  const statusCode = err.statusCode || err.status || 500;


  const message =
    err && typeof err.message === 'string'
      ? err.message
      : 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
    },
  });
};

module.exports = errorHandler;
