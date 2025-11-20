"use client";

import { useExpenseFilters } from "@/hooks/useExpenseFilters";

const CATEGORY_OPTIONS = [
  { label: "All categories", value: "" },
  { label: "Food", value: "food" },
  { label: "Travel", value: "travel" },
  { label: "Office", value: "office" },
  { label: "Supplies", value: "supplies" },
];

interface ExpenseFiltersBarProps {
  onAddExpense: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function ExpenseFiltersBar({ onAddExpense, onRefresh, isRefreshing }: ExpenseFiltersBarProps) {
  const { filters, setCategory, setMonth, clearFilters } = useExpenseFilters();

  return (
    <section className="panel" aria-label="Expense filters">
      <div className="filters-grid">
        <label className="form-field">
          <span>Category</span>
          <select
            value={filters.category ?? ""}
            onChange={(event) => setCategory(event.target.value || null)}
            aria-label="Filter by category"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>Month</span>
          <input
            type="month"
            value={filters.month ?? ""}
            onChange={(event) => setMonth(event.target.value || null)}
            aria-label="Filter by month"
          />
        </label>
        <div className="filters-actions">
          <button type="button" className="btn ghost" onClick={clearFilters}>
            Clear filters
          </button>
          <button type="button" className="btn secondary" onClick={onRefresh} aria-busy={isRefreshing}>
            Refresh now
          </button>
          <button type="button" className="btn primary" onClick={onAddExpense}>
            Add expense
          </button>
        </div>
      </div>
    </section>
  );
}
