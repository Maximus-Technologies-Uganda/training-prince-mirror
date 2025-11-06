/**
 * Filter Utilities for Expense and To-Do UI
 * Provides filtering functions for expenses and to-do items
 */

/**
 * Filter expenses by category
 * @param {Array<Object>} expenses - Array of expense objects
 * @param {string|null} category - Category to filter by, null for all categories
 * @returns {Array<Object>} Filtered expenses matching the category
 */
export function filterExpensesByCategory(expenses, category) {
  if (!category) return expenses;
  return expenses.filter(expense => expense.category === category);
}

/**
 * Filter expenses by month
 * @param {Array<Object>} expenses - Array of expense objects
 * @param {number|null} month - Month to filter by (1-12), null for all months
 * @returns {Array<Object>} Filtered expenses matching the month
 */
export function filterExpensesByMonth(expenses, month) {
  if (!month) return expenses;
  return expenses.filter(expense => {
    const expenseMonth = new Date(expense.date).getMonth() + 1;
    return expenseMonth === month;
  });
}

/**
 * Filter expenses by both category and month (AND logic)
 * @param {Array<Object>} expenses - Array of expense objects
 * @param {Object} filters - Filter object with category and month
 * @param {string|null} filters.category - Category to filter by
 * @param {number|null} filters.month - Month to filter by (1-12)
 * @returns {Array<Object>} Filtered expenses matching both filters
 */
export function filterExpensesByBoth(expenses, filters) {
  let result = expenses;
  
  if (filters.category) {
    result = result.filter(expense => expense.category === filters.category);
  }
  
  if (filters.month) {
    result = result.filter(expense => {
      const expenseMonth = new Date(expense.date).getMonth() + 1;
      return expenseMonth === filters.month;
    });
  }
  
  return result;
}

/**
 * Filter to-do items by status
 * @param {Array<Object>} todos - Array of to-do objects
 * @param {string} status - Status to filter by: 'all', 'pending', or 'completed'
 * @returns {Array<Object>} Filtered to-dos matching the status
 */
export function filterTodosByStatus(todos, status) {
  if (status === 'all' || !status) return todos;
  return todos.filter(todo => {
    if (status === 'pending') return !todo.completed;
    if (status === 'completed') return todo.completed;
    return true;
  });
}

/**
 * Filter to-do items by priority
 * @param {Array<Object>} todos - Array of to-do objects
 * @param {string|null} priority - Priority to filter by ('High', 'Medium', 'Low'), null for all
 * @returns {Array<Object>} Filtered to-dos matching the priority
 */
export function filterTodosByPriority(todos, priority) {
  if (!priority) return todos;
  return todos.filter(todo => todo.priority === priority);
}

/**
 * Filter to-do items by both status and priority (AND logic)
 * @param {Array<Object>} todos - Array of to-do objects
 * @param {Object} filters - Filter object with status and priority
 * @param {string} filters.status - Status: 'all', 'pending', or 'completed'
 * @param {string|null} filters.priority - Priority: 'High', 'Medium', 'Low', or null
 * @returns {Array<Object>} Filtered to-dos matching both filters
 */
export function filterTodosByBoth(todos, filters) {
  let result = todos;
  
  // Apply status filter
  if (filters.status && filters.status !== 'all') {
    result = result.filter(todo => {
      if (filters.status === 'pending') return !todo.completed;
      if (filters.status === 'completed') return todo.completed;
      return true;
    });
  }
  
  // Apply priority filter
  if (filters.priority) {
    result = result.filter(todo => todo.priority === filters.priority);
  }
  
  return result;
}

/**
 * Detect if filtered items result in an empty state
 * @param {Array<Object>} items - Array of items (expenses or to-dos)
 * @param {Object} filters - Filter object applied to items
 * @returns {boolean} True if items is empty, false otherwise
 */
export function detectEmptyState(items, filters) {
  return items.length === 0;
}

/**
 * Reset all filters to default state
 * @returns {Object} Default filter state
 */
export function resetFilters() {
  return {
    category: null,
    month: null,
    status: 'all',
    priority: null
  };
}
