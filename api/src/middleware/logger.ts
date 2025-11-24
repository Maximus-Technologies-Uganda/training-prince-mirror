/**
 * Structured Logging Middleware
 * 
 * Pino-based structured logging middleware for request tracking.
 */

import pino from 'pino';
import pinoHttp from 'pino-http';

// Create pino logger instance
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  } : undefined
});

/**
 * HTTP request logging middleware
 * Logs all incoming requests with request ID tracking
 */
export const loggerMiddleware = pinoHttp({
  logger,
  genReqId: (req) => {
    // Use existing request ID or generate new one
    return (req.headers['x-request-id'] as string) || 
           `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
  customLogLevel: (req, res) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500) {
      return 'error';
    }
    return 'info';
  }
});

// Export logger instance for use in other modules
export { logger };