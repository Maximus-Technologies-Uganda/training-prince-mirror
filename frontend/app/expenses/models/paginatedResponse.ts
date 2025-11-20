import type { Expense, ExpenseApiPayload } from "@/models/expense";
import { mapExpense } from "@/models/expense";

export interface PaginatedExpenseResponse {
  data: Expense[];
  pagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
  requestId?: string;
}

export interface PaginatedExpenseApiResponse {
  data: ExpenseApiPayload[];
  pagination: PaginatedExpenseResponse["pagination"];
  requestId?: string;
}

export function mapPaginatedExpenseResponse(payload: PaginatedExpenseApiResponse): PaginatedExpenseResponse {
  if (!payload.pagination) {
    throw new Error("Response missing pagination block");
  }
  if (payload.pagination.pageSize > 100) {
    console.warn("pageSize greater than 100 – UI will clamp to 100");
  }
  return {
    data: payload.data.map((expense) => mapExpense(expense)),
    pagination: payload.pagination,
    requestId: payload.requestId,
  };
}
