import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createExpenseState,
  addEntry,
  setFilter,
  getVisibleEntries,
  calculateTotalForFilter,
  createExpenseUi,
  normalizeCategory,
  normalizeMonth,
  formatAmount,
  formatMonth,
} from './index.js';

describe('ui-expense pure helpers', () => {
  it('adds valid entry', () => {
    const base = createExpenseState();
    const result = addEntry(base, { amount: '25.50', category: 'Food', month: '3' });
    expect(result.error).toBeUndefined();
    expect(result.state.entries).toHaveLength(1);
    expect(result.state.entries[0]).toMatchObject({ amount: 25.5, category: 'Food', month: 3 });
  });

  it('rejects invalid amount', () => {
    const base = createExpenseState();
    const result = addEntry(base, { amount: 'nope', category: 'Food', month: '3' });
    expect(result.error).toMatch(/number/i);
    expect(result.state.entries).toHaveLength(0);
  });

  it('normalizes category and month values', () => {
    expect(normalizeCategory('  Travel  ')).toBe('Travel');
    expect(normalizeMonth('')).toBeNull();
    expect(normalizeMonth('02')).toBe(2);
    expect(normalizeMonth('20')).toBe('INVALID');
  });

  it('filters visible entries and totals by category', () => {
    let state = createExpenseState();
    const first = addEntry(state, { amount: 10, category: 'Food', month: 1 }).state;
    const second = addEntry(first, { amount: 20, category: 'Travel', month: 1 }).state;
    state = setFilter(second, 'Food');
    expect(getVisibleEntries(state)).toHaveLength(1);
    expect(calculateTotalForFilter(state.entries, state.filter)).toBe(10);
  });

  it('formats values for display', () => {
    expect(formatAmount(25)).toMatch(/\$25\.00/);
    expect(formatMonth(null)).toBe('—');
    expect(formatMonth(4)).toBe('04');
  });
});

describe('ui-expense totals — table-driven filters', () => {
  const entries = [
    { amount: 10, category: 'Food', month: 1 },
    { amount: 20, category: 'Fuel', month: 1 },
    { amount: 30, category: 'Food', month: 2 },
    { amount: 40, category: 'Travel', month: 2 },
  ];

  const cases = [
    { name: 'month only', filter: { month: 1 }, expected: 30 },
    { name: 'category only', filter: { category: 'Food' }, expected: 40 },
    { name: 'both filters', filter: { month: 1, category: 'Food' }, expected: 10 },
    { name: 'no filters', filter: null, expected: 100 },
  ];

  for (const c of cases) {
    it(`calculates total for ${c.name}`, () => {
      expect(calculateTotalForFilter(entries, c.filter)).toBe(c.expected);
    });
  }
});

describe('ui-expense DOM behaviour', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="expense-app">
        <form id="expense-form">
          <input id="exp-amount" />
          <input id="exp-category" />
          <input id="exp-month" />
          <button type="submit">Add</button>
        </form>
        <p id="exp-error"></p>
        <select id="exp-filter"><option value="all">All categories</option></select>
        <p id="exp-total"></p>
        <table><tbody id="exp-rows"></tbody></table>
      </section>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('submits form and renders totals', () => {
    const root = document.getElementById('expense-app');
    createExpenseUi(root);
    const form = document.getElementById('expense-form');
    document.getElementById('exp-amount').value = '12.34';
    document.getElementById('exp-category').value = 'Fuel';
    document.getElementById('exp-month').value = '6';

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const rows = document.querySelectorAll('#exp-rows tr');
    expect(rows).toHaveLength(1);
    expect(document.getElementById('exp-total').textContent).toMatch(/12\.34/);
  });

  it('surfaces validation errors', () => {
    const root = document.getElementById('expense-app');
    createExpenseUi(root);
    const form = document.getElementById('expense-form');
    document.getElementById('exp-amount').value = '-5';
    document.getElementById('exp-category').value = 'Food';
    document.getElementById('exp-month').value = '';

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(document.getElementById('exp-error').textContent).toMatch(/greater than zero/i);
    expect(document.querySelectorAll('#exp-rows tr')).toHaveLength(0);
  });
});

