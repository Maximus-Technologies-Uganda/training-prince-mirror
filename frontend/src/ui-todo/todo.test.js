import { describe, it, expect } from 'vitest';
import { createClock } from './clock.js';
import {
  createUiState,
  addItem,
  toggleItem,
  removeItem,
  filterDueToday,
  normalizeText,
} from './index.js';

describe('T004 duplicate guard via normalization', () => {
  it('prevents duplicates ignoring case and collapsing whitespace', () => {
    const state = createUiState();
    const clock = createClock('Africa/Kampala', () => new Date('2025-09-30T09:00:00Z').getTime());

    let r1 = addItem(state, '  Buy   Milk  ', { dueDate: null, highPriority: false }, clock);
    expect(r1.error).toBeUndefined();
    expect(r1.state.items.length).toBe(1);

    let r2 = addItem(r1.state, 'buy milk', { dueDate: null, highPriority: false }, clock);
    expect(r2.error).toMatch(/duplicate/i);
    expect(r2.state.items.length).toBe(1);

    let r3 = addItem(r2.state, 'BUY    MILK', { dueDate: null, highPriority: false }, clock);
    expect(r3.error).toMatch(/duplicate/i);
    expect(r3.state.items.length).toBe(1);
  });

  it('considers dueDate when checking duplicates', () => {
    const state = createUiState();
    const clock = createClock('Africa/Kampala', () => new Date('2025-09-30T09:00:00Z').getTime());

    let a = addItem(state, 'Pay bills', { dueDate: '2025-10-01', highPriority: false }, clock);
    expect(a.error).toBeUndefined();
    // Same text but different dueDate is NOT a duplicate
    let b = addItem(a.state, 'pay   bills', { dueDate: '2025-10-02', highPriority: false }, clock);
    expect(b.error).toBeUndefined();
    expect(b.state.items.length).toBe(2);
  });
});

describe('T005 due-today boundary using injected clock (Africa/Kampala)', () => {
  it('uses Kampala timezone for today calculation', () => {
    // 21:30 UTC on 2025-09-30 is 00:30 on 2025-10-01 in Kampala (UTC+3)
    const clock = createClock('Africa/Kampala', () => Date.parse('2025-09-30T21:30:00Z'));
    const state = createUiState();

    const add1 = addItem(state, 'Midnight task', { dueDate: '2025-10-01' }, clock);
    expect(add1.error).toBeUndefined();

    const todayItems = filterDueToday(add1.state, clock);
    expect(todayItems.map((t) => t.text)).toContain('Midnight task');
  });
});

describe('T006 invalid toggle/removal state', () => {
  it('does not change state and returns error for invalid toggle index', () => {
    const state = createUiState();
    const r1 = addItem(state, 'Task A');
    const before = r1.state.items.map((t) => ({ ...t }));
    const r2 = toggleItem(r1.state, 5); // invalid index
    expect(r2.error).toMatch(/invalid index/i);
    expect(r2.state.items).toEqual(before);
  });

  it('does not change state and returns error for invalid remove index', () => {
    const state = createUiState();
    const r1 = addItem(state, 'Task B');
    const before = r1.state.items.map((t) => ({ ...t }));
    const r2 = removeItem(r1.state, 3); // invalid index
    expect(r2.error).toMatch(/invalid index/i);
    expect(r2.state.items).toEqual(before);
  });
});

describe('helpers', () => {
  it('normalizeText lowercases and collapses internal whitespace', () => {
    expect(normalizeText('  Hello    World ')).toBe('hello world');
  });
});
