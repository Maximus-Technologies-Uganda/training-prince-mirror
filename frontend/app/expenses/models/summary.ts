import { format } from "date-fns";

export interface ExpenseSummary {
  total: number;
  count: number;
  filters: ExpenseFilters;
  generatedAt: string;
}

export interface ExpenseFilters {
  category: string | null;
  month: string | null;
}

export interface ExpenseSummaryApiResponse {
  total: number;
  count: number;
  filters?: Partial<ExpenseFilters>;
  generatedAt?: string;
}

export interface UIStateEvidence {
  state: "loading" | "empty" | "error" | "success";
  scenarioId: string;
  copyDeckRef: string;
  screenshotPath: string;
  ariaNotes: string;
  frReference: string;
}

export function mapExpenseSummary(payload: ExpenseSummaryApiResponse): ExpenseSummary {
  if (payload.total < 0 || payload.count < 0) {
    throw new Error("Summary totals cannot be negative");
  }
  const generatedAt = payload.generatedAt ?? new Date().toISOString();
  return {
    total: payload.total,
    count: payload.count,
    filters: {
      category: payload.filters?.category ?? null,
      month: payload.filters?.month ?? null,
    },
    generatedAt,
  };
}

export function formatGeneratedAt(generatedAt: string) {
  return format(new Date(generatedAt), "MMM d, yyyy h:mm a");
}
