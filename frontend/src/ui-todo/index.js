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

  if (!normalized) {
    return { state, error: 'Task text is required.' };
  }

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

export function filterHighPriority(state) {
  return state.items.filter((t) => t.highPriority === true);
}

export function getVisibleItems(state, filters, clock) {
  let visible = state.items;
  if (filters.today) {
    visible = filterDueToday({ items: visible }, clock);
  }
  if (filters.high) {
    visible = visible.filter((t) => t.highPriority === true);
  }
  return visible;
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

function renderList(state, elements, clock, setError) {
  const filters = {
    today: elements.filterToday?.checked,
    high: elements.filterHigh?.checked,
  };
  const visible = getVisibleItems(state, filters, clock);
  elements.list.innerHTML = '';
  visible.forEach((t, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    const textContainer = document.createElement('span');
    textContainer.className = 'todo-item__text';
    textContainer.textContent = t.text;
    const toggle = document.createElement('button');
    toggle.textContent = t.completed ? 'Untoggle' : 'Toggle';
    toggle.setAttribute(
      'aria-label',
      `${t.completed ? 'Mark incomplete' : 'Mark complete'}: ${t.text}`,
    );
    toggle.addEventListener('click', () => {
      const r = toggleItem(state, index);
      if (r.error) {
        setError(r.error);
        return;
      }
      Object.assign(state, r.state);
      setError('');
      renderList(state, elements, clock, setError);
    });
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove task: ${t.text}`);
    remove.addEventListener('click', () => {
      const r = removeItem(state, index);
      if (r.error) {
        setError(r.error);
        return;
      }
      Object.assign(state, r.state);
      setError('');
      renderList(state, elements, clock, setError);
    });
    const actions = document.createElement('span');
    actions.className = 'todo-item__actions';
    actions.append(toggle, remove);
    li.append(textContainer, actions);
    elements.list.appendChild(li);
  });
}

export function initTodoUI() {
  const elements = getElements();
  if (!elements.input || !elements.list) return;
  const clock = createClock('Africa/Kampala');
  const state = createUiState();

  const setError = (message) => {
    if (!elements.error) return;
    elements.error.textContent = message ?? '';
    if (message) {
      elements.error.focus?.();
    }
  };

  renderList(state, elements, clock, setError);

  elements.addBtn?.addEventListener('click', () => {
    setError('');
    const text = elements.input.value;
    const dueDate = elements.due.value || null;
    const highPriority = Boolean(elements.high?.checked);
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      setError('Invalid date; expected YYYY-MM-DD.');
      return;
    }
    const r = addItem(state, text, { dueDate, highPriority }, clock);
    if (r.error) {
      setError(r.error);
      return;
    }
    Object.assign(state, r.state);
    elements.input.value = '';
    renderList(state, elements, clock, setError);
    elements.input.focus();
  });

  elements.filterToday?.addEventListener('change', () => {
    renderList(state, elements, clock, setError);
  });
  elements.filterHigh?.addEventListener('change', () => {
    renderList(state, elements, clock, setError);
  });
}
