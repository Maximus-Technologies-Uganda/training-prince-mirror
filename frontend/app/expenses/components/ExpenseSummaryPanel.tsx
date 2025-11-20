"use client";

import { formatCurrency } from "@/models/expense";
import type { ExpenseSummary } from "@/models/summary";
import { formatGeneratedAt } from "@/models/summary";
import type { UseQueryResult } from "@tanstack/react-query";

interface ExpenseSummaryPanelProps {
  query: UseQueryResult<ExpenseSummary, Error> & { isEmpty?: boolean };
  onRetry: () => void;
  onAddExpense: () => void;
}

export function ExpenseSummaryPanel({ query, onRetry, onAddExpense }: ExpenseSummaryPanelProps) {
  const requestId = (query.error as (Error & { requestId?: string }) | null)?.requestId;
  const isUpdating = query.fetchStatus === "fetching" && !query.isLoading;

  if (query.isLoading) {
    return (
      <section
        className="panel"
        aria-live="polite"
        aria-busy="true"
        aria-label="Expense summary loading state"
        data-testid="summary-loading"
      >
        <h2>Summary</h2>
        <p className="sr-only">Updating summary</p>
        <SummarySkeleton />
      </section>
    );
  }

  if (query.error) {
    return (
      <section className="panel" aria-live="assertive" aria-label="Expense summary error" data-testid="summary-error">
        <h2>Summary</h2>
        <div className="alert error">
          <div>
            <p className="alert-title">Failed to load summary</p>
            <p className="alert-body">{query.error.message}</p>
            {requestId && <p className="muted">Request ID: {requestId}</p>}
          </div>
          <button className="btn secondary" onClick={onRetry} type="button">
            Retry summary
          </button>
        </div>
      </section>
    );
  }

  if (query.isEmpty) {
    const filtersLabel = formatFiltersLabel(query.data?.filters);
    return (
      <section className="panel" aria-live="polite" aria-label="Expense summary empty state" data-testid="summary-empty">
        <h2>Summary</h2>
        <p className="muted">No summary data yet for {filtersLabel}.</p>
        <button className="btn primary" onClick={onAddExpense} type="button">
          Add an expense
        </button>
      </section>
    );
  }

  const summary = query.data;
  if (!summary) return null;

  return (
    <section className="panel" aria-label="Expense summary" data-testid="summary-success">
      <header className="panel-header">
        <div>
          <h2>Summary</h2>
          <p className="muted">Updated {formatGeneratedAt(summary.generatedAt)}</p>
        </div>
        {isUpdating && (
          <p className="muted" aria-live="polite" data-testid="summary-refreshing">
            Still working on the latest totals…
          </p>
        )}
      </header>
      <div className="summary-grid" role="status" aria-live="polite">
        <SummaryTile label="Total" value={formatCurrency(summary.total)} supporting="Sum of visible expenses" />
        <SummaryTile label="Count" value={`${summary.count.toLocaleString()} expenses`} supporting="Matches virtualized list" />
        <SummaryTile label="Filters" value={formatFiltersLabel(summary.filters)} supporting="Chips below mirror this state" />
      </div>
    </section>
  );
}

type SummaryTileProps = {
  label: string;
  value: string;
  supporting: string;
};

function SummaryTile({
  label,
  value,
  supporting,
}: SummaryTileProps) {
  return (
    <article className="summary-tile">
      <p className="muted">{label}</p>
      <p className="summary-value">{value}</p>
      <p className="muted">{supporting}</p>
    </article>
  );
}

function SummarySkeleton() {
  return (
    <div className="summary-grid" role="status" aria-live="polite">
      {Array.from({ length: 3 }).map((_, index) => (
        <article key={index} className="summary-tile skeleton" aria-hidden>
          <span />
          <span />
          <span />
        </article>
      ))}
    </div>
  );
}

function formatFiltersLabel(filters?: ExpenseSummary["filters"]) {
  if (!filters) return "All expenses";
  const category = filters.category ?? "All categories";
  const month = filters.month ? formatMonth(filters.month) : "Any month";
  if (!filters.category && !filters.month) {
    return "All expenses";
  }
  return `${category} · ${month}`;
}

function formatMonth(month: string) {
  if (!month) return "Any month";
  const [year, monthIndex] = month.split("-");
  if (!year || !monthIndex) return month;
  const date = new Date(Number(year), Number(monthIndex) - 1, 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}
