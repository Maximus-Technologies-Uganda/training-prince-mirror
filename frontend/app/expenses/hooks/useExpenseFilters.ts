"use client";

import { useExpenseFiltersContext } from "@/context/ExpenseFiltersProvider";

export function useExpenseFilters() {
  return useExpenseFiltersContext();
}
