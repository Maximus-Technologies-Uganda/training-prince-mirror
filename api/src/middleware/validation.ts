/**
 * Request Validation Middleware (T006)
 * 
 * Zod-based request validation middleware for type-safe request handling.
 * Catches Zod validation errors and returns HTTP 400 with error details.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Middleware factory that validates request body against a Zod schema (T006)
 * 
 * @param schema - Zod schema to validate against
 * @returns Express middleware function that validates req.body
 * 
 * On validation error, returns HTTP 400 with format:
 * { error: "Validation failed", details: [...] }
 */
export const validateBody = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.error.errors.map(err => ({
            code: err.code,
            path: err.path,
            message: err.message
          }))
        });
      }
      
      // Replace req.body with validated data
      req.body = result.data;
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

/**
 * Middleware factory for expense validation (T008)
 * Throws ZodError for error middleware to catch and format as ErrorEnvelope
 * 
 * @param schema - Zod schema to validate against
 * @returns Express middleware function that validates req.body
 */
export const validateExpenseBody = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      // Throw ZodError for error middleware to catch
      return next(result.error);
    }
    
    // Replace req.body with validated data
    req.body = result.data;
    next();
  };
};

/**
 * Middleware factory for query parameter validation
 * Throws ZodError for error middleware to catch and format as ErrorEnvelope
 * 
 * @param schema - Zod schema to validate against
 * @returns Express middleware function that validates req.query
 */
export const validateQuery = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    
    if (!result.success) {
      // Throw ZodError for error middleware to catch
      return next(result.error);
    }
    
    // Replace req.query with validated data
    req.query = result.data as any;
    next();
  };
};

/**
 * Legacy export for backwards compatibility
 */
export const validateRequest = validateBody;