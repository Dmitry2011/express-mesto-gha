const { ErrorValid } = require('./status');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ErrorValid;
  }
}

module.exports = BadRequestError;
