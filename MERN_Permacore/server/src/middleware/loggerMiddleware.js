const loggerMiddleware = (req, res, next) => {
    const startTime = new Date();

    res.on('finish', () => {
        const endTime = new Date();
        const elapsedTime = endTime - startTime;
        const logMessage = `[${startTime.toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${elapsedTime}ms`;

        // Enhanced logging based on response status
        if (res.statusCode >= 500) {
            console.error(`ERROR: ${logMessage}`);
        } else if (res.statusCode >= 400) {
            console.warn(`WARNING: ${logMessage}`);
        } else {
            console.log(logMessage);
        }

        // Conditional logging for query parameters
        if (Object.keys(req.query).length) {
            console.log(`Query: ${sanitizeData(JSON.stringify(req.query))}`);
        }

        // Conditional logging for request body, excluding sensitive routes
        if (req.method !== 'GET' && Object.keys(req.body).length && !isSensitiveRoute(req.path)) {
            console.log(`Body: ${sanitizeData(JSON.stringify(req.body))}`);
        }
    });

    next();
};

// Custom error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(`Unhandled Error: ${err.message}`);
    console.error(err.stack); // Log the stack trace for more detail

    // Determine if it's a known error type or a server error
    const statusCode = err.statusCode || 500;
    const errorMessage = statusCode >= 500 ? 'Internal Server Error' : err.message;

    res.status(statusCode).json({
        message: errorMessage,
        // Include stack trace in development environment only
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

function isSensitiveRoute(path) {
    const sensitiveRoutes = ['/login', '/register', '/api/v1/users'];
    return sensitiveRoutes.some(route => path.startsWith(route));
}

function sanitizeData(data) {
    const fieldsToSanitize = ['password', 'token'];
    fieldsToSanitize.forEach(field => {
        data = data.replace(new RegExp(`"${field}":".*?"`, 'g'), `"${field}":"[REDACTED]"`);
    });
    return data;
}

module.exports = { loggerMiddleware, errorHandler };
