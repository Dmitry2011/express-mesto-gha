const { ErrorAuth } = require('./status');

class AuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ErrorAuth;
  }
}

module.exports = AuthorizedError;
