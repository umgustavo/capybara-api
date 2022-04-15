const data = require('../data/errors.json');

function sendError(res, error_code) {
    error_code = error_code.toString().toLowerCase();
    if (!data[error_code]) {
        throw new Error('Error code does not exist');
    }

    const error = data[error_code];

    try {
        return res.status(error.status_code).json({
            error: {
                code: error_code,
                message: error.message,
            },
        });
    } catch {}
}

function sendMiddlewareError(error_code, next) {
    const err = new Error(error_code);
    err.isCustomError = true;
    return next(err);
}

module.exports = { sendError, sendMiddlewareError };
