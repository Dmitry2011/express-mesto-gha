const { ErrorNotFound } = require('./status');

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ErrorNotFound;
  }
}

module.exports = NotFound;
