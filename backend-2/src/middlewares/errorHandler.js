function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const type = err.type || 'ServerError';

  if (statusCode >= 500) {
    console.error('[ERROR]', err.message, err.stack);
  }

  res.status(statusCode).json({
    ok: false,
    error: type,
    message: err.message || 'Internal server error',
    details: err.details || undefined,
  });
}

module.exports = { errorHandler };
