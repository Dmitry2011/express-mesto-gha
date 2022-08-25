const { ErrorForbidden } = require('./status');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ErrorForbidden;
  }
}

module.exports = ForbiddenError;
