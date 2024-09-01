// errorHandler.js

function errorHandler(err, req, res, next) {
    // Default status code and message for unhandled errors
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Enhance error object with request info
    const errorDetails = {
        method: req.method,
        path: req.url,
        message: message,
        // Include stack trace in development environment for detailed error location
        stack: process.env.NODE_ENV === 'development' ? err.stack : 'Stack trace hidden in production'
    };

    // Log error details
    console.error(`[Error] ${req.method} ${req.url} => Status: ${statusCode}, Message: ${message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(`Stack Trace: ${errorDetails.stack}`);
    }

    // Conditional response detail based on environment
    let responseDetail = process.env.NODE_ENV === 'development' ? { error: message, details: errorDetails } : { error: message };

    // Send error response to the client
    res.status(statusCode).json(responseDetail);
}

module.exports = errorHandler;
