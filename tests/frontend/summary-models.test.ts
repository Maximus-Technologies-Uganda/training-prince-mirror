import { describe, expect, it } from 'vitest';
import {
  formatGeneratedAt,
  mapExpenseSummary,
  type ExpenseSummaryApiResponse,
} from '../../frontend/app/expenses/models/summary';

describe('mapExpenseSummary', () => {
  it('maps optional fields to safe defaults', () => {
    const payload: ExpenseSummaryApiResponse = {
      total: 250,
      count: 10,
    };

    const result = mapExpenseSummary(payload);

    expect(result.total).toBe(250);
    expect(result.count).toBe(10);
    expect(result.filters).toEqual({ category: null, month: null });
    expect(Date.parse(result.generatedAt)).toBeGreaterThan(0);
  });

  it('surfaces API-provided filters and timestamp', () => {
    const payload: ExpenseSummaryApiResponse = {
      total: 500,
      count: 4,
      filters: { category: 'travel' },
      generatedAt: '2025-11-18T10:00:00.000Z',
    };

    const result = mapExpenseSummary(payload);

    expect(result.filters).toEqual({ category: 'travel', month: null });
    expect(result.generatedAt).toBe('2025-11-18T10:00:00.000Z');
  });

  it('throws when totals are negative', () => {
    expect(() =>
      mapExpenseSummary({ total: -1, count: 5 })
    ).toThrowError(/cannot be negative/i);
  });
});

describe('formatGeneratedAt', () => {
  it('formats ISO string into the configured summary label', () => {
    const iso = '2025-01-02T03:04:05.000Z';
    const formatted = formatGeneratedAt(iso);

    expect(formatted).toContain('2025');
    expect(formatted.toLowerCase()).toContain('jan');
    expect(formatted.toLowerCase()).toMatch(/am|pm/);
  });
});
