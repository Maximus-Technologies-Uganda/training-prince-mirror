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
    filters: { status: 'all', priority: null }
  };
}

function saveStateToLocalStorage(state) {
  try {
    localStorage.setItem('todo-ui-state', JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save todo state to localStorage:', error);
  }
}

function loadStateFromLocalStorage() {
  try {
    const saved = localStorage.getItem('todo-ui-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { items: parsed.items || [], filters: parsed.filters || { status: 'all', priority: null } };
    }
  } catch (error) {
    console.warn('Failed to load todo state from localStorage:', error);
  }
  return createUiState();
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
    filterAll: document.getElementById('filter-all'),
    filterActive: document.getElementById('filter-active'),
    filterCompleted: document.getElementById('filter-completed'),
    taskCount: document.getElementById('task-count'),
    filterContainer: document.getElementById('todo-filter-advanced')
  };
}

function renderAdvancedFilters(state, elements, onFilterChange) {
  if (!elements.filterContainer) return;
  
  elements.filterContainer.innerHTML = '';
  
  // Status filter buttons
  const statusDiv = document.createElement('div');
  statusDiv.className = 'filter-group status-filters';
  const statusLabel = document.createElement('label');
  statusLabel.className = 'filter-label';
  statusLabel.textContent = 'Status:';
  statusDiv.appendChild(statusLabel);
  
  const statusTabs = document.createElement('div');
  statusTabs.className = 'status-tabs';
  
  ['all', 'pending', 'completed'].forEach(status => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `status-tab ${state.filters?.status === status ? 'active' : ''}`;
    btn.setAttribute('data-testid', `filter-${status}`);
    btn.textContent = status === 'all' ? 'All' : status === 'pending' ? 'Pending' : 'Completed';
    btn.addEventListener('click', () => {
      onFilterChange({ status, priority: state.filters?.priority });
    });
    statusTabs.appendChild(btn);
  });
  
  statusDiv.appendChild(statusTabs);
  
  // Priority filter dropdown
  const priorityDiv = document.createElement('div');
  priorityDiv.className = 'filter-group';
  const priorityLabel = document.createElement('label');
  priorityLabel.htmlFor = 'priority-filter';
  priorityLabel.textContent = 'Priority:';
  const prioritySelect = document.createElement('select');
  prioritySelect.id = 'priority-filter';
  prioritySelect.name = 'priority';
  prioritySelect.className = 'filter-select';
  
  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'High', label: 'High' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' }
  ];
  
  priorityOptions.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    prioritySelect.appendChild(option);
  });
  
  prioritySelect.value = state.filters?.priority || '';
  prioritySelect.addEventListener('change', (e) => {
    onFilterChange({ status: state.filters?.status || 'all', priority: e.target.value || null });
  });
  priorityDiv.appendChild(priorityLabel);
  priorityDiv.appendChild(prioritySelect);
  
  // Clear filters button
  const clearDiv = document.createElement('div');
  clearDiv.className = 'filter-group';
  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.textContent = 'Clear Filters';
  clearBtn.className = 'clear-filters-btn';
  clearBtn.setAttribute('data-testid', 'clear-filters');
  clearBtn.addEventListener('click', () => {
    onFilterChange({ status: 'all', priority: null });
  });
  clearDiv.appendChild(clearBtn);
  
  elements.filterContainer.appendChild(statusDiv);
  elements.filterContainer.appendChild(priorityDiv);
  elements.filterContainer.appendChild(clearDiv);
}

function renderList(state, elements, clock, setError, filter = 'all') {
  let visible = state.items;
  
  // Apply filter
  if (filter === 'active') {
    visible = visible.filter((t) => !t.completed);
  } else if (filter === 'completed') {
    visible = visible.filter((t) => t.completed);
  }
  
  // Apply priority filter if set
  if (state.filters?.priority === 'High') {
    visible = visible.filter((t) => t.highPriority === true);
  }
  
  elements.list.innerHTML = '';
  visible.forEach((t, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.setAttribute('data-testid', 'task-item');
    li.setAttribute('data-completed', String(t.completed));
    if (t.completed) {
      li.classList.add('completed');
    }
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.completed;
    checkbox.setAttribute('data-testid', 'task-checkbox');
    checkbox.setAttribute('aria-label', `${t.completed ? 'Mark incomplete' : 'Mark complete'}: ${t.text}`);
    checkbox.addEventListener('change', () => {
      // Find the real index in the full list
      const realIndex = state.items.indexOf(t);
      const r = toggleItem(state, realIndex);
      if (r.error) {
        setError(r.error);
        return;
      }
      Object.assign(state, r.state);
      saveStateToLocalStorage(state);
      setError('');
      renderList(state, elements, clock, setError, filter);
    });
    const textContainer = document.createElement('span');
    textContainer.className = 'todo-item__text';
    textContainer.textContent = t.text;
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.setAttribute('data-testid', 'delete-task');
    remove.setAttribute('aria-label', `Remove task: ${t.text}`);
    remove.addEventListener('click', () => {
      // Find the real index in the full list
      const realIndex = state.items.indexOf(t);
      const r = removeItem(state, realIndex);
      if (r.error) {
        setError(r.error);
        return;
      }
      Object.assign(state, r.state);
      saveStateToLocalStorage(state);
      setError('');
      renderList(state, elements, clock, setError, filter);
    });
    const actions = document.createElement('span');
    actions.className = 'todo-item__actions';
    actions.append(remove);
    li.append(checkbox, textContainer, actions);
    elements.list.appendChild(li);
  });
  
  // Update task count
  if (elements.taskCount) {
    elements.taskCount.textContent = visible.length;
  }
}

export function initTodoUI() {
  const elements = getElements();
  if (!elements.input || !elements.list) return;
  const clock = createClock('Africa/Kampala');
  const state = loadStateFromLocalStorage();
  let currentFilter = state.filters?.status || 'all';

  const setError = (message) => {
    if (!elements.error) return;
    elements.error.textContent = message ?? '';
    if (message) {
      elements.error.focus?.();
    }
  };

  const handleAdvancedFilterChange = (filters) => {
    state.filters = filters;
    currentFilter = filters.status;
    saveStateToLocalStorage(state);
    renderList(state, elements, clock, setError, currentFilter);
    renderAdvancedFilters(state, elements, handleAdvancedFilterChange);
  };

  renderList(state, elements, clock, setError, currentFilter);
  renderAdvancedFilters(state, elements, handleAdvancedFilterChange);

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
    saveStateToLocalStorage(state);
    elements.input.value = '';
    renderList(state, elements, clock, setError, currentFilter);
    renderAdvancedFilters(state, elements, handleAdvancedFilterChange);
    elements.input.focus();
  });

  elements.filterAll?.addEventListener('click', () => {
    currentFilter = 'all';
    state.filters.status = 'all';
    saveStateToLocalStorage(state);
    renderList(state, elements, clock, setError, currentFilter);
    renderAdvancedFilters(state, elements, handleAdvancedFilterChange);
  });
  
  elements.filterActive?.addEventListener('click', () => {
    currentFilter = 'active';
    state.filters.status = 'pending';
    saveStateToLocalStorage(state);
    renderList(state, elements, clock, setError, currentFilter);
    renderAdvancedFilters(state, elements, handleAdvancedFilterChange);
  });
  
  elements.filterCompleted?.addEventListener('click', () => {
    currentFilter = 'completed';
    state.filters.status = 'completed';
    saveStateToLocalStorage(state);
    renderList(state, elements, clock, setError, currentFilter);
    renderAdvancedFilters(state, elements, handleAdvancedFilterChange);
  });
}
