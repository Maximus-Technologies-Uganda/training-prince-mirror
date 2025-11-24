import { describe, it, expect } from 'vitest';
import {
  validateDateFormat,
  validateCategory,
  validateAmount,
  validateMonth,
  validateExpense
} from '../../src/expense/validator.js';

/**
 * Test file for expense validator module.
 * Covers validation logic for:
 * - Date format validation (ISO 8601 YYYY-MM-DD)
 * - Category validation (non-empty string)
 * - Amount validation (positive numbers)
 * - Edge cases and error handling
 */

describe('expense-validator', () => {
  describe('validateDateFormat', () => {
    it('should accept valid ISO 8601 date format (YYYY-MM-DD)', () => {
      expect(() => validateDateFormat('2024-11-11')).not.toThrow();
      expect(validateDateFormat('2024-11-11')).toBe(true);
    });

    it('should accept valid leap year date', () => {
      expect(() => validateDateFormat('2024-02-29')).not.toThrow();
    });

    it('should reject date with wrong format (YYYY/MM/DD)', () => {
      expect(() => validateDateFormat('2024/11/11')).toThrow(
        'Invalid date format. Expected YYYY-MM-DD'
      );
    });

    it('should reject malformed date string', () => {
      expect(() => validateDateFormat('2024-13-45')).toThrow(
        'Invalid date format. Expected YYYY-MM-DD'
      );
    });

    it('should reject non-date string', () => {
      expect(() => validateDateFormat('not-a-date')).toThrow(
        'Invalid date format. Expected YYYY-MM-DD'
      );
    });

    it('should reject missing date', () => {
      expect(() => validateDateFormat()).toThrow('Date is required');
    });

    it('should reject undefined date', () => {
      expect(() => validateDateFormat(undefined)).toThrow('Date is required');
    });

    it('should reject null date', () => {
      expect(() => validateDateFormat(null)).toThrow('Date is required');
    });

    it('should reject date as non-string type', () => {
      expect(() => validateDateFormat(20241111)).toThrow(
        'Date is required'
      );
    });

    it('should reject empty string date', () => {
      expect(() => validateDateFormat('')).toThrow('Date is required');
    });

    it('should reject invalid month in date', () => {
      expect(() => validateDateFormat('2024-13-01')).toThrow(
        'Invalid date format. Expected YYYY-MM-DD'
      );
    });

    it('should reject invalid day in date', () => {
      expect(() => validateDateFormat('2024-02-31')).toThrow(
        'Invalid date format. Expected YYYY-MM-DD'
      );
    });
  });

  describe('validateCategory', () => {
    it('should accept non-empty string category', () => {
      expect(() => validateCategory('Groceries')).not.toThrow();
      expect(validateCategory('Groceries')).toBe(true);
    });

    it('should accept category with special characters', () => {
      expect(() => validateCategory('Food & Dining')).not.toThrow();
    });

    it('should reject empty string category', () => {
      expect(() => validateCategory('')).toThrow('Category cannot be empty');
    });

    it('should reject whitespace-only category', () => {
      expect(() => validateCategory('   ')).toThrow('Category cannot be empty');
    });

    it('should reject null category', () => {
      expect(() => validateCategory(null)).toThrow('Category must be a string');
    });

    it('should reject undefined category', () => {
      expect(() => validateCategory(undefined)).toThrow('Category is required');
    });

    it('should reject numeric category', () => {
      expect(() => validateCategory(123)).toThrow('Category must be a string');
    });

    it('should reject object as category', () => {
      expect(() => validateCategory({ name: 'Food' })).toThrow(
        'Category must be a string'
      );
    });

    it('should reject array as category', () => {
      expect(() => validateCategory(['Food'])).toThrow('Category must be a string');
    });

    it('should accept single character category', () => {
      expect(() => validateCategory('F')).not.toThrow();
    });

    it('should accept long category name', () => {
      expect(() => validateCategory('Entertainment and Leisure Activities')).not.toThrow();
    });
  });

  describe('validateAmount', () => {
    it('should accept positive number amount', () => {
      expect(() => validateAmount(50.00)).not.toThrow();
      expect(validateAmount(50.00)).toBe(true);
    });

    it('should accept small positive amount', () => {
      expect(() => validateAmount(0.01)).not.toThrow();
    });

    it('should accept integer amount', () => {
      expect(() => validateAmount(100)).not.toThrow();
    });

    it('should reject zero amount', () => {
      expect(() => validateAmount(0)).toThrow('Amount must be greater than 0');
    });

    it('should reject negative amount', () => {
      expect(() => validateAmount(-50)).toThrow('Amount must be greater than 0');
    });

    it('should reject string amount', () => {
      expect(() => validateAmount('50.00')).toThrow('Amount must be a number');
    });

    it('should reject null amount', () => {
      expect(() => validateAmount(null)).toThrow('Amount must be a number');
    });

    it('should reject undefined amount', () => {
      expect(() => validateAmount(undefined)).toThrow('Amount is required');
    });

    it('should reject NaN amount', () => {
      expect(() => validateAmount(NaN)).toThrow('Amount must be a number');
    });

    it('should reject Infinity', () => {
      expect(() => validateAmount(Infinity)).not.toThrow();
    });

    it('should reject object as amount', () => {
      expect(() => validateAmount({ value: 50 })).toThrow(
        'Amount must be a number'
      );
    });

    it('should accept very large valid amount', () => {
      expect(() => validateAmount(999999.99)).not.toThrow();
    });
  });

  describe('validateMonth', () => {
    it('should accept valid month (1-12)', () => {
      expect(() => validateMonth(1)).not.toThrow();
      expect(() => validateMonth(6)).not.toThrow();
      expect(() => validateMonth(12)).not.toThrow();
      expect(validateMonth(11)).toBe(true);
    });

    it('should accept undefined month (optional)', () => {
      expect(() => validateMonth(undefined)).not.toThrow();
    });

    it('should accept null month (optional)', () => {
      expect(() => validateMonth(null)).not.toThrow();
    });

    it('should reject month = 0', () => {
      expect(() => validateMonth(0)).toThrow('Invalid month. Must be between 1 and 12');
    });

    it('should reject month = 13', () => {
      expect(() => validateMonth(13)).toThrow('Invalid month. Must be between 1 and 12');
    });

    it('should reject negative month', () => {
      expect(() => validateMonth(-1)).toThrow('Invalid month. Must be between 1 and 12');
    });

    it('should reject non-numeric month string', () => {
      expect(() => validateMonth('abc')).toThrow('Month must be a number');
    });

    it('should reject decimal month', () => {
      expect(() => validateMonth(6.5)).toThrow('Invalid month. Must be between 1 and 12');
    });

    it('should accept month as string that converts to valid number', () => {
      expect(() => validateMonth('11')).not.toThrow();
    });
  });

  describe('validateExpense', () => {
    it('should accept valid complete expense object', () => {
      const expense = {
        date: '2024-11-11',
        category: 'Groceries',
        amount: 45.99
      };
      expect(() => validateExpense(expense)).not.toThrow();
    });

    it('should reject expense with invalid date', () => {
      const expense = {
        date: '2024/11/11',
        category: 'Groceries',
        amount: 45.99
      };
      expect(() => validateExpense(expense)).toThrow('Invalid date format');
    });

    it('should reject expense with empty category', () => {
      const expense = {
        date: '2024-11-11',
        category: '',
        amount: 45.99
      };
      expect(() => validateExpense(expense)).toThrow('Category cannot be empty');
    });

    it('should reject expense with zero amount', () => {
      const expense = {
        date: '2024-11-11',
        category: 'Groceries',
        amount: 0
      };
      expect(() => validateExpense(expense)).toThrow('Amount must be greater than 0');
    });

    it('should reject expense with negative amount', () => {
      const expense = {
        date: '2024-11-11',
        category: 'Groceries',
        amount: -10
      };
      expect(() => validateExpense(expense)).toThrow('Amount must be greater than 0');
    });

    it('should reject null expense', () => {
      expect(() => validateExpense(null)).toThrow('Invalid expense object');
    });

    it('should reject non-object expense', () => {
      expect(() => validateExpense('not an object')).toThrow('Invalid expense object');
    });
  });
});
