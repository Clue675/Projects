class OperationalError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    console.error(`Error: ${err.status} | Code: ${err.statusCode} | Message: ${err.message}`);

    // Detect if it's an operational error
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Unknown error: Log it and send a generic message
        const statusCode = err.statusCode || 500;
        const message = process.env.NODE_ENV === 'development' ? `Unknown Error: ${err.message}` : 'Internal Server Error';
        
        // In development, log stack for debugging; in production, consider sending this to an error reporting service
        if (process.env.NODE_ENV === 'development') {
            console.error(err.stack);
        } else {
            // Example: Log to external service
            // externalErrorLoggingService.log(err);
        }

        return res.status(statusCode).json({
            status: 'error',
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }
};

module.exports = {
    errorHandler,
    OperationalError,
};
