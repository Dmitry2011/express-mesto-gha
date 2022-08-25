const { ErrorConflict } = require('./status');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ErrorConflict;
  }
}

module.exports = ConflictError;
