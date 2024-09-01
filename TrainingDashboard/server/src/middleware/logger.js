function logger(req, res, next) {
    const start = new Date();
    const originalSend = res.send;
    let loggedBody = false; // Flag to indicate if the body has been logged

    // Function to redact sensitive information from request body
    function redactSensitiveInfo(body) {
        const redactedBody = { ...body };
        // List of fields to redact
        const sensitiveFields = ['password', 'secret'];

        sensitiveFields.forEach(field => {
            if (redactedBody[field]) {
                redactedBody[field] = '[REDACTED]';
            }
        });

        return redactedBody;
    }

    // Capture and log request body for specific routes
    if (['/api/login', '/api/register'].includes(req.originalUrl)) {
        console.log(`${new Date().toISOString()} - Request Body:`, JSON.stringify(redactSensitiveInfo(req.body)));
        loggedBody = true;
    }

    // Intercept response send method to log response body
    res.send = function (data) {
        originalSend.apply(res, arguments);
        if (!loggedBody && res.statusCode >= 400) { // Only log on errors if request body wasn't already logged
            console.log(`${new Date().toISOString()} - Response Body:`, data);
            logError(`${new Date().toISOString()} - Response Body: ${data}`); // Log error with details
        }
    };

    // Function to log details after the response is sent
    function logDetails() {
        const duration = new Date() - start;
        let log = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`;

        if (req.ip) {
            log += ` - IP: ${req.ip}`;
        }

        console.log(log);
        logError(log); // Log error with details
    }

    // Listen for the 'finish' event on response, which indicates that the response has been sent
    res.on('finish', logDetails);

    // Proceed to the next middleware or route handler
    next();
}

// logger.js

const fs = require('fs');

function logError(errorLog) {
    fs.appendFile('error.log', errorLog + '\n', (error) => {
        if (error) {
            console.error('Failed to write error to log:', error);
        }
    });
}

module.exports = logger;
