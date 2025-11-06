import './styles.css';
import { addExpense as coreAddExpense, calculateTotal } from '../../../src/expense/core.js';
import { filterExpensesByBoth } from '../utils/filterUtils.js';

export function createExpenseState() {
  return { 
    entries: [], 
    filter: 'all',
    filters: { category: null, month: null }  // New: support advanced filtering
  };
}

export function normalizeCategory(category) {
  return String(category ?? '').trim();
}

export function normalizeMonth(monthRaw) {
  if (monthRaw === undefined || monthRaw === null || String(monthRaw).trim() === '') {
    return null;
  }
  const monthNumber = Number(monthRaw);
  if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return 'INVALID';
  }
  return monthNumber;
}

export function addEntry(state, { amount, category, month, description }) {
  const nextState = state ?? createExpenseState();
  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount)) {
    return { state: nextState, error: 'Amount must be a number.' };
  }
  if (parsedAmount <= 0) {
    return { state: nextState, error: 'Amount must be greater than zero.' };
  }
  const normalizedCategory = normalizeCategory(category);
  if (!normalizedCategory) {
    return { state: nextState, error: 'Category is required.' };
  }
  const normalizedDescription = (description || '').trim();
  if (!normalizedDescription) {
    return { state: nextState, error: 'Description is required.' };
  }
  const normalizedMonth = normalizeMonth(month);
  if (normalizedMonth === 'INVALID') {
    return { state: nextState, error: 'Month must be an integer between 1 and 12.' };
  }

  const entry = {
    description: normalizedDescription,
    amount: parsedAmount,
    category: normalizedCategory,
    month: normalizedMonth,
    date: new Date().toISOString().split('T')[0],  // Add ISO date for filtering
    timestamp: new Date().toISOString()
  };

  const entries = coreAddExpense(nextState.entries, entry);
  return {
    state: { ...nextState, entries },
  };
}

export function setFilter(state, category) {
  const value = category && category !== 'all' ? category : 'all';
  return { ...state, filter: value };
}

export function setAdvancedFilter(state, filters) {
  return { 
    ...state, 
    filters: { 
      category: filters.category || null, 
      month: filters.month || null 
    }
  };
}

export function getVisibleEntries(state) {
  // Use new filtering logic with both category and month
  if (state.filters && (state.filters.category || state.filters.month)) {
    return filterExpensesByBoth(state.entries, state.filters);
  }
  
  // Fallback to old filtering for backward compatibility
  const current = state.filter;
  if (!current || current === 'all') {
    return state.entries;
  }
  return state.entries.filter((entry) => entry.category === current);
}

export function getCategories(entries) {
  const uniq = new Set(entries.map((entry) => entry.category));
  const cats = Array.from(uniq).sort((a, b) => a.localeCompare(b));
  return cats;
}

