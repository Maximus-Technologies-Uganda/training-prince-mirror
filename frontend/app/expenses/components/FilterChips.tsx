"use client";

import classNames from "classnames";
import { useExpenseFilters } from "@/hooks/useExpenseFilters";

interface FilterChip {
  id: string;
  label: string;
  onRemove: () => void;
}

export function FilterChips() {
  const { filters, clearFilters, setCategory, setMonth } = useExpenseFilters();

  const chips: FilterChip[] = [];
  if (filters.category) {
    chips.push({
      id: "category",
      label: `Category · ${filters.category}`,
      onRemove: () => setCategory(null),
    });
  }
  if (filters.month) {
    chips.push({
      id: "month",
      label: `Month · ${filters.month}`,
      onRemove: () => setMonth(null),
    });
  }

  return (
    <section className="panel" aria-live="polite" aria-label="Active filters" data-testid="filter-chips-panel">
      <header className="panel-header">
        <div>
          <h2>Filter chips</h2>
          <p className="muted">Chips mirror URL search params for QA reproducibility.</p>
        </div>
        {chips.length > 0 && (
          <button
            type="button"
            className="btn ghost"
            onClick={clearFilters}
            aria-label="Clear all filters"
            data-testid="clear-all-filters"
          >
            Clear all
          </button>
        )}
      </header>
      <div className="sr-only" role="status" aria-live="polite" data-testid="chips-announcement">
        {chips.length === 0 ? "No active filters" : `${chips.length} active filter${chips.length > 1 ? "s" : ""}`}
      </div>
      <div className={classNames("chips", { "chips--empty": chips.length === 0 })}>
        {chips.length === 0 ? (
          <p className="muted">No active filters</p>
        ) : (
          chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="chip"
              onClick={chip.onRemove}
              aria-label={`Remove filter ${chip.label}`}
              data-testid={`chip-${chip.id}`}
            >
              <span>{chip.label}</span>
              <span aria-hidden>×</span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
