import { describe, it, expect } from 'vitest';
import { calculateTotal } from '../src/expense/core.js';

describe('expense.calculateTotal more cases', () => {
  it('returns 0 for an empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('returns 0 when category filter has no matches', () => {
    const expenses = [
      { description: 'Lunch', amount: 200, category: 'food' },
      { description: 'Taxi', amount: 100, category: 'transport' },
    ];
    expect(calculateTotal(expenses, 'rent')).toBe(0);
  });
});
