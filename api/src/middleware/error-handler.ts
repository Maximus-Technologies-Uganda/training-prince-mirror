/**
 * Central Error Handling Middleware
 * 
 * Catches all errors during request processing and maps them to the standard
 * ErrorEnvelope format defined in the OpenAPI specification.
 * 
 * Constitutional Principle III: Centralized error handling ensures consistent
 * error responses across all endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Error Envelope interface matching OpenAPI spec
 */
interface ErrorEnvelope {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
    value?: any;
  }> | object;
  requestId?: string;
}

/**
 * Custom error class for business rule violations
 */
export class BusinessRuleError extends Error {
  constructor(
    message: string,
    public details?: object
  ) {
    super(message);
    this.name = 'BusinessRuleError';
  }
}

/**
 * Custom error class for not found errors
 */
export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Extract request-id header from request
 */
function getRequestId(req: Request): string | undefined {
  return req.headers['request-id'] as string | undefined || 
         req.get('request-id') || 
         undefined;
}

/**
 * Map Zod validation errors to ErrorEnvelope format
 */
function mapZodError(error: ZodError, req: Request): ErrorEnvelope {
  const requestId = getRequestId(req);
  
  const details = error.errors.map(err => {
    const field = err.path[0]?.toString() || 'unknown';
    let message = err.message;
    
    // Extract received value for more descriptive error messages
    if (err.code === 'invalid_string' || message.includes('format')) {
      const receivedValue = err.path.length > 0 
        ? (req.body?.[field] ?? req.query?.[field])
        : undefined;
      if (receivedValue !== undefined && !message.includes('received:')) {
        message = `${message} (received: ${receivedValue})`;
      }
    }
    
    return {
      field,
      message,
      value: err.path.length > 0 
        ? (req.body?.[field] ?? req.query?.[field])
        : undefined
    };
  });
  
  return {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details,
    ...(requestId && { requestId })
  };
}

/**
 * Central error handling middleware
 * 
 * Must be registered after all routes (Express error middleware pattern).
 * Catches all errors and maps them to ErrorEnvelope format.
 */
export function errorHandler(
  err: Error | ZodError | BusinessRuleError | NotFoundError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = getRequestId(req);
  
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errorEnvelope = mapZodError(err, req);
    res.status(400).json(errorEnvelope);
    return;
  }
  
  // Handle business rule violations
  if (err instanceof BusinessRuleError) {
    const errorEnvelope: ErrorEnvelope = {
      code: 'BUSINESS_RULE_VIOLATION',
      message: err.message,
      ...(err.details && { details: err.details }),
      ...(requestId && { requestId })
    };
    res.status(422).json(errorEnvelope);
    return;
  }
  
  // Handle not found errors
  if (err instanceof NotFoundError) {
    const errorEnvelope: ErrorEnvelope = {
      code: 'NOT_FOUND',
      message: err.message,
      ...(requestId && { requestId })
    };
    res.status(404).json(errorEnvelope);
    return;
  }
  
  // Handle rate limiting errors (if rate limiter throws errors)
  if (err.name === 'RateLimitError' || err.message.includes('rate limit')) {
    const errorEnvelope: ErrorEnvelope = {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Rate limit exceeded',
      ...(requestId && { requestId })
    };
    res.status(429).json(errorEnvelope);
    return;
  }
  
  // Handle all other errors (server errors)
  // Do not expose internal error details (stack traces, etc.)
  const errorEnvelope: ErrorEnvelope = {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    ...(requestId && { requestId })
  };
  
  // Log error for debugging (server-side only)
  console.error('Internal server error:', err);
  
  res.status(500).json(errorEnvelope);
}

