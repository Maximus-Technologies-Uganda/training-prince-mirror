import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export type ExpenseStatus = "PENDING" | "APPROVED" | "FLAGGED" | "REJECTED";

export interface Amount {
  currency: string;
  value: number;
}

export interface ExpenseDto {
  id: string;
  merchant: string;
  category?: string | null;
  purchaseDate: string;
  status: ExpenseStatus;
  amount: Amount;
  memo?: string | null;
}

export interface ExpenseRow {
  id: string;
  merchant: string;
  category: string;
  purchaseDate: string;
  formattedDate: string;
  formattedAmount: string;
  status: ExpenseStatus;
  amount: Amount;
  memo?: string | null;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function getCurrencyFormatter(currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
}

export function normalizeExpenses(payload: ExpenseDto[]): ExpenseRow[] {
  return payload
    .filter((expense) => expense.id && expense.purchaseDate)
    .map((expense) => {
      const formatter = getCurrencyFormatter(expense.amount.currency);
      return {
        ...expense,
        category: expense.category ?? "Uncategorized",
        formattedDate: dateFormatter.format(new Date(expense.purchaseDate)),
        formattedAmount: formatter.format(expense.amount.value / 100),
      };
    })
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
}

async function fetchExpenses(): Promise<ExpenseRow[]> {
  const response = await fetch("/api/expenses", {
    cache: "no-store",
  });

  if (response.status === 204) {
    return [];
  }

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: `Request failed with ${response.status}` }));
    throw new Error(errorBody.message ?? `Request failed with ${response.status}`);
  }

  const data = (await response.json()) as ExpenseDto[];
  return normalizeExpenses(data);
}

export function useExpensesQuery(): UseQueryResult<ExpenseRow[], Error> {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
