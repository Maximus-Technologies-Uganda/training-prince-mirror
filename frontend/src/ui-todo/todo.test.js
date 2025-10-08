import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createClock } from './clock.js';
import {
  createUiState,
  addItem,
  toggleItem,
  removeItem,
  filterDueToday,
  filterHighPriority,
  getVisibleItems,
  normalizeText,
  initTodoUI,
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

describe('T005b high-priority filtering utilities', () => {
  it('returns only high priority items', () => {
    let state = createUiState();
    state = addItem(state, 'Normal task').state;
    state = addItem(state, 'High task', { highPriority: true }).state;
    const high = filterHighPriority(state);
    expect(high).toHaveLength(1);
    expect(high[0].text).toBe('High task');
  });

  it('getVisibleItems combines filters', () => {
    const clock = createClock('Africa/Kampala', () => Date.parse('2025-09-30T21:30:00Z'));
    let state = createUiState();
    state = addItem(state, 'Normal tomorrow', { dueDate: '2025-10-02' }, clock).state;
    state = addItem(state, 'High today', { dueDate: '2025-10-01', highPriority: true }, clock).state;
    const visible = getVisibleItems(state, { today: true, high: true }, clock);
    expect(visible).toHaveLength(1);
    expect(visible[0].text).toBe('High today');
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

  it('addItem requires non-empty text', () => {
    const state = createUiState();
    const result = addItem(state, '   ', {});
    expect(result.error).toMatch(/text is required/i);
    expect(result.state).toBe(state);
  });
});

describe('DOM wiring', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <div class="todo-controls">
          <input id="todo-input" />
          <input id="todo-due" />
          <input id="todo-high" type="checkbox" />
          <button id="todo-add" type="button">Add</button>
        </div>
        <p id="todo-helper"></p>
        <p id="todo-error" tabindex="-1"></p>
        <label><input id="filter-today" type="checkbox" /></label>
        <label><input id="filter-high" type="checkbox" /></label>
        <ul id="todo-list"></ul>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('surfaces error when adding empty task and focuses message', () => {
    initTodoUI();
    const addBtn = document.getElementById('todo-add');
    const error = document.getElementById('todo-error');
    const focusSpy = vi.spyOn(error, 'focus');

    addBtn.click();

    expect(error.textContent).toMatch(/text is required/i);
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it('adds task successfully and clears error', () => {
    initTodoUI();
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('todo-add');
    const error = document.getElementById('todo-error');

    input.value = 'Buy groceries';
    addBtn.click();

    expect(error.textContent).toBe('');
    const items = document.querySelectorAll('#todo-list li');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toContain('Buy groceries');
  });

  it('shows error for invalid date format', () => {
    initTodoUI();
    const input = document.getElementById('todo-input');
    const due = document.getElementById('todo-due');
    const addBtn = document.getElementById('todo-add');
    const error = document.getElementById('todo-error');

    input.value = 'Task with bad date';
    due.value = '2025/10/01';
    addBtn.click();

    expect(error.textContent).toMatch(/invalid date/i);
    expect(document.querySelectorAll('#todo-list li')).toHaveLength(0);
  });
});
