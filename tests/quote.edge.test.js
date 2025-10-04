import { describe, it, expect, vi } from 'vitest';
import { defaultQuotes, pickRandom, filterByAuthor, formatQuote } from '../src/quote/core.js';
import { run } from '../src/quote/index.js';

describe('quote edge cases', () => {
  describe('pickRandom edge cases', () => {
    it('throws when quotes is null', () => {
      expect(() => pickRandom(null)).toThrow('No quotes available.');
    });

    it('uses default quotes when quotes is undefined', () => {
      const result = pickRandom(undefined);
      expect(result).toBeDefined();
      expect(result.text).toBeDefined();
      expect(result.author).toBeDefined();
    });

    it('throws when quotes is not an array', () => {
      expect(() => pickRandom('not an array')).toThrow('No quotes available.');
    });

    it('throws when quotes is empty array', () => {
      expect(() => pickRandom([])).toThrow('No quotes available.');
    });

    it('returns a quote when quotes has one item', () => {
      const singleQuote = [{ text: 'Test', author: 'Author' }];
      const result = pickRandom(singleQuote);
      expect(result).toEqual(singleQuote[0]);
    });
  });

  describe('filterByAuthor edge cases', () => {
    it('returns all quotes when author is empty string', () => {
      const result = filterByAuthor(defaultQuotes, '');
      expect(result).toEqual(defaultQuotes);
    });

    it('returns all quotes when author is null', () => {
      const result = filterByAuthor(defaultQuotes, null);
      expect(result).toEqual(defaultQuotes);
    });

    it('returns all quotes when author is undefined', () => {
      const result = filterByAuthor(defaultQuotes, undefined);
      expect(result).toEqual(defaultQuotes);
    });

    it('handles quotes with missing author field', () => {
      const quotesWithMissingAuthor = [
        { text: 'Quote 1', author: 'Author 1' },
        { text: 'Quote 2' }, // missing author
        { text: 'Quote 3', author: 'Author 3' }
      ];
      const result = filterByAuthor(quotesWithMissingAuthor, 'author');
      expect(result).toHaveLength(2);
      expect(result[0].author).toBe('Author 1');
      expect(result[1].author).toBe('Author 3');
    });

    it('handles quotes with null author field', () => {
      const quotesWithNullAuthor = [
        { text: 'Quote 1', author: 'Author 1' },
        { text: 'Quote 2', author: null },
        { text: 'Quote 3', author: 'Author 3' }
      ];
      const result = filterByAuthor(quotesWithNullAuthor, 'author');
      expect(result).toHaveLength(2);
    });

    it('returns empty array when no matches found', () => {
      const result = filterByAuthor(defaultQuotes, 'nonexistent');
      expect(result).toEqual([]);
    });

    it('handles case-insensitive partial matches', () => {
      const result = filterByAuthor(defaultQuotes, 'STEVE');
      expect(result.some(q => q.author.includes('Steve'))).toBe(true);
    });

    it('handles case-insensitive partial matches in reverse', () => {
      const result = filterByAuthor(defaultQuotes, 'steve');
      expect(result.some(q => q.author.includes('Steve'))).toBe(true);
    });
  });

  describe('formatQuote edge cases', () => {
    it('handles quote with empty text', () => {
      const q = { text: '', author: 'Author' };
      expect(formatQuote(q)).toBe('"" — Author');
    });

    it('handles quote with empty author', () => {
      const q = { text: 'Text', author: '' };
      expect(formatQuote(q)).toBe('"Text" — ');
    });

    it('handles quote with special characters', () => {
      const q = { text: 'Quote with "quotes" and — dashes', author: 'Author' };
      expect(formatQuote(q)).toBe('"Quote with "quotes" and — dashes" — Author');
    });

    it('handles quote with newlines', () => {
      const q = { text: 'Line 1\nLine 2', author: 'Author' };
      expect(formatQuote(q)).toBe('"Line 1\nLine 2" — Author');
    });
  });

  describe('CLI edge cases', () => {
    it('handles --by with empty author', () => {
      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const code = run(['--by', '']);
      expect(code).toBe(0);
      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });

    it('handles --by with whitespace-only author', () => {
      const spyErr = vi.spyOn(console, 'error').mockImplementation(() => {});
      const code = run(['--by', '   ']);
      expect(code).toBe(1);
      expect(spyErr).toHaveBeenCalledWith('Error: No quotes found for the specified author.');
      spyErr.mockRestore();
    });

    it('handles case-insensitive author search', () => {
      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const code = run(['--by', 'STEVE']);
      expect(code).toBe(0);
      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });

    it('handles partial author name', () => {
      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const code = run(['--by', 'Franklin']);
      expect(code).toBe(0);
      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });

    it('handles author name with extra spaces', () => {
      const spyErr = vi.spyOn(console, 'error').mockImplementation(() => {});
      const code = run(['--by', '  Steve Jobs  ']);
      expect(code).toBe(1);
      expect(spyErr).toHaveBeenCalledWith('Error: No quotes found for the specified author.');
      spyErr.mockRestore();
    });

    it('handles unknown author with special characters', () => {
      const spyErr = vi.spyOn(console, 'error').mockImplementation(() => {});
      const code = run(['--by', 'Author@#$%']);
      expect(code).toBe(1);
      expect(spyErr).toHaveBeenCalledWith('Error: No quotes found for the specified author.');
      spyErr.mockRestore();
    });

    it('handles --by without argument', () => {
      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const code = run(['--by']);
      expect(code).toBe(0);
      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });
  });

  describe('CLI error handling', () => {
    it('returns 1 for author not found', () => {
      const spyErr = vi.spyOn(console, 'error').mockImplementation(() => {});
      const code = run(['--by', 'Nonexistent Author']);
      expect(code).toBe(1);
      expect(spyErr).toHaveBeenCalledWith('Error: No quotes found for the specified author.');
      spyErr.mockRestore();
    });

    it('returns 0 for successful quote retrieval', () => {
      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const code = run([]);
      expect(code).toBe(0);
      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });

    it('returns 0 for successful author-filtered quote', () => {
      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const code = run(['--by', 'Steve']);
      expect(code).toBe(0);
      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });

    it('shows version information', () => {
      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const code = run(['--version']);
      expect(code).toBe(0);
      expect(spyLog).toHaveBeenCalledWith('Quote CLI v1.0.0');
      spyLog.mockRestore();
    });
  });
});
