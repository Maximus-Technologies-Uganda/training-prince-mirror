/**
 * Expense Routes (T015-T017)
 * 
 * HTTP route handlers for GET /expenses, POST /expenses, and GET /expenses/summary endpoints.
 * Routes handle HTTP layer concerns; business logic delegated to ExpenseStore service.
 * 
 * Constitutional Principle I: Routes only handle HTTP layer, logic in service
 */

import { Router, Request, Response } from 'express';
import type { CreateExpenseRequest, Expense, ExpenseSummary, PaginatedExpenseResponse } from '../types/index.js';
import { validateExpenseBody, validateQuery } from '../middleware/validation.js';
import { CreateExpenseSchema, PaginationQuerySchema, ExpenseSummaryQuerySchema } from '../schemas/index.js';
import { expenseStore } from '../services/expenses.js';

const router = Router();

/**
 * GET /expenses Handler (T005)
 * 
 * Retrieves paginated expense records.
 * - Validates pagination query parameters (page, pageSize)
 * - Calls expenseStore.findExpenses() with pagination
 * - Returns 200 OK with wrapped response (data array and pagination metadata)
 * - Validation errors handled by error middleware → 400
 */
router.get(
  '/expenses',
  validateQuery(PaginationQuerySchema),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req: Request<any, any, any, { page: number; pageSize: number }>, res: Response<PaginatedExpenseResponse>) => {
    // Query parameters are already validated and typed by middleware
    const { page, pageSize } = req.query;

    // Get paginated expenses (no filters for GET /expenses)
    const response = expenseStore.findExpenses(undefined, { page, pageSize });

    // Return 200 OK with paginated response
    res.status(200).json(response);
  }
);

/**
 * POST /expenses Handler (T015)
 * 
 * Creates a new expense record.
 * - Validates request body against CreateExpenseSchema (T008 middleware)
 * - Calls expenseStore.create() to generate ID and store expense
 * - Returns 201 Created with expense details
 * - Validation errors handled by error middleware → 400
 */
router.post(
  '/expenses',
  validateExpenseBody(CreateExpenseSchema),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_req: Request<any, any, CreateExpenseRequest>, res: Response<Expense>) => {
    // Request body is already validated and typed by middleware
    const { amount, category, date } = _req.body;

    // Create expense in service layer
    const expense = expenseStore.create({
      amount,
      category,
      date
    });

    // Return 201 Created with expense data
    res.status(201).json(expense);
  }
);

/**
 * GET /expenses/summary Handler (T016)
 * 
 * Returns aggregated expense summary with optional filters.
 * - Validates query parameters (category, month) with ExpenseSummaryQuerySchema
 * - Calls expenseStore.summarize() to aggregate expenses
 * - Returns 200 OK with total, count, and filters
 * - Always returns 200 even if no expenses match filters (per spec)
 * - Validation errors handled by error middleware → 400
 */
router.get(
  '/expenses/summary',
  validateQuery(ExpenseSummaryQuerySchema),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req: Request<any, any, any, { category?: string; month?: string }>, res: Response<ExpenseSummary>) => {
    // Query parameters are already validated and typed by middleware
    const { category, month } = req.query;

    // Get aggregated summary with optional filters
    const summary = expenseStore.summarize({
      category,
      month
    });

    // Return 200 with summary data
    res.status(200).json(summary);
  }
);

export default router;

