/**
 * Unit Tests for Expense Service (T024-T026)
 * 
 * Business logic verification for ExpenseStore methods.
 * Tests focus on service layer functionality, not HTTP layer.
 * 
 * Coverage Target: ≥80% statements for api/src/services/expenses.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ExpenseStore } from '../../src/services/expenses.js';
import type { CreateExpenseRequest } from '../../src/types/index.js';

describe('ExpenseStore Unit Tests', () => {
  let store: ExpenseStore;

  beforeEach(() => {
    store = new ExpenseStore();
  });

  /**
   * T024: ExpenseStore.create() Method
   * Tests expense creation with UUID assignment
   */
  describe('T024: ExpenseStore.create()', () => {
    it('should create expense with provided fields', () => {
      const request: CreateExpenseRequest = {
        amount: 25.50,
        category: 'food',
        date: '2025-11-05'
      };

      const expense = store.create(request);

      expect(expense.amount).toBe(25.50);
      expect(expense.category).toBe('food');
      expect(expense.date).toBe('2025-11-05');
    });

    it('should assign UUID to id field', () => {
      const request: CreateExpenseRequest = {
        amount: 25.50,
        category: 'food',
        date: '2025-11-05'
      };

      const expense = store.create(request);

      expect(expense).toHaveProperty('id');
      expect(typeof expense.id).toBe('string');
      expect(expense.id.length).toBe(36); // UUID v4 format
    });

    it('should return object matching Expense interface', () => {
      const request: CreateExpenseRequest = {
        amount: 100,
        category: 'transport',
        date: '2025-11-01'
      };

      const expense = store.create(request);

      expect(expense).toHaveProperty('id');
      expect(expense).toHaveProperty('amount');
      expect(expense).toHaveProperty('category');
      expect(expense).toHaveProperty('date');
      expect(Object.keys(expense)).toHaveLength(4);
    });

    it('should generate different IDs for multiple calls', () => {
      const request1: CreateExpenseRequest = {
        amount: 25.50,
        category: 'food',
        date: '2025-11-05'
      };

      const request2: CreateExpenseRequest = {
        amount: 100,
        category: 'transport',
        date: '2025-11-01'
      };

      const expense1 = store.create(request1);
      const expense2 = store.create(request2);

      expect(expense1.id).not.toBe(expense2.id);
    });

    it('should create expense with small decimal amount (0.01)', () => {
      const request: CreateExpenseRequest = {
        amount: 0.01,
        category: 'misc',
        date: '2025-11-05'
      };

      const expense = store.create(request);

      expect(expense.amount).toBe(0.01);
    });

    it('should create expense with large amount (999.99)', () => {
      const request: CreateExpenseRequest = {
        amount: 999.99,
        category: 'business',
        date: '2025-11-05'
      };

      const expense = store.create(request);

      expect(expense.amount).toBe(999.99);
    });

    it('should create expense with single-char category', () => {
      const request: CreateExpenseRequest = {
        amount: 50,
        category: 'x',
        date: '2025-11-05'
      };

      const expense = store.create(request);

      expect(expense.category).toBe('x');
    });

    it('should create expense with long category string', () => {
      const longCategory = 'very long category name with many characters';
      const request: CreateExpenseRequest = {
        amount: 50,
        category: longCategory,
        date: '2025-11-05'
      };

      const expense = store.create(request);

      expect(expense.category).toBe(longCategory);
    });

    it('should create expense with special characters in category', () => {
      const request: CreateExpenseRequest = {
        amount: 50,
        category: 'food & drinks',
        date: '2025-11-05'
      };

      const expense = store.create(request);

      expect(expense.category).toBe('food & drinks');
    });
  });

  /**
   * T025: ExpenseStore.filter() Method
   * Tests filtering by category and/or month
   */
  describe('T025: ExpenseStore.filter()', () => {
    beforeEach(() => {
      // Create test data
      store.create({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      store.create({
        amount: 30,
        category: 'transport',
        date: '2025-11-02'
      });

      store.create({
        amount: 15,
        category: 'food',
        date: '2025-11-15'
      });

      store.create({
        amount: 10,
        category: 'food',
        date: '2025-10-15'
      });
    });

    it('should return all expenses when no filters provided', () => {
      const filtered = store.filter();

      expect(filtered).toHaveLength(4);
    });

    it('should filter by category only', () => {
      const filtered = store.filter('food');

      expect(filtered).toHaveLength(3);
      expect(filtered.every(exp => exp.category === 'food')).toBe(true);
    });

    it('should return only matching category expenses', () => {
      const filtered = store.filter('transport');

      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('transport');
      expect(filtered[0].amount).toBe(30);
    });

    it('should filter by month only (date.startsWith)', () => {
      const filtered = store.filter(undefined, '2025-11');

      expect(filtered).toHaveLength(3);
      expect(filtered.every(exp => exp.date.startsWith('2025-11'))).toBe(true);
    });

    it('should return only matching month expenses', () => {
      const filtered = store.filter(undefined, '2025-10');

      expect(filtered).toHaveLength(1);
      expect(filtered[0].date).toContain('2025-10');
    });

    it('should filter by both category AND month', () => {
      const filtered = store.filter('food', '2025-11');

      expect(filtered).toHaveLength(2);
      expect(filtered.every(exp => exp.category === 'food' && exp.date.startsWith('2025-11'))).toBe(true);
    });

    it('should return empty array when no matches', () => {
      const filtered = store.filter('nonexistent');

      expect(filtered).toHaveLength(0);
      expect(Array.isArray(filtered)).toBe(true);
    });

    it('should return new array, not modify original', () => {
      const allBefore = store.getAll();
      const filtered = store.filter('food');
      const allAfter = store.getAll();

      expect(allBefore).toHaveLength(allAfter.length);
      expect(filtered).not.toBe(allBefore);
    });

    it('should handle case-sensitive category matching', () => {
      const filtered = store.filter('FOOD');

      expect(filtered).toHaveLength(0);
    });

    it('should handle both filters applied independently', () => {
      // Food in any month
      const foodFilter = store.filter('food', undefined);
      expect(foodFilter).toHaveLength(3);

      // Any category in November
      const novemberFilter = store.filter(undefined, '2025-11');
      expect(novemberFilter).toHaveLength(3);

      // Food in November
      const bothFilter = store.filter('food', '2025-11');
      expect(bothFilter).toHaveLength(2);
    });
  });

  /**
   * T026: ExpenseStore.summarize() Method
   * Tests aggregation with various filter combinations
   */
  describe('T026: ExpenseStore.summarize()', () => {
    it('should return empty summary when no expenses', () => {
      const summary = store.summarize();

      expect(summary.total).toBe(0);
      expect(summary.count).toBe(0);
      expect(summary.filters).toEqual({});
    });

    it('should aggregate all expenses when no filter', () => {
      store.create({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      store.create({
        amount: 30,
        category: 'transport',
        date: '2025-11-02'
      });

      store.create({
        amount: 15,
        category: 'food',
        date: '2025-11-03'
      });

      const summary = store.summarize();

      expect(summary.total).toBe(65);
      expect(summary.count).toBe(3);
      expect(summary.filters).toEqual({});
    });

    it('should aggregate expenses with category filter', () => {
      store.create({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      store.create({
        amount: 30,
        category: 'transport',
        date: '2025-11-02'
      });

      store.create({
        amount: 15,
        category: 'food',
        date: '2025-11-03'
      });

      const summary = store.summarize({ category: 'food' });

      expect(summary.total).toBe(35);
      expect(summary.count).toBe(2);
      expect(summary.filters).toEqual({ category: 'food' });
    });

    it('should aggregate expenses with month filter', () => {
      store.create({
        amount: 100,
        category: 'transport',
        date: '2025-10-15'
      });

      store.create({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      store.create({
        amount: 45,
        category: 'transport',
        date: '2025-11-15'
      });

      const summary = store.summarize({ month: '2025-11' });

      expect(summary.total).toBe(65);
      expect(summary.count).toBe(2);
      expect(summary.filters).toEqual({ month: '2025-11' });
    });

    it('should aggregate expenses with both filters (AND logic)', () => {
      store.create({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      store.create({
        amount: 15,
        category: 'food',
        date: '2025-11-15'
      });

      store.create({
        amount: 30,
        category: 'transport',
        date: '2025-11-05'
      });

      store.create({
        amount: 10,
        category: 'food',
        date: '2025-10-15'
      });

      const summary = store.summarize({
        category: 'food',
        month: '2025-11'
      });

      expect(summary.total).toBe(35);
      expect(summary.count).toBe(2);
      expect(summary.filters).toEqual({
        category: 'food',
        month: '2025-11'
      });
    });

    it('should return empty summary with preserved filters when no match', () => {
      store.create({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      const summary = store.summarize({ category: 'nonexistent' });

      expect(summary.total).toBe(0);
      expect(summary.count).toBe(0);
      expect(summary.filters).toEqual({ category: 'nonexistent' });
    });

    it('should correctly aggregate decimal amounts', () => {
      store.create({
        amount: 10.5,
        category: 'food',
        date: '2025-11-01'
      });

      store.create({
        amount: 20.75,
        category: 'food',
        date: '2025-11-02'
      });

      const summary = store.summarize();

      expect(summary.total).toBe(31.25);
      expect(summary.count).toBe(2);
    });

    it('should include only filter keys that were applied', () => {
      store.create({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      // Category only
      const categorySummary = store.summarize({ category: 'food' });
      expect(categorySummary.filters).toEqual({ category: 'food' });
      expect(categorySummary.filters).not.toHaveProperty('month');

      // Month only
      const monthSummary = store.summarize({ month: '2025-11' });
      expect(monthSummary.filters).toEqual({ month: '2025-11' });
      expect(monthSummary.filters).not.toHaveProperty('category');

      // Both
      const bothSummary = store.summarize({
        category: 'food',
        month: '2025-11'
      });
      expect(bothSummary.filters).toHaveProperty('category');
      expect(bothSummary.filters).toHaveProperty('month');
    });

    it('should handle multiple expenses with same values', () => {
      store.create({
        amount: 25,
        category: 'food',
        date: '2025-11-01'
      });

      store.create({
        amount: 25,
        category: 'food',
        date: '2025-11-02'
      });

      store.create({
        amount: 25,
        category: 'food',
        date: '2025-11-03'
      });

      const summary = store.summarize();

      expect(summary.total).toBe(75);
      expect(summary.count).toBe(3);
    });
  });

  /**
   * T027: ExpenseStore.findExpenses() Method
   * Tests pagination with optional filters
   */
  describe('T027: ExpenseStore.findExpenses()', () => {
    beforeEach(() => {
      // Create test data (25 expenses for pagination testing)
      for (let i = 1; i <= 25; i++) {
        store.create({
          amount: i * 10,
          category: i % 2 === 0 ? 'food' : 'transport',
          date: `2025-11-${String(i).padStart(2, '0')}`
        });
      }
    });

    it('should return paginated response with default pagination', () => {
      const response = store.findExpenses();

      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('pagination');
      expect(response.data).toHaveLength(20); // Default pageSize
      expect(response.pagination.currentPage).toBe(1);
      expect(response.pagination.pageSize).toBe(20);
      expect(response.pagination.totalItems).toBe(25);
      expect(response.pagination.totalPages).toBe(2);
    });

    it('should return empty data array when store is empty', () => {
      const emptyStore = new ExpenseStore();
      const response = emptyStore.findExpenses();

      expect(response.data).toHaveLength(0);
      expect(response.pagination.totalItems).toBe(0);
      expect(response.pagination.currentPage).toBe(1);
      expect(response.pagination.pageSize).toBe(20);
      expect(response.pagination.totalPages).toBe(0);
    });

    it('should paginate correctly with custom page and pageSize', () => {
      const response = store.findExpenses(undefined, { page: 2, pageSize: 10 });

      expect(response.data).toHaveLength(10);
      expect(response.pagination.currentPage).toBe(2);
      expect(response.pagination.pageSize).toBe(10);
      expect(response.pagination.totalItems).toBe(25);
      expect(response.pagination.totalPages).toBe(3);
    });

    it('should return correct page data (first page)', () => {
      const response = store.findExpenses(undefined, { page: 1, pageSize: 5 });

      expect(response.data).toHaveLength(5);
      expect(response.data[0].amount).toBe(10);
      expect(response.pagination.currentPage).toBe(1);
      expect(response.pagination.totalPages).toBe(5);
    });

    it('should return correct page data (last page)', () => {
      const response = store.findExpenses(undefined, { page: 3, pageSize: 10 });

      expect(response.data).toHaveLength(5); // Last page has 5 items
      expect(response.pagination.currentPage).toBe(3);
      expect(response.pagination.totalPages).toBe(3);
    });

    it('should return empty data array when page exceeds total pages', () => {
      const response = store.findExpenses(undefined, { page: 10, pageSize: 10 });

      expect(response.data).toHaveLength(0);
      expect(response.pagination.currentPage).toBe(10);
      expect(response.pagination.totalPages).toBe(3);
    });

    it('should filter by category and paginate', () => {
      const response = store.findExpenses({ category: 'food' }, { page: 1, pageSize: 5 });

      expect(response.data).toHaveLength(5);
      expect(response.data.every(exp => exp.category === 'food')).toBe(true);
      expect(response.pagination.totalItems).toBe(12); // 12 food expenses (even numbers 2-24)
      expect(response.pagination.totalPages).toBe(3);
    });

    it('should filter by month and paginate', () => {
      // Add some expenses in different month
      store.create({ amount: 100, category: 'food', date: '2025-10-01' });
      store.create({ amount: 200, category: 'transport', date: '2025-10-02' });

      const response = store.findExpenses({ month: '2025-11' }, { page: 1, pageSize: 10 });

      expect(response.data).toHaveLength(10);
      expect(response.data.every(exp => exp.date.startsWith('2025-11'))).toBe(true);
      expect(response.pagination.totalItems).toBe(25); // Original 25 expenses
      expect(response.pagination.totalPages).toBe(3);
    });

    it('should filter by both category and month and paginate', () => {
      const response = store.findExpenses(
        { category: 'food', month: '2025-11' },
        { page: 1, pageSize: 5 }
      );

      expect(response.data).toHaveLength(5);
      expect(response.data.every(exp => 
        exp.category === 'food' && exp.date.startsWith('2025-11')
      )).toBe(true);
      expect(response.pagination.totalItems).toBe(12);
    });

    it('should calculate totalPages correctly (Math.ceil)', () => {
      // 25 items with pageSize 7 = 4 pages (7+7+7+4)
      const response = store.findExpenses(undefined, { page: 1, pageSize: 7 });

      expect(response.pagination.totalPages).toBe(4);
      expect(response.pagination.totalItems).toBe(25);
    });

    it('should handle pageSize equal to totalItems', () => {
      const response = store.findExpenses(undefined, { page: 1, pageSize: 25 });

      expect(response.data).toHaveLength(25);
      expect(response.pagination.totalPages).toBe(1);
    });

    it('should handle pageSize larger than totalItems', () => {
      const response = store.findExpenses(undefined, { page: 1, pageSize: 100 });

      expect(response.data).toHaveLength(25);
      expect(response.pagination.totalPages).toBe(1);
    });
  });
});

