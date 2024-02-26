import { createLogger, transports, format } from 'winston';

// Create a logger instance
const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
});

export default logger;
