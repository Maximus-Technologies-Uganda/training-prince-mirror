/**
 * Expense Mapper Module
 * Handles bidirectional mapping between API requests/responses and internal data structures.
 * 
 * Key responsibilities:
 * 1. Request mapping: Convert raw API requests to validated expense objects
 * 2. Response formatting: Format expense objects with metadata (IDs, timestamps)
 * 3. Error mapping: Convert validation errors to OpenAPI-compliant error responses
 * 
 * Type conversions:
 * - String amounts are converted to numbers BEFORE validation
 * - This ensures the validator receives consistent types
 * - All error responses follow standardized structure per OpenAPI contract
 */

import { validateExpense } from './validator.js';

/**
 * Maps request body to validated expense object.
 * 
 * Implementation notes:
 * - Type conversion: String amounts converted to numbers BEFORE validation
 *   This is critical because validation checks: typeof amount !== 'number'
 * - Normalizes optional fields: description defaults to empty string
 * - Throws validation errors with field-specific details
 * 
 * @param {Object} req - Express request object or request body
 * @returns {Object} Validated expense object with normalized fields
 * @throws {Error} If request data is invalid (validation error)
 */
export function mapRequestToExpense(req) {
  const body = req.body || req;
  // Critical: Convert amount to number if it's a string
  // This must happen BEFORE validation to ensure validator receives correct type
  let amount = body.amount;
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }

  // Create normalized object for validation
  // Includes all required fields and optional fields with defaults
  const normalizedExpense = {
    date: body.date,
    category: body.category,
    amount,
    description: body.description || ''
  };

  // Validate the expense data
  validateExpense(normalizedExpense);

  // Return mapped object
  return normalizedExpense;
}

/**
 * Formats an expense object as API response
 * @param {Object} expense - Expense object to format
 * @returns {Object} Formatted response object
 */
export function formatExpenseResponse(expense) {
  return {
    id: expense.id || null,
    date: expense.date,
    category: expense.category,
    amount: Number(expense.amount),
    description: expense.description || '',
    createdAt: expense.createdAt || new Date().toISOString()
  };
}

/**
 * Formats an error response matching OpenAPI contract
 * @param {Error} error - Error object
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Error response object
 */
export function formatErrorResponse(error, statusCode = 400) {
  // Map error messages to error codes and details
  const errorMap = {
    'Date is required': {
      code: 'VALIDATION_ERROR',
      field: 'date',
      detail: 'Date is required'
    },
    'Invalid date format. Expected YYYY-MM-DD': {
      code: 'VALIDATION_ERROR',
      field: 'date',
      detail: 'Date must be in YYYY-MM-DD format'
    },
    'Category is required': {
      code: 'VALIDATION_ERROR',
      field: 'category',
      detail: 'Category is required and cannot be empty'
    },
    'Category must be a string': {
      code: 'VALIDATION_ERROR',
      field: 'category',
      detail: 'Category must be a string'
    },
    'Category cannot be empty': {
      code: 'VALIDATION_ERROR',
      field: 'category',
      detail: 'Category is required and cannot be empty'
    },
    'Amount is required': {
      code: 'VALIDATION_ERROR',
      field: 'amount',
      detail: 'Amount is required'
    },
    'Amount must be a number': {
      code: 'VALIDATION_ERROR',
      field: 'amount',
      detail: 'Amount must be a number'
    },
    'Amount must be greater than 0': {
      code: 'VALIDATION_ERROR',
      field: 'amount',
      detail: 'Amount must be a positive number'
    },
    'Month must be a number': {
      code: 'VALIDATION_ERROR',
      field: 'month',
      detail: 'Month must be a number'
    },
    'Invalid month. Must be between 1 and 12': {
      code: 'VALIDATION_ERROR',
      field: 'month',
      detail: 'Month must be between 1 and 12'
    },
    'Expense not found': {
      code: 'NOT_FOUND',
      field: null,
      detail: 'Expense not found'
    }
  };

  const errorInfo = errorMap[error.message] || {
    code: 'UNKNOWN_ERROR',
    field: null,
    detail: error.message
  };

  return {
    statusCode,
    error: {
      code: errorInfo.code,
      message: error.message,
      details: errorInfo.field
        ? { [errorInfo.field]: errorInfo.detail }
        : { general: errorInfo.detail }
    }
  };
}

/**
 * Formats a list of expenses as API response
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Formatted response with list
 */
export function formatListResponse(expenses) {
  return {
    data: expenses.map(formatExpenseResponse),
    count: expenses.length
  };
}

/**
 * Formats summary response
 * @param {number} total - Total amount
 * @param {number} count - Count of expenses
 * @param {Object} filters - Applied filters
 * @returns {Object} Summary response
 */
export function formatSummaryResponse(total, count, filters = {}) {
  return {
    total: Number(total),
    count: count,
    filters: filters,
    currency: 'USD'
  };
}
