"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExpenseApiPayload } from "@/models/expense";
import { mapExpense } from "@/models/expense";
import { postJson } from "@/utils/http";
import { trackRefresh } from "@/utils/trackRefresh";
import { useExpenseFilters } from "@/hooks/useExpenseFilters";
import type { PaginatedExpenseResponse } from "@/models/paginatedResponse";

export interface CreateExpenseInput {
  amount: number;
  category: string;
  date: string;
}

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();
  const { filters } = useExpenseFilters();

  return useMutation<ExpenseApiPayload, Error, CreateExpenseInput>({
    mutationFn: async (payload) => postJson<ExpenseApiPayload, CreateExpenseInput>("/expenses", payload),
    onSuccess: async (expense) => {
      const mapped = mapExpense(expense);
      queryClient.setQueryData<PaginatedExpenseResponse>(
        ["expenses", filters.category, filters.month, 1, 20],
  (current: PaginatedExpenseResponse | undefined) =>
          current
            ? {
                ...current,
                data: [mapped, ...current.data].slice(0, current.pagination.pageSize),
                pagination: {
                  ...current.pagination,
                  totalItems: current.pagination.totalItems + 1,
                },
              }
            : current,
      );
      await trackRefresh(
        { source: "post-success", pane: "drawer", filters },
        async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["expenses"] }),
            queryClient.invalidateQueries({ queryKey: ["expenses-summary"] }),
          ]);
        },
      );
    },
  });
}
