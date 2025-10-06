import { addTodo, toggleTodo, removeTodo } from '../../../src/todo/core.js';
import './styles.css';
import { createClock } from './clock.js';

export function normalizeText(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function createUiState() {
  return {
    items: [],
  };
}

export function addItem(state, text, opts = {}, clock) {
  const normalized = normalizeText(text);
  const dueDate = opts?.dueDate || null;
  const highPriority = Boolean(opts?.highPriority);

  const duplicate = state.items.some((t) => {
    const sameText = normalizeText(t.text) === normalized;
    const sameDue = (t.dueDate || null) === (dueDate || null);
    return sameText && sameDue;
  });
  if (duplicate) {
    return { state, error: 'Duplicate item: same text and due date.' };
  }

  // Store original-cased text; use normalized only for duplicate checks
  const afterAdd = addTodo(state.items, String(text).trim());
  const items = afterAdd.map((t, idx, arr) => {
    if (idx === arr.length - 1) {
      return { ...t, highPriority, dueDate };
    }
    return t;
  });

  return { state: { ...state, items } };
}

export function toggleItem(state, index) {
  if (index < 0 || index >= state.items.length) {
    return { state, error: 'Invalid index' };
  }
  const items = toggleTodo(state.items, index);
  return { state: { ...state, items } };
}

export function removeItem(state, index) {
  if (index < 0 || index >= state.items.length) {
    return { state, error: 'Invalid index' };
  }
  const items = removeTodo(state.items, index);
  return { state: { ...state, items } };
}

export function filterDueToday(state, clock) {
  if (!clock || typeof clock.todayIso !== 'function') {
    return state.items;
  }
  const today = clock.todayIso();
  return state.items.filter((t) => t.dueDate === today);
}

function getElements() {
  return {
    input: document.getElementById('todo-input'),
    due: document.getElementById('todo-due'),
    high: document.getElementById('todo-high'),
    addBtn: document.getElementById('todo-add'),
    error: document.getElementById('todo-error'),
    list: document.getElementById('todo-list'),
    filterToday: document.getElementById('filter-today'),
    filterHigh: document.getElementById('filter-high'),
  };
}

function renderList(state, elements, clock) {
  const all = state.items;
  const today = elements.filterToday?.checked;
  const high = elements.filterHigh?.checked;
  let visible = all;
  if (today) {
    visible = filterDueToday({ items: visible }, clock);
  }
  if (high) {
    visible = visible.filter((t) => t.highPriority === true);
  }
  elements.list.innerHTML = '';
  visible.forEach((t, index) => {
    const li = document.createElement('li');
    li.textContent = t.text;
    const toggle = document.createElement('button');
    toggle.textContent = t.completed ? 'Untoggle' : 'Toggle';
    toggle.addEventListener('click', () => {
      const r = toggleItem(state, index);
      if (r.error) {
        elements.error.textContent = r.error;
        return;
      }
      Object.assign(state, r.state);
      renderList(state, elements, clock);
    });
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      const r = removeItem(state, index);
      if (r.error) {
        elements.error.textContent = r.error;
        return;
      }
      Object.assign(state, r.state);
      renderList(state, elements, clock);
    });
    li.append(' ', toggle, ' ', remove);
    elements.list.appendChild(li);
  });
}

export function initTodoUI() {
  const elements = getElements();
  if (!elements.input || !elements.list) return;
  const clock = createClock('Africa/Kampala');
  const state = createUiState();

  renderList(state, elements, clock);

  elements.addBtn?.addEventListener('click', () => {
    elements.error.textContent = '';
    const text = elements.input.value;
    const dueDate = elements.due.value || null;
    const highPriority = Boolean(elements.high?.checked);
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      elements.error.textContent = 'Invalid date; expected YYYY-MM-DD.';
      return;
    }
    const r = addItem(state, text, { dueDate, highPriority }, clock);
    if (r.error) {
      elements.error.textContent = r.error;
      return;
    }
    Object.assign(state, r.state);
    elements.input.value = '';
    renderList(state, elements, clock);
  });

  elements.filterToday?.addEventListener('change', () => renderList(state, elements, clock));
  elements.filterHigh?.addEventListener('change', () => renderList(state, elements, clock));
}