export function formatAmount(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatMonth(month) {
  if (month === null || month === undefined) {
    return '—';
  }
  return String(month).padStart(2, '0');
}

export function calculateTotalForFilter(entries, filter) {
  if (!entries.length) return 0;
  if (!filter || (typeof filter === 'string' && filter === 'all')) {
    return calculateTotal(entries, null);
  }
  if (typeof filter === 'string') {
    return calculateTotal(entries, { category: filter });
  }
  const f = {};
  if (filter.category) f.category = filter.category;
  if (filter.month != null) f.month = filter.month;
  return calculateTotal(entries, Object.keys(f).length ? f : null);
}

function getElements(root) {
  return {
    form: root.querySelector('#expense-form'),
    description: root.querySelector('#exp-description'),
    amount: root.querySelector('#exp-amount'),
    category: root.querySelector('#exp-category'),
    month: root.querySelector('#exp-month'),
    error: root.querySelector('#exp-error'),
    empty: root.querySelector('#exp-empty'),
    filter: root.querySelector('#exp-filter'),
    total: root.querySelector('#exp-total'),
    rows: root.querySelector('#exp-rows'),
    filterContainer: root.querySelector('#exp-filter-advanced')  // New
  };
}

function renderAdvancedFilters(state, els, onFilterChange) {
  if (!els.filterContainer) return;
  
  const categories = getCategories(state.entries);
  
  els.filterContainer.innerHTML = '';
  
  // Category filter
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'filter-group';
  const categoryLabel = document.createElement('label');
  categoryLabel.htmlFor = 'category-filter';
  categoryLabel.textContent = 'Category:';
  const categorySelect = document.createElement('select');
  categorySelect.id = 'category-filter';
  categorySelect.name = 'category';
  categorySelect.className = 'filter-select';
  const categoryDefaultOption = document.createElement('option');
  categoryDefaultOption.value = '';
  categoryDefaultOption.textContent = 'All Categories';
  categorySelect.appendChild(categoryDefaultOption);
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
  categorySelect.value = state.filters?.category || '';
  categorySelect.addEventListener('change', (e) => {
    onFilterChange({ category: e.target.value || null, month: state.filters?.month || null });
  });
  categoryDiv.appendChild(categoryLabel);
  categoryDiv.appendChild(categorySelect);
  
  // Month filter
  const monthDiv = document.createElement('div');
  monthDiv.className = 'filter-group';
  const monthLabel = document.createElement('label');
  monthLabel.htmlFor = 'month-filter';
  monthLabel.textContent = 'Month:';
  const monthSelect = document.createElement('select');
  monthSelect.id = 'month-filter';
  monthSelect.name = 'month';
  monthSelect.className = 'filter-select';
  const monthDefaultOption = document.createElement('option');
  monthDefaultOption.value = '';
  monthDefaultOption.textContent = 'All Months';
  monthSelect.appendChild(monthDefaultOption);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  months.forEach((month, index) => {
    const option = document.createElement('option');
    option.value = String(index + 1);
    option.textContent = month;
    monthSelect.appendChild(option);
  });
  monthSelect.value = state.filters?.month ? String(state.filters.month) : '';
  monthSelect.addEventListener('change', (e) => {
    const monthValue = e.target.value ? parseInt(e.target.value, 10) : null;
    onFilterChange({ category: state.filters?.category || null, month: monthValue });
  });
  monthDiv.appendChild(monthLabel);
  monthDiv.appendChild(monthSelect);
  
  // Clear filters button
  const clearDiv = document.createElement('div');
  clearDiv.className = 'filter-group';
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear Filters';
  clearBtn.className = 'clear-filters-btn';
  clearBtn.type = 'button';
  clearBtn.setAttribute('data-testid', 'clear-filters');
  clearBtn.addEventListener('click', () => {
    onFilterChange({ category: null, month: null });
  });
  clearDiv.appendChild(clearBtn);
  
  els.filterContainer.appendChild(categoryDiv);
  els.filterContainer.appendChild(monthDiv);
  els.filterContainer.appendChild(clearDiv);
}

function render(state, els) {
  if (!els.rows) return;
  els.rows.innerHTML = '';
  const visible = getVisibleEntries(state);

  visible.forEach((entry, idx) => {
    const row = document.createElement('tr');
    row.setAttribute('data-testid', 'expense-item');
    row.setAttribute('data-category', entry.category);
    row.setAttribute('data-date', entry.date || '');
    
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = entry.description || '';
    descriptionCell.setAttribute('data-label', 'Description');
    const amountCell = document.createElement('td');
    amountCell.textContent = formatAmount(entry.amount);
    amountCell.setAttribute('data-label', 'Amount');
    const categoryCell = document.createElement('td');
    categoryCell.textContent = entry.category;
    categoryCell.setAttribute('data-label', 'Category');
    const monthCell = document.createElement('td');
    monthCell.textContent = formatMonth(entry.month);
    monthCell.setAttribute('data-label', 'Month');
    const deleteCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('data-testid', 'delete-expense');
    deleteBtn.addEventListener('click', () => {
      const realIndex = state.entries.indexOf(entry);
      if (realIndex >= 0) {
        state.entries.splice(realIndex, 1);
        render(state, els);
      }
    });
    deleteCell.appendChild(deleteBtn);
    row.append(descriptionCell, amountCell, categoryCell, monthCell, deleteCell);
    els.rows.appendChild(row);
  });

  if (els.empty) {
    els.empty.textContent = visible.length === 0 ? 'No expenses found' : '';
  }

  if (els.total) {
    const total = calculateTotalForFilter(state.entries, state.filter);
    els.total.textContent = formatAmount(total);
  }

  if (els.filter) {
    const categories = getCategories(state.entries);
    const selected = els.filter.value;
    const existingOptions = Array.from(els.filter.querySelectorAll('option'))
      .filter((option) => option.value !== 'all')
      .map((option) => option.value);

    if (
      existingOptions.length !== categories.length ||
      !categories.every((cat) => existingOptions.includes(cat))
    ) {
      els.filter.innerHTML = '';
      const defaultOption = document.createElement('option');
      defaultOption.value = 'all';
      defaultOption.textContent = 'All categories';
      els.filter.appendChild(defaultOption);
      categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        els.filter.appendChild(option);
      });
    }

    if (selected && els.filter.value !== selected) {
      els.filter.value = selected;
    }
  }
}

export function createExpenseUi(root) {
  const els = getElements(root);
  if (!els.form || !els.amount || !els.category || !els.rows) {
    return;
  }

  let state = createExpenseState();
  render(state, els);

  const setError = (message) => {
    if (!els.error) return;
    els.error.textContent = message ?? '';
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setError('');

    const result = addEntry(state, {
      amount: els.amount.value,
      category: els.category.value,
      month: els.month.value,
      description: els.description.value,
    });

    if (result.error) {
      setError(result.error);
      return;
    }

    state = result.state;
    render(state, els);
    renderAdvancedFilters(state, els, handleAdvancedFilterChange);
    els.description.value = '';
    els.amount.value = '';
    els.category.value = '';
    els.month.value = '';
    els.description.focus();
  };

  const handleAdvancedFilterChange = (filters) => {
    state = setAdvancedFilter(state, filters);
    render(state, els);
    renderAdvancedFilters(state, els, handleAdvancedFilterChange);
  };

  els.form.addEventListener('submit', handleFormSubmit);

  els.filter?.addEventListener('change', (event) => {
    state = setFilter(state, event.target.value);
    render(state, els);
  });

  // Initial render of advanced filters
  renderAdvancedFilters(state, els, handleAdvancedFilterChange);

  return state;
}

export function initExpenseUI() {
  const root = document.getElementById('expense-app');
  if (!root) return;
  createExpenseUi(root);
}
