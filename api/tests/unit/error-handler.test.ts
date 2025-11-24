/**
 * Unit Tests for Error Handler Middleware
 * 
 * Tests central error handling middleware that maps errors to ErrorEnvelope format.
 * Verifies all error types are handled correctly with appropriate status codes.
 */

import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { errorHandler, BusinessRuleError, NotFoundError } from '../../src/middleware/error-handler.js';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      get: vi.fn()
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    mockNext = vi.fn();
  });

  describe('Zod Validation Errors (400 Bad Request)', () => {
    it('should handle ZodError and return 400 with ErrorEnvelope', () => {
      const schema = z.object({
        amount: z.number().positive()
      });
      const result = schema.safeParse({ amount: -10 });
      const zodError = result.success ? null : result.error;

      if (zodError) {
        errorHandler(zodError, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: expect.arrayContaining([
              expect.objectContaining({
                field: 'amount',
                message: expect.any(String)
              })
            ])
          })
        );
      }
    });

    it('should include invalid values in error details', () => {
      mockRequest.body = { amount: -10 };
      const schema = z.object({
        amount: z.number().positive()
      });
      const result = schema.safeParse(mockRequest.body);
      const zodError = result.success ? null : result.error;

      if (zodError) {
        errorHandler(zodError, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.json).toHaveBeenCalledWith(
          expect.objectContaining({
            details: expect.arrayContaining([
              expect.objectContaining({
                field: 'amount',
                value: -10
              })
            ])
          })
        );
      }
    });

    it('should include request-id header in error response', () => {
      mockRequest.headers = { 'request-id': 'test-request-id-123' };
      const schema = z.object({
        page: z.number().min(1)
      });
      const result = schema.safeParse({ page: 0 });
      const zodError = result.success ? null : result.error;

      if (zodError) {
        errorHandler(zodError, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.json).toHaveBeenCalledWith(
          expect.objectContaining({
            requestId: 'test-request-id-123'
          })
        );
      }
    });

    it('should handle multiple validation errors', () => {
      mockRequest.body = { amount: -10, date: 'invalid' };
      const schema = z.object({
        amount: z.number().positive(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
      });
      const result = schema.safeParse(mockRequest.body);
      const zodError = result.success ? null : result.error;

      if (zodError) {
        errorHandler(zodError, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.json).toHaveBeenCalledWith(
          expect.objectContaining({
            details: expect.arrayContaining([
              expect.objectContaining({ field: 'amount' }),
              expect.objectContaining({ field: 'date' })
            ])
          })
        );
      }
    });
  });

  describe('Business Rule Errors (422 Unprocessable Entity)', () => {
    it('should handle BusinessRuleError and return 422', () => {
      const error = new BusinessRuleError('Expense date cannot be in the future', {
        reason: 'Date validation failed'
      });

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'BUSINESS_RULE_VIOLATION',
        message: 'Expense date cannot be in the future',
        details: { reason: 'Date validation failed' }
      });
    });

    it('should include request-id in business rule error response', () => {
      mockRequest.headers = { 'request-id': 'test-123' };
      const error = new BusinessRuleError('Invalid business rule');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: 'test-123'
        })
      );
    });
  });

  describe('Not Found Errors (404 Not Found)', () => {
    it('should handle NotFoundError and return 404', () => {
      const error = new NotFoundError('Expense not found');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'NOT_FOUND',
        message: 'Expense not found'
      });
    });

    it('should use default message when not provided', () => {
      const error = new NotFoundError();

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Resource not found'
        })
      );
    });
  });

  describe('Rate Limiting Errors (429 Too Many Requests)', () => {
    it('should handle rate limit errors and return 429', () => {
      const error = new Error('rate limit exceeded');
      error.name = 'RateLimitError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Rate limit exceeded'
        })
      );
    });

    it('should detect rate limit errors by message', () => {
      const error = new Error('Too many requests - rate limit');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(429);
    });
  });

  describe('Server Errors (500 Internal Server Error)', () => {
    it('should handle generic errors and return 500', () => {
      const error = new Error('Unexpected server error');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      });
      expect(consoleSpy).toHaveBeenCalledWith('Internal server error:', error);

      consoleSpy.mockRestore();
    });

    it('should not expose internal error details', () => {
      const error = new Error('Database connection failed');
      error.stack = 'Error: Database connection failed\n    at ...';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        })
      );
      // Should not include stack trace or internal details
      const callArgs = (mockResponse.json as any).mock.calls[0][0];
      expect(callArgs).not.toHaveProperty('stack');
      expect(callArgs.message).not.toContain('Database');
    });

    it('should include request-id in server error response', () => {
      mockRequest.headers = { 'request-id': 'error-123' };
      const error = new Error('Server error');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: 'error-123'
        })
      );
    });
  });

  describe('Request-ID Header Extraction', () => {
    it('should extract request-id from headers object', () => {
      mockRequest.headers = { 'request-id': 'header-value' };
      const error = new Error('Test error');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: 'header-value'
        })
      );
    });

    it('should extract request-id using get() method if headers missing', () => {
      mockRequest.headers = {};
      (mockRequest.get as any) = vi.fn().mockReturnValue('get-value');
      const error = new Error('Test error');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('request-id');
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: 'get-value'
        })
      );
    });

    it('should omit requestId if not provided', () => {
      mockRequest.headers = {};
      (mockRequest.get as any) = vi.fn().mockReturnValue(undefined);
      const error = new Error('Test error');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      const callArgs = (mockResponse.json as any).mock.calls[0][0];
      expect(callArgs).not.toHaveProperty('requestId');
    });
  });
});

