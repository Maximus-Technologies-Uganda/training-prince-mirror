"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useExpenseFilters } from "@/hooks/useExpenseFilters";
import { mapExpenseSummary, type ExpenseSummary } from "@/models/summary";
import type { ExpenseSummaryApiResponse } from "@/models/summary";
import { getJson } from "@/utils/http";
import { trackRefresh } from "@/utils/trackRefresh";

export function useExpenseSummaryQuery() {
  const { filters } = useExpenseFilters();

  const queryKey = useMemo(
    () => ["expenses-summary", filters.category, filters.month],
    [filters.category, filters.month],
  );

  const query = useQuery<ExpenseSummary, Error>({
    queryKey,
    queryFn: async () => {
      const response = await getJson<ExpenseSummaryApiResponse>("/expenses/summary", {
        category: filters.category,
        month: filters.month,
      });
      return mapExpenseSummary(response);
    },
    refetchOnWindowFocus: false,
  });

  const refresh = useCallback(
    async (source: "manual" | "auto" | "post-success" = "manual") => {
      await trackRefresh(
        { source, pane: "summary", filters },
        async () => {
          await query.refetch();
        },
      );
    },
    [filters, query],
  );

  return {
    ...query,
    refresh,
    isEmpty: (query.data?.count ?? 0) === 0,
  };
}
