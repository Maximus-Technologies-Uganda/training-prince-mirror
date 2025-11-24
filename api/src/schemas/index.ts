/**
 * Zod Validation Schemas (T005)
 * 
 * Central location for request/response validation schemas.
 * All schemas derive from data-model.md specification.
 */

import { z } from 'zod';

/**
 * Health Check Response Schema
 * Validates GET /healthz response structure
 */
export const HealthCheckResponseSchema = z.object({
  status: z.string().min(1, 'Status must not be empty'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic version (X.Y.Z)'),
  currentTime: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/Z$/, 'Current time must be ISO 8601 format with UTC (Z) suffix'))
});

/**
 * Temperature Conversion Request Schema
 * Validates POST /convert request body
 */
export const ConversionRequestSchema = z.object({
  value: z.number('Value must be a number'),
  from: z.enum(['C', 'F'], {
    errorMap: () => ({ message: "From unit must be 'C' or 'F'" })
  }),
  to: z.enum(['C', 'F'], {
    errorMap: () => ({ message: "To unit must be 'C' or 'F'" })
  })
});

/**
 * Temperature Conversion Response Schema
 * Validates POST /convert success response (200 OK)
 */
export const ConversionResponseSchema = z.object({
  value: z.number('Value must be a number'),
  unit: z.enum(['C', 'F'], {
    errorMap: () => ({ message: "Unit must be 'C' or 'F'" })
  })
});

/**
 * Validation Error Response Schema
 * Validates POST /convert error response (400 Bad Request)
 */
export const ValidationErrorResponseSchema = z.object({
  error: z.literal('Validation failed'),
  details: z.array(
    z.object({
      code: z.string().optional(),
      path: z.array(z.union([z.string(), z.number()])).optional(),
      message: z.string()
    })
  )
});

/**
 * Expense API Validation Error Response Schema (T007)
 * Format for 400 errors from expense endpoints
 */
export const ExpenseErrorResponseSchema = z.object({
  errors: z.array(
    z.object({
      field: z.string(),
      message: z.string()
    })
  )
});

/**
 * Create Expense Request Schema (T007)
 * Validates POST /expenses request body
 * Requirements: amount > 0, category non-empty string, date YYYY-MM-DD format
 */
export const CreateExpenseSchema = z.object({
  amount: z.number('amount must be a number')
    .positive('amount must be greater than 0'),
  category: z.string('category must be a string')
    .min(1, 'category must not be empty')
    .refine(
      (val) => val.trim().length > 0,
      'category must not be whitespace only'
    ),
  date: z.string('date must be a string')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format')
    .refine(
      (val) => {
        // Validate that the date is an actual calendar date
        const date = new Date(val + 'T00:00:00Z');
        const [year, month, day] = val.split('-').map(Number);
        return date.getUTCFullYear() === year &&
               date.getUTCMonth() === month - 1 &&
               date.getUTCDate() === day;
      },
      (val) => ({
        message: `date must be a valid date (received: ${val})`
      })
    )
});

/**
 * Expense Response Schema (T007)
 * Validates successful POST /expenses response
 */
export const ExpenseResponseSchema = z.object({
  id: z.string().uuid('id must be a valid UUID'),
  amount: z.number(),
  category: z.string(),
  date: z.string()
});

/**
 * Expense Summary Query Schema (T007)
 * Validates GET /expenses/summary query parameters
 */
export const ExpenseSummaryQuerySchema = z.object({
  category: z.string().optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'month must be YYYY-MM format').optional()
}).strict();

/**
 * Expense Summary Response Schema (T007)
 * Validates GET /expenses/summary response
 */
export const ExpenseSummaryResponseSchema = z.object({
  total: z.number().nonnegative(),
  count: z.number().nonnegative().int(),
  filters: z.object({
    category: z.string().optional(),
    month: z.string().optional()
  })
});

/**
 * Pagination Query Schema
 * Validates GET /expenses query parameters (page and pageSize)
 */
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int('page must be an integer')
    .min(1, 'page must be greater than or equal to 1')
    .default(1),
  pageSize: z.coerce.number().int('pageSize must be an integer')
    .min(1, 'pageSize must be at least 1')
    .max(100, 'pageSize must be at most 100')
    .default(20)
}).strict();

