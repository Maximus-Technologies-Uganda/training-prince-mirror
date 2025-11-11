/**
 * Expense API Layer
 * Provides HTTP endpoints for expense operations
 * Used for integration testing and future REST API
 */

import { addExpense, calculateTotal, loadExpenses, saveExpenses } from './core.js';
import { mapRequestToExpense, formatErrorResponse, formatListResponse, formatSummaryResponse } from './mapper.js';
import { validateMonth } from './validator.js';

/**
 * Helper to write JSON response
 */
function writeJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/**
 * Handler for creating an expense
 */
export async function createExpense(req, res) {
  try {
    const mappedExpense = mapRequestToExpense(req.body);
    let expenses = loadExpenses();
    
    // Add ID to the expense
    const id = Date.now().toString();
    const expenseWithId = { ...mappedExpense, id, createdAt: new Date().toISOString() };
    
    expenses = addExpense(expenses, expenseWithId);
    saveExpenses(expenses);

    writeJsonResponse(res, 201, {
      id: expenseWithId.id,
      ...expenseWithId
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error, 400);
    writeJsonResponse(res, 400, errorResponse);
  }
}

/**
 * Handler for getting expenses
 */
export async function getExpenses(req, res) {
  try {
    const expenses = loadExpenses();
    const response = formatListResponse(expenses);
    writeJsonResponse(res, 200, response);
  } catch (error) {
    const errorResponse = formatErrorResponse(error, 400);
    writeJsonResponse(res, 400, errorResponse);
  }
}

/**
 * Handler for getting expense summary
 */
export async function getExpenseSummary(req, res) {
  try {
    const { month, category } = req.query;

    // Validate month parameter
    if (month) {
      validateMonth(month);
    }

    const expenses = loadExpenses();
    const filters = {};
    
    if (category) {
      filters.category = category;
    }
    if (month) {
      filters.month = Number(month);
    }

    const total = calculateTotal(expenses, filters);
    const filtered = expenses.filter(exp => {
      if (category && exp.category !== category) return false;
      if (month && exp.month && String(exp.month).padStart(2, '0') !== String(month).padStart(2, '0')) return false;
      return true;
    });

    const response = formatSummaryResponse(total, filtered.length, filters);
    writeJsonResponse(res, 200, response);
  } catch (error) {
    const errorResponse = formatErrorResponse(error, 400);
    writeJsonResponse(res, 400, errorResponse);
  }
}

/**
 * Handler for getting a specific expense
 */
export async function getExpenseById(req, res) {
  try {
    const { id } = req.params;
    const expenses = loadExpenses();
    const expense = expenses.find(exp => exp.id === id);

    if (!expense) {
      const errorResponse = formatErrorResponse(new Error('Expense not found'), 404);
      return writeJsonResponse(res, 404, errorResponse);
    }

    writeJsonResponse(res, 200, expense);
  } catch (error) {
    const errorResponse = formatErrorResponse(error, 400);
    writeJsonResponse(res, 400, errorResponse);
  }
}

/**
 * Handler for updating an expense
 */
export async function updateExpense(req, res) {
  try {
    const { id } = req.params;
    const mappedExpense = mapRequestToExpense(req.body);
    
    const expenses = loadExpenses();
    const index = expenses.findIndex(exp => exp.id === id);

    if (index === -1) {
      const errorResponse = formatErrorResponse(new Error('Expense not found'), 404);
      return writeJsonResponse(res, 404, errorResponse);
    }

    expenses[index] = { ...expenses[index], ...mappedExpense, updatedAt: new Date().toISOString() };
    saveExpenses(expenses);

    writeJsonResponse(res, 200, expenses[index]);
  } catch (error) {
    const errorResponse = formatErrorResponse(error, 400);
    writeJsonResponse(res, 400, errorResponse);
  }
}

/**
 * Handler for deleting an expense
 */
export async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    let expenses = loadExpenses();
    
    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) {
      const errorResponse = formatErrorResponse(new Error('Expense not found'), 404);
      return writeJsonResponse(res, 404, errorResponse);
    }

    const deleted = expenses[index];
    expenses.splice(index, 1);
    saveExpenses(expenses);

    writeJsonResponse(res, 200, { message: 'Expense deleted', deleted });
  } catch (error) {
    const errorResponse = formatErrorResponse(error, 400);
    writeJsonResponse(res, 400, errorResponse);
  }
}
