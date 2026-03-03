class AppError extends Error {
  constructor(message, statusCode, type) {
    super(message);
    this.statusCode = statusCode || 500;
    this.type = type || 'ServerError';
  }
}

class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400, 'ValidationError');
    this.details = details || {};
  }
}

class AuthError extends AppError {
  constructor(message) {
    super(message || 'Unauthorized', 401, 'AuthError');
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Not found', 404, 'NotFoundError');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'ConflictError');
  }
}

module.exports = { AppError, ValidationError, AuthError, NotFoundError, ConflictError };
