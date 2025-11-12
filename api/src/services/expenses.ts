/**
 * Expense Service (T012-T014)
 * 
 * Business logic and persistence layer for expense management.
 * Provides in-memory storage, creation, filtering, and aggregation capabilities.
 * 
 * Constitutional Principle I: Isolates business logic from HTTP layer
 */

import { randomUUID } from 'crypto';
import type { Expense, ExpenseSummary, CreateExpenseRequest, PaginatedExpenseResponse, PaginationMetadata } from '../types/index.js';

/**
 * ExpenseStore Class (T012-T014)
 * 
 * Manages expense data with in-memory storage for the duration of server session.
 * Provides methods for creation, retrieval, filtering, and aggregation.
 */
export class ExpenseStore {
  private expenses: Expense[] = [];

  /**
   * Create a new expense (T012)
   * 
   * @param request - CreateExpenseRequest with amount, category, and date
   * @returns Newly created Expense with assigned UUID
   */
  create(request: CreateExpenseRequest): Expense {
    const expense: Expense = {
      id: randomUUID(),
      amount: request.amount,
      category: request.category,
      date: request.date
    };
    
    this.expenses.push(expense);
    return expense;
  }

  /**
   * Get all expenses (T012)
   * 
   * @returns Copy of the expenses array
   */
  getAll(): Expense[] {
    return [...this.expenses];
  }

  /**
   * Filter expenses by optional category and/or month (T012)
   * 
   * @param category - Optional category filter (case-sensitive)
   * @param month - Optional month filter in YYYY-MM format
   * @returns Filtered array of expenses
   */
  filter(category?: string, month?: string): Expense[] {
    return this.expenses.filter(expense => {
      // Apply category filter if provided
      if (category !== undefined && expense.category !== category) {
        return false;
      }
      
      // Apply month filter if provided (check if date starts with YYYY-MM)
      if (month !== undefined && !expense.date.startsWith(month)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Summarize expenses with optional filters (T013)
   * 
   * Aggregates expense data by calculating total amount and count,
   * with optional filtering by category and/or month (AND logic).
   * 
   * @param filters - Optional object with category and/or month filters
   * @returns ExpenseSummary with total, count, and applied filters
   */
  summarize(filters?: { category?: string; month?: string }): ExpenseSummary {
    const category = filters?.category;
    const month = filters?.month;
    
    // Filter expenses based on provided criteria
    const filtered = this.filter(category, month);
    
    // Calculate total and count
    const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);
    const count = filtered.length;
    
    // Build filters object to indicate which filters were applied
    const appliedFilters: { category?: string; month?: string } = {};
    if (category !== undefined) {
      appliedFilters.category = category;
    }
    if (month !== undefined) {
      appliedFilters.month = month;
    }
    
    return {
      total,
      count,
      filters: appliedFilters
    };
  }

  /**
   * Find expenses with optional filters and pagination (T004)
   * 
   * Retrieves paginated expense records with optional filtering by category and/or month.
   * Returns wrapped response with data array and pagination metadata.
   * 
   * @param filters - Optional object with category and/or month filters
   * @param pagination - Optional pagination parameters (page, pageSize)
   * @returns PaginatedExpenseResponse with data array and pagination metadata
   */
  findExpenses(
    filters?: { category?: string; month?: string },
    pagination?: { page: number; pageSize: number }
  ): PaginatedExpenseResponse {
    const category = filters?.category;
    const month = filters?.month;
    
    // Filter expenses based on provided criteria
    const filtered = this.filter(category, month);
    const totalItems = filtered.length;
    
    // Apply pagination defaults
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // Apply pagination to filtered results
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);
    
    // Build pagination metadata
    const paginationMetadata: PaginationMetadata = {
      totalItems,
      currentPage: page,
      pageSize,
      totalPages
    };
    
    return {
      data: paginatedData,
      pagination: paginationMetadata
    };
  }

  /**
   * Clear all expenses (utility for testing)
   */
  clear(): void {
    this.expenses = [];
  }
}

/**
 * Singleton instance of ExpenseStore (T014)
 * Allows tests to reset state and routes to access shared store
 */
export const expenseStore = new ExpenseStore();

