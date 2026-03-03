function validate(schema, source) {
  source = source || 'body';
  return function(req, res, next) {
    var result = schema.safeParse(req[source]);
    if (!result.success) {
      var errors = result.error.issues.map(function(i) {
        return { path: i.path.join('.'), message: i.message };
      });
      return res.status(400).json({
        ok: false,
        error: 'ValidationError',
        message: 'Invalid input',
        details: errors,
      });
    }
    req.validated = result.data;
    next();
  };
}

module.exports = { validate };
