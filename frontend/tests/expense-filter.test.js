import { describe, it, expect } from 'vitest';
import {
  filterExpensesByCategory,
  filterExpensesByMonth,
  filterExpensesByBoth,
  detectEmptyState
} from '../src/utils/filterUtils.js';

describe('Expense Filtering', () => {
  
  // Sample test data
  const sampleExpenses = [
    { id: 1, description: 'Lunch', amount: 15, category: 'Food', date: '2024-10-15', timestamp: '2024-10-15T12:00:00Z' },
    { id: 2, description: 'Gas', amount: 50, category: 'Transport', date: '2024-10-20', timestamp: '2024-10-20T08:00:00Z' },
    { id: 3, description: 'Movie', amount: 25, category: 'Food', date: '2024-09-10', timestamp: '2024-09-10T18:00:00Z' },
    { id: 4, description: 'Bus fare', amount: 5, category: 'Transport', date: '2024-10-22', timestamp: '2024-10-22T09:00:00Z' },
    { id: 5, description: 'Coffee', amount: 5, category: 'Food', date: '2024-10-25', timestamp: '2024-10-25T10:00:00Z' }
  ];

  describe('filterExpensesByCategory', () => {
    
    it('returns expenses matching selected category', () => {
      const result = filterExpensesByCategory(sampleExpenses, 'Food');
      expect(result).toHaveLength(3);
      expect(result.every(e => e.category === 'Food')).toBe(true);
    });

    it('returns all expenses when category is null', () => {
      const result = filterExpensesByCategory(sampleExpenses, null);
      expect(result).toHaveLength(5);
      expect(result).toEqual(sampleExpenses);
    });

    it('returns empty array when no expenses match category', () => {
      const result = filterExpensesByCategory(sampleExpenses, 'Entertainment');
      expect(result).toHaveLength(0);
    });

  });

  describe('filterExpensesByMonth', () => {

    it('returns expenses from selected month', () => {
      const result = filterExpensesByMonth(sampleExpenses, 10); // October
      expect(result).toHaveLength(4);
      expect(result.every(e => new Date(e.date).getMonth() + 1 === 10)).toBe(true);
    });

    it('returns all expenses when month is null', () => {
      const result = filterExpensesByMonth(sampleExpenses, null);
      expect(result).toHaveLength(5);
      expect(result).toEqual(sampleExpenses);
    });

    it('returns empty array when no expenses match month', () => {
      const result = filterExpensesByMonth(sampleExpenses, 12); // December
      expect(result).toHaveLength(0);
    });

  });

  describe('filterExpensesByBoth', () => {

    it('applies AND logic correctly for category and month', () => {
      const filters = { category: 'Food', month: 10 };
      const result = filterExpensesByBoth(sampleExpenses, filters);
      
      expect(result).toHaveLength(2);
      expect(result.every(e => 
        e.category === 'Food' && 
        new Date(e.date).getMonth() + 1 === 10
      )).toBe(true);
    });

    it('handles null category filter (month only)', () => {
      const filters = { category: null, month: 10 };
      const result = filterExpensesByBoth(sampleExpenses, filters);
      
      expect(result).toHaveLength(4);
      expect(result.every(e => new Date(e.date).getMonth() + 1 === 10)).toBe(true);
    });

    it('handles null month filter (category only)', () => {
      const filters = { category: 'Food', month: null };
      const result = filterExpensesByBoth(sampleExpenses, filters);
      
      expect(result).toHaveLength(3);
      expect(result.every(e => e.category === 'Food')).toBe(true);
    });

    it('returns all expenses when both filters are null', () => {
      const filters = { category: null, month: null };
      const result = filterExpensesByBoth(sampleExpenses, filters);
      
      expect(result).toHaveLength(5);
      expect(result).toEqual(sampleExpenses);
    });

    it('returns empty array when no expenses match both filters', () => {
      const filters = { category: 'Entertainment', month: 10 };
      const result = filterExpensesByBoth(sampleExpenses, filters);
      
      expect(result).toHaveLength(0);
    });

  });

  describe('detectEmptyState', () => {

    it('returns true when filtered list is empty', () => {
      const emptyList = [];
      const result = detectEmptyState(emptyList, {});
      
      expect(result).toBe(true);
    });

    it('returns false when filtered list has items', () => {
      const result = detectEmptyState(sampleExpenses, {});
      
      expect(result).toBe(false);
    });

  });

});
