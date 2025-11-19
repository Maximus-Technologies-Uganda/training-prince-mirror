"use client";

import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ExpenseFilters } from "@/models/summary";
import { emitFilterTelemetry } from "@/utils/trackRefresh";

const ExpenseFiltersContext = createContext<ExpenseFiltersContextValue | null>(null);

export interface ExpenseFiltersContextValue {
  filters: ExpenseFilters;
  urlSearchParams: string;
  queryKey: readonly [string, string | null, string | null];
  lastChangedAt: string;
  setCategory: (value: string | null) => void;
  setMonth: (value: string | null) => void;
  clearFilters: () => void;
}

const DEFAULT_FILTERS: ExpenseFilters = {
  category: null,
  month: null,
};

export function ExpenseFiltersProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ExpenseFilters>(() =>
    readFiltersFromParams(searchParams),
  );
  useEffect(() => {
    const nextFilters = readFiltersFromParams(searchParams);
    setFilters((current) =>
      current.category === nextFilters.category && current.month === nextFilters.month
        ? current
        : nextFilters,
    );
  }, [searchParams]);
  const [lastChangedAt, setLastChangedAt] = useState(() => new Date().toISOString());

  const persist = useCallback(
    (nextFilters: ExpenseFilters) => {
      const params = new URLSearchParams();
      if (nextFilters.category) params.set("category", nextFilters.category);
      if (nextFilters.month) params.set("month", nextFilters.month);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      setFilters(nextFilters);
      setLastChangedAt(new Date().toISOString());
      emitFilterTelemetry(nextFilters);
    },
    [pathname, router],
  );

  const setCategory = useCallback(
    (value: string | null) => {
      persist({ ...filters, category: value });
    },
    [filters, persist],
  );

  const setMonth = useCallback(
    (value: string | null) => {
      persist({ ...filters, month: value });
    },
    [filters, persist],
  );

  const clearFilters = useCallback(() => {
    persist(DEFAULT_FILTERS);
  }, [persist]);

  const urlSearchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.month) params.set("month", filters.month);
    return params.toString();
  }, [filters]);

  const queryKey = useMemo(
    () => ["expenses", filters.category, filters.month] as const,
    [filters.category, filters.month],
  );

  const value = useMemo<ExpenseFiltersContextValue>(
    () => ({
      filters,
      urlSearchParams,
      queryKey,
      lastChangedAt,
      setCategory,
      setMonth,
      clearFilters,
    }),
    [filters, urlSearchParams, queryKey, lastChangedAt, setCategory, setMonth, clearFilters],
  );

  return (
    <ExpenseFiltersContext.Provider value={value}>
      {children}
    </ExpenseFiltersContext.Provider>
  );
}

function readFiltersFromParams(params: ReturnType<typeof useSearchParams>): ExpenseFilters {
  const category = params?.get("category") || null;
  const month = params?.get("month") || null;
  return { category, month };
}

export function useExpenseFiltersContext(): ExpenseFiltersContextValue {
  const ctx = useContext(ExpenseFiltersContext);
  if (!ctx) {
    throw new Error("useExpenseFilters must be used within <ExpenseFiltersProvider />");
  }
  return ctx;
}
