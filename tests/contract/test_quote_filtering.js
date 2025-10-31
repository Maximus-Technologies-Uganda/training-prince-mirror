import { describe, it, expect, vi } from 'vitest';
import { 
  filterQuotesByAuthor, 
  validateFilterQuery, 
  selectRandomQuoteWithSeed 
} from '../../src/quote/core.js';

// These tests will FAIL until we implement the enhanced quote filtering logic
// Based on contracts/quote-filtering.md

describe('Quote Filtering Contract Tests', () => {
  describe('filterQuotes function', () => {
    const testQuotes = [
      { id: '1', text: 'Hello world', author: 'John Doe' },
      { id: '2', text: 'Good morning', author: 'Jane Smith' },
      { id: '3', text: 'Another quote', author: 'John Smith' },
    ];

    it('should filter quotes by author name case-insensitively', () => {
      // This will fail until we implement the enhanced filtering
      const result = filterQuotesByAuthor(testQuotes, 'john');
      expect(result).toHaveLength(2);
      expect(result[0].author).toContain('John');
      expect(result[1].author).toContain('John');
    });

    it('should return all quotes for empty query', () => {
      const result = filterQuotesByAuthor(testQuotes, '');
      expect(result).toHaveLength(3);
      expect(result).toEqual(testQuotes);
    });

    it('should return all quotes for whitespace-only query', () => {
      const result = filterQuotesByAuthor(testQuotes, '   ');
      expect(result).toHaveLength(3);
      expect(result).toEqual(testQuotes);
    });

    it('should return empty array for non-existent author', () => {
      const result = filterQuotesByAuthor(testQuotes, 'nonexistent');
      expect(result).toHaveLength(0);
    });

    it('should handle case-insensitive matching', () => {
      const result = filterQuotesByAuthor(testQuotes, 'JANE');
      expect(result).toHaveLength(1);
      expect(result[0].author).toBe('Jane Smith');
    });
  });

  describe('validateFilterQuery function', () => {
    it('should normalize empty queries', () => {
      expect(validateFilterQuery('')).toBe('');
      expect(validateFilterQuery('   ')).toBe('');
      expect(validateFilterQuery('\t')).toBe('');
    });

    it('should trim whitespace from queries', () => {
      expect(validateFilterQuery('  john  ')).toBe('john');
    });

    it('should preserve valid queries', () => {
      expect(validateFilterQuery('john doe')).toBe('john doe');
    });
  });

  describe('selectRandomQuoteWithSeed function', () => {
    const testQuotes = [
      { id: '1', text: 'Quote 1', author: 'Author 1' },
      { id: '2', text: 'Quote 2', author: 'Author 2' },
    ];

    it('should select a random quote from array', () => {
      const result = selectRandomQuoteWithSeed(testQuotes);
      expect(testQuotes).toContain(result);
    });

    it('should accept seeded RNG for deterministic testing', () => {
      const seededRNG = () => 0.5; // Always returns 0.5
      const result = selectRandomQuoteWithSeed(testQuotes, seededRNG);
      expect(result).toBe(testQuotes[1]); // 0.5 * 2 = 1 (second quote)
    });

    it('should throw error for empty quotes array', () => {
      expect(() => selectRandomQuoteWithSeed([])).toThrow('No quotes available');
    });
  });
});
