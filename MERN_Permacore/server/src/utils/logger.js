const winston = require('winston');
const { combine, timestamp, printf, colorize, errors } = winston.format;


// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// Create a Winston logger
const logger = winston.createLogger({
    level: 'info', // Minimum level of logs to record
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // Log stack trace if available
        logFormat
    ),
    transports: [
        // Console transport for logging to the console
        new winston.transports.Console(),
        // File transport for logging to a file
        new winston.transports.File({ 
            filename: 'error.log', 
            level: 'error' // Log only errors to this file
        }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

module.exports = logger;
