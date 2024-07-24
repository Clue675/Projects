const { logger } = require('../utils/logger'); // Use the same logger instance

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = statusCode >= 500 ? 'Internal Server Error' : err.message;
    const errorInfo = {
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        method: req.method,
        path: req.originalUrl,
        statusCode,
    };

    logger.error(`Unhandled Error: ${err.message}`, errorInfo);

    res.status(statusCode).json({
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = { errorHandler };
