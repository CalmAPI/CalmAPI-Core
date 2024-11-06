/**
 * Custom error classes
 */
class BaseError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends BaseError {
    constructor(message = 'Not found') {
        super(message, 404);
    }
}

class ValidationError extends BaseError {
    constructor(message = 'Validation failed') {
        super(message, 400);
    }
}

module.exports = {
    BaseError,
    NotFoundError,
    ValidationError
};