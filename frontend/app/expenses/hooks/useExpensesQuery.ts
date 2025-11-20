"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useExpenseFilters } from "@/hooks/useExpenseFilters";
import {
  mapPaginatedExpenseResponse,
  type PaginatedExpenseApiResponse,
  type PaginatedExpenseResponse,
} from "@/models/paginatedResponse";
import { getJson } from "@/utils/http";
import { trackRefresh } from "@/utils/trackRefresh";

interface UseExpensesQueryOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export function useExpensesQuery(options: UseExpensesQueryOptions = {}) {
  const { filters } = useExpenseFilters();
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [pageSize, setPageSize] = useState(options.initialPageSize ?? 20);

  const queryKey = useMemo(
    () => ["expenses", filters.category, filters.month, page, pageSize],
    [filters.category, filters.month, page, pageSize],
  );

  useEffect(() => {
    setPage(1);
  }, [filters.category, filters.month]);

  const query = useQuery<PaginatedExpenseResponse, Error>({
    queryKey,
    queryFn: async () => {
      const response = await getJson<PaginatedExpenseApiResponse>("/expenses", {
        page,
        pageSize,
        category: filters.category,
        month: filters.month,
      });
      return mapPaginatedExpenseResponse(response);
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  const refresh = useCallback(
    async (source: "manual" | "auto" | "post-success" = "manual") => {
      await trackRefresh(
        { source, pane: "list", filters },
        async () => {
          await query.refetch();
        },
      );
    },
    [filters, query],
  );

  return {
    ...query,
    page,
    pageSize,
    setPage,
    setPageSize: (value: number) => {
      const bounded = Math.min(100, Math.max(20, value));
      setPageSize(bounded);
      setPage(1);
    },
    refresh,
    isEmpty: query.data?.data?.length === 0,
  };
}
