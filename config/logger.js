/* eslint-disable import/no-extraneous-dependencies */
const winston = require('winston');
const expressWinston = require('express-winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// Create a standalone logger for manual logging
const logger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: 'app-%DATE%.log',
      dirname: './logs',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Express middleware logger (for automatic HTTP request logging)
const middlewareLogger = expressWinston.logger({
  transports: logger.transports, // reuse the same transports
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  expressFormat: true,
  requestWhitelist: [...expressWinston.requestWhitelist, 'body'],
  responseWhitelist: [...expressWinston.responseWhitelist, 'body'],
});

module.exports = {
  middlewareLogger,
  logger, // Export the manual logger
};
