// Import winston for logging
import winston from 'winston';

// Create a logger instance with specified settings
const logger = winston.createLogger({
  // Set the logging level from environment variable or default to 'info'
  level: process.env.LOG_LEVEL || 'info',
  // Define the logging format
  format: winston.format.combine(
    (winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json())
  ),
  // Define default metadata for logs
  defaultMeta: { service: 'acquisitions-api' },
  // Define transports for logging output
  transports: [
    new winston.transports.File({ filename: 'logs/error.lg', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If not in production, add console transport for easier debugging
if (process.env.NODE_ENV !== 'production') {
  // Add console transport with colorized output
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Export the logger for use in other parts of the application
export default logger;
