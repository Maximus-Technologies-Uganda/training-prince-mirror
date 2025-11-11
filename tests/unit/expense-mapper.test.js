import { describe, it, expect } from 'vitest';
import {
  mapRequestToExpense,
  formatExpenseResponse,
  formatErrorResponse,
  formatListResponse,
  formatSummaryResponse
} from '../../src/expense/mapper.js';

/**
 * Test file for expense mapper module.
 * Covers mapping logic for:
 * - Request mapping (raw input to validated object)
 * - Response formatting (validated object to API response)
 * - Error response structure
 * - Edge cases and error handling
 */

describe('expense-mapper', () => {
  describe('mapRequestToExpense', () => {
    it('should map valid request body to expense object', () => {
      const requestBody = {
        date: '2024-11-11',
        category: 'Groceries',
        amount: 45.99,
        description: 'Weekly groceries'
      };

      const result = mapRequestToExpense(requestBody);

      expect(result).toEqual({
        date: '2024-11-11',
        category: 'Groceries',
        amount: 45.99,
        description: 'Weekly groceries'
      });
    });

    it('should handle request without description', () => {
      const requestBody = {
        date: '2024-11-11',
        category: 'Groceries',
        amount: 45.99
      };

      const result = mapRequestToExpense(requestBody);

      expect(result.description).toBe('');
    });

    it('should convert string amount to number', () => {
      const requestBody = {
        date: '2024-11-11',
        category: 'Groceries',
        amount: '45.99'
      };

      const result = mapRequestToExpense(requestBody);

      expect(result.amount).toBe(45.99);
      expect(typeof result.amount).toBe('number');
    });

    it('should throw error for invalid date format', () => {
      const requestBody = {
        date: '2024/11/11',
        category: 'Groceries',
        amount: 45.99
      };

      expect(() => mapRequestToExpense(requestBody)).toThrow('Invalid date format');
    });

    it('should throw error for empty category', () => {
      const requestBody = {
        date: '2024-11-11',
        category: '',
        amount: 45.99
      };

      expect(() => mapRequestToExpense(requestBody)).toThrow('Category cannot be empty');
    });

    it('should throw error for zero amount', () => {
      const requestBody = {
        date: '2024-11-11',
        category: 'Groceries',
        amount: 0
      };

      expect(() => mapRequestToExpense(requestBody)).toThrow('Amount must be greater than 0');
    });

    it('should throw error for missing date', () => {
      const requestBody = {
        category: 'Groceries',
        amount: 45.99
      };

      expect(() => mapRequestToExpense(requestBody)).toThrow('Date is required');
    });

    it('should work with request object (req.body)', () => {
      const req = {
        body: {
          date: '2024-11-11',
          category: 'Groceries',
          amount: 45.99
        }
      };

      const result = mapRequestToExpense(req);

      expect(result.date).toBe('2024-11-11');
      expect(result.category).toBe('Groceries');
      expect(result.amount).toBe(45.99);
    });
  });

  describe('formatExpenseResponse', () => {
    it('should format valid expense as response', () => {
      const expense = {
        id: '123',
        date: '2024-11-11',
        category: 'Groceries',
        amount: 45.99,
        description: 'Weekly shopping',
        createdAt: '2024-11-11T10:00:00Z'
      };

      const result = formatExpenseResponse(expense);

      expect(result).toEqual({
        id: '123',
        date: '2024-11-11',
        category: 'Groceries',
        amount: 45.99,
        description: 'Weekly shopping',
        createdAt: '2024-11-11T10:00:00Z'
      });
    });

    it('should handle expense without id', () => {
      const expense = {
        date: '2024-11-11',
        category: 'Groceries',
        amount: 45.99
      };

      const result = formatExpenseResponse(expense);

      expect(result.id).toBeNull();
    });

    it('should handle expense without createdAt', () => {
      const expense = {
        id: '123',
        date: '2024-11-11',
        category: 'Groceries',
        amount: 45.99
      };

      const result = formatExpenseResponse(expense);

      expect(result.createdAt).toBeDefined();
      expect(typeof result.createdAt).toBe('string');
    });

    it('should convert amount to number', () => {
      const expense = {
        date: '2024-11-11',
        category: 'Groceries',
        amount: '45.99'
      };

      const result = formatExpenseResponse(expense);

      expect(result.amount).toBe(45.99);
      expect(typeof result.amount).toBe('number');
    });

    it('should set default empty description', () => {
      const expense = {
        date: '2024-11-11',
        category: 'Groceries',
        amount: 45.99
      };

      const result = formatExpenseResponse(expense);

      expect(result.description).toBe('');
    });
  });

  describe('formatErrorResponse', () => {
    it('should format validation error response', () => {
      const error = new Error('Amount must be greater than 0');

      const result = formatErrorResponse(error, 400);

      expect(result.error).toBeDefined();
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.message).toBe('Amount must be greater than 0');
      expect(result.error.details).toBeDefined();
      expect(result.error.details.amount).toBe('Amount must be a positive number');
    });

    it('should format category validation error', () => {
      const error = new Error('Category cannot be empty');

      const result = formatErrorResponse(error, 400);

      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.details.category).toBeDefined();
    });

    it('should format date validation error', () => {
      const error = new Error('Invalid date format. Expected YYYY-MM-DD');

      const result = formatErrorResponse(error, 400);

      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.details.date).toBeDefined();
    });

    it('should format month validation error', () => {
      const error = new Error('Invalid month. Must be between 1 and 12');

      const result = formatErrorResponse(error, 400);

      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.details.month).toBeDefined();
    });

    it('should format not found error', () => {
      const error = new Error('Expense not found');

      const result = formatErrorResponse(error, 404);

      expect(result.error.code).toBe('NOT_FOUND');
      expect(result.error.message).toBe('Expense not found');
    });

    it('should handle unknown error type', () => {
      const error = new Error('Unknown error message');

      const result = formatErrorResponse(error, 400);

      expect(result.error.code).toBe('UNKNOWN_ERROR');
      expect(result.error.message).toBe('Unknown error message');
      expect(result.error.details.general).toBeDefined();
    });
  });

  describe('formatListResponse', () => {
    it('should format list of expenses', () => {
      const expenses = [
        {
          id: '1',
          date: '2024-11-11',
          category: 'Groceries',
          amount: 45.99,
          createdAt: '2024-11-11T10:00:00Z'
        },
        {
          id: '2',
          date: '2024-11-10',
          category: 'Transport',
          amount: 5.50,
          createdAt: '2024-11-10T09:00:00Z'
        }
      ];

      const result = formatListResponse(expenses);

      expect(result.data).toHaveLength(2);
      expect(result.count).toBe(2);
      expect(result.data[0].id).toBe('1');
      expect(result.data[1].id).toBe('2');
    });

    it('should handle empty expense list', () => {
      const expenses = [];

      const result = formatListResponse(expenses);

      expect(result.data).toHaveLength(0);
      expect(result.count).toBe(0);
    });

    it('should format each expense in list', () => {
      const expenses = [
        {
          date: '2024-11-11',
          category: 'Groceries',
          amount: 45.99
        }
      ];

      const result = formatListResponse(expenses);

      expect(result.data[0].id).toBeNull();
      expect(result.data[0].description).toBe('');
    });
  });

  describe('formatSummaryResponse', () => {
    it('should format summary response with total and count', () => {
      const result = formatSummaryResponse(100.50, 5, { category: 'Groceries' });

      expect(result.total).toBe(100.50);
      expect(result.count).toBe(5);
      expect(result.filters).toEqual({ category: 'Groceries' });
      expect(result.currency).toBe('USD');
    });

    it('should convert total to number', () => {
      const result = formatSummaryResponse('100.50', 5);

      expect(result.total).toBe(100.50);
      expect(typeof result.total).toBe('number');
    });

    it('should handle summary with no filters', () => {
      const result = formatSummaryResponse(50.00, 3);

      expect(result.filters).toEqual({});
      expect(result.currency).toBe('USD');
    });

    it('should handle zero total', () => {
      const result = formatSummaryResponse(0, 0);

      expect(result.total).toBe(0);
      expect(result.count).toBe(0);
    });

    it('should handle multiple filters', () => {
      const result = formatSummaryResponse(100, 5, {
        category: 'Groceries',
        month: 11,
        year: 2024
      });

      expect(result.filters.category).toBe('Groceries');
      expect(result.filters.month).toBe(11);
      expect(result.filters.year).toBe(2024);
    });
  });
});
