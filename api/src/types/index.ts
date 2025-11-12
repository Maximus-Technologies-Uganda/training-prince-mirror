/**
 * TypeScript Type Definitions
 * 
 * Central location for shared type definitions for Week 5 API endpoints.
 */

/**
 * Health Check Response Type (T004)
 */
export interface HealthCheckResponse {
  status: string;
  version: string;
  currentTime: string;
}

/**
 * Temperature Conversion Request Type (T004)
 */
export interface ConversionRequest {
  value: number;
  from: 'C' | 'F';
  to: 'C' | 'F';
}

/**
 * Temperature Conversion Response Type (T004)
 */
export interface ConversionResponse {
  value: number;
  unit: 'C' | 'F';
}

/**
 * Validation Error Response Type (T004)
 */
export interface ValidationErrorResponse {
  error: 'Validation failed';
  details: Array<{
    code?: string;
    path?: Array<string | number>;
    message: string;
  }>;
}

/**
 * Expense Type (T006)
 * Represents a single expense record with core attributes for tracking spending
 */
export interface Expense {
  id: string;        // UUID v4, auto-assigned by server
  amount: number;    // Positive number (> 0)
  category: string;  // Non-empty string
  date: string;      // ISO 8601 date (YYYY-MM-DD)
}

/**
 * Create Expense Request Type (T006)
 * Request body for POST /expenses endpoint
 */
export interface CreateExpenseRequest {
  amount: number;    // Must be > 0
  category: string;  // Must be non-empty
  date: string;      // Must be YYYY-MM-DD format
}

/**
 * Expense Summary Type (T006)
 * Represents aggregated expense data with optional filters applied
 */
export interface ExpenseSummary {
  total: number;     // Sum of amounts matching filter criteria
  count: number;     // Number of expenses matching filter criteria
  filters: {
    category?: string;  // If category filter applied
    month?: string;     // If month filter applied (YYYY-MM format)
  };
}

/**
 * Get Expense Summary Query Type (T006)
 * Query parameters for GET /expenses/summary endpoint
 */
export interface GetExpenseSummaryQuery {
  category?: string;  // Optional category filter
  month?: string;     // Optional month filter (YYYY-MM format)
}

/**
 * Expense API Error Response Type
 * Returns validation errors in standardized format
 */
export interface ExpenseErrorResponse {
  errors: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Pagination Metadata Type
 * Metadata about pagination state for GET /expenses response
 */
export interface PaginationMetadata {
  totalItems: number;    // Total count of expenses matching query, ≥ 0
  currentPage: number;   // Current page number, ≥ 1
  pageSize: number;      // Number of items per page, 1-100
  totalPages: number;     // Total number of pages, ≥ 0, calculated as Math.ceil(totalItems / pageSize)
}

/**
 * Paginated Expense Response Type
 * Wrapped response structure for GET /expenses endpoint with pagination metadata
 */
export interface PaginatedExpenseResponse {
  data: Expense[];              // Array of expense records
  pagination: PaginationMetadata; // Pagination information
}
