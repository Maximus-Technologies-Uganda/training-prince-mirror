import { describe, it, expect } from 'vitest';
import { calculateTotal } from '../src/expense/core.js';
import { spawnSync } from 'node:child_process';

const sample = [
  { description: 'Lunch', amount: 200, category: 'food', month: 1 },
  { description: 'Coffee', amount: 50, category: 'food', month: 1 },
  { description: 'Bus', amount: 100, category: 'transport', month: 2 },
  { description: 'Groceries', amount: 150, category: 'food', month: 2 },
];

describe('expense.calculateTotal table-driven', () => {
  const cases = [
    { name: 'none', filter: null, want: 500 },
    { name: 'category-only', filter: { category: 'food' }, want: 400 },
    { name: 'month-only', filter: { month: 1 }, want: 250 },
    { name: 'both', filter: { category: 'food', month: 2 }, want: 150 },
  ];

  for (const tc of cases) {
    it(`totals with filter: ${tc.name}`, () => {
      const got = calculateTotal(sample, tc.filter);
      expect(got).toBe(tc.want);
    });
  }
});

describe('expense CLI invalid month', () => {
  it('errors when --month is out of range', () => {
    const out = spawnSync('node', ['src/expense/index.js', 'total', '--month', '13'], { encoding: 'utf8' });
    expect(out.status).not.toBe(0);
    expect(out.stderr).toContain('month');
  });
});
