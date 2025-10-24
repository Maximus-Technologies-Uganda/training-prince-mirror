import { describe, it, expect, vi } from 'vitest';
import { defaultQuotes, pickRandom, filterByAuthor, formatQuote } from '../src/quote/core.js';
import { run } from '../src/quote/index.js';

describe('quote core', () => {
  it('formatQuote prints text and author', () => {
    const q = { text: 'Hello', author: 'World' };
    expect(formatQuote(q)).toBe('"Hello" — World');
  });

  it('filterByAuthor returns case-insensitive matches', () => {
    const out = filterByAuthor(defaultQuotes, 'jobs');
    expect(out.some(q => q.author.includes('Jobs'))).toBe(true);
  });

  it('pickRandom throws when list empty', () => {
    expect(() => pickRandom([])).toThrow('No quotes available.');
  });
});

describe('quote CLI run()', () => {
  it('returns 0 and logs a quote by default', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const code = run([]);
    expect(code).toBe(0);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('returns 1 when author not found', () => {
    const spyErr = vi.spyOn(console, 'error').mockImplementation(() => {});
    const code = run(['--by', 'No Such Author']);
    expect(code).toBe(1);
    expect(spyErr).toHaveBeenCalled();
    spyErr.mockRestore();
  });
});
