/**
 * Rate Limit Middleware (T009)
 * 
 * Implements rate limiting for POST routes using express-rate-limit.
 * Enforces 100 requests per 15-minute sliding window per client IP.
 * GET routes are exempt from rate limiting.
 * 
 * Features:
 * - Independent quota per endpoint (separate counters for /convert and /expenses)
 * - Accurate Retry-After header calculation
 * - Logging on rate limit rejection
 * - X-RateLimit-* headers for client transparency
 * - Support for proxy trust configuration
 */

import rateLimit, { MemoryStore, ipKeyGenerator } from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Create rate limiter middleware instance
 * 
 * Configuration:
 * - windowMs: 15 minutes (900,000 ms) - sliding window duration
 * - max: 100 - maximum requests per window
 * - skip: Skip GET requests (only rate limit POST)
 * - keyGenerator: Identify clients by IP address + endpoint for independent quotas
 * - handler: Custom response for 429 errors
 */
export const createRateLimiter = () => {
  return rateLimit({
    // 15-minute sliding window
    windowMs: 15 * 60 * 1000,
    
    // Maximum 100 requests per window
    max: 100,
    
    // Skip GET requests - only rate limit POST
    skip: (req: Request) => req.method !== 'POST',
    
    // Store: Use in-memory store
    store: new MemoryStore(),
    
    // Identify clients by IP address + endpoint (respects trust proxy setting)
    // This ensures independent quotas per endpoint
    keyGenerator: (req: Request) => {
      // Use express-rate-limit's ipKeyGenerator helper for IPv6 safety
      const ipKey = ipKeyGenerator(req);
      const endpoint = req.path || req.originalUrl;
      return `${ipKey}:${endpoint}`;
    },
    
    // Custom handler for rate limit exceeded
    handler: (req: Request, res: Response) => {
      // Calculate seconds remaining until window resets
      // express-rate-limit stores resetTime in req.rateLimit
      const resetTime = (req as any).rateLimit?.resetTime;
      const now = Date.now();
      const secondsRemaining = resetTime ? Math.ceil((resetTime - now) / 1000) : 900;

      // Log rate limit rejection
      console.info(`Rate limit exceeded: ip=${req.ip} endpoint=${req.originalUrl} timestamp=${new Date().toISOString()}`);

      // Send 429 response with rate limit information
      res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded for this endpoint. Retry after ${secondsRemaining} seconds.`,
        retryAfter: secondsRemaining
      });
    },

    // Include rate limit info in response headers
    standardHeaders: true,
    
    // Also include legacy headers for backward compatibility
    legacyHeaders: true,
  });
};

/**
 * Export pre-configured rate limiter instance
 * Can be used directly in route registration
 */
export const rateLimiter = createRateLimiter();

export default rateLimiter;

