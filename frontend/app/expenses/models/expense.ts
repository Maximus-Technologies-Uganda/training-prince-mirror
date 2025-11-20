import { format } from "date-fns";

export interface ExpenseApiPayload {
  id: string;
  amount: number;
  category: string;
  date: string;
}

export interface Expense extends ExpenseApiPayload {
  formattedAmount: string;
  formattedDate: string;
  isVirtualizedVisible: boolean;
}

export function formatCurrency(amount: number, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function mapExpense(payload: ExpenseApiPayload, locale = "en-US"): Expense {
  validateExpensePayload(payload);
  return {
    ...payload,
    formattedAmount: formatCurrency(payload.amount, "USD", locale),
    formattedDate: format(new Date(payload.date), "MMM d, yyyy"),
    isVirtualizedVisible: true,
  };
}

export function validateExpensePayload(payload: ExpenseApiPayload) {
  if (!payload.id) throw new Error("Expense missing id");
  if (payload.amount <= 0) throw new Error("Expense amount must be positive");
  if (!payload.category) throw new Error("Expense missing category");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) {
    throw new Error("Expense date must be YYYY-MM-DD");
  }
}
