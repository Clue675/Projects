const winston = require('winston');
const path = require('path');

// Define custom levels if needed
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'grey'
  }
};

// Apply the colors to winston
winston.addColors(customLevels.colors);

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => {
    let formattedMessage = `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    if (info.meta) {
      formattedMessage += ` - ${JSON.stringify(info.meta)}`;
    }
    return formattedMessage;
  })
);

// Define transports based on the environment
const transports = [];
if (process.env.NODE_ENV !== 'production') {
  // Console transport for development
  transports.push(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    ),
    level: 'debug' // More verbose log level for development
  }));
} else {
  // File transport for errors in production
  transports.push(new winston.transports.File({
    filename: path.join(__dirname, 'logs/error.log'),
    level: 'error',
    format: logFormat
  }));
  // Combined log file with lower severity messages
  transports.push(new winston.transports.File({
    filename: path.join(__dirname, 'logs/combined.log'),
    level: 'info',
    format: logFormat
  }));
}

const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: transports,
  exitOnError: false, // Do not exit on handled exceptions
});

module.exports = logger;
