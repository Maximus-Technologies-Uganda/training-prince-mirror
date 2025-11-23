"use client";

interface ExpensesHeaderProps {
  totalCount: number;
  lastUpdated?: number;
  onRefresh: () => Promise<unknown> | void;
  isRefreshing: boolean;
  onAddExpense?: () => void;
}

const timestampFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function ExpensesHeader({ totalCount, lastUpdated, onRefresh, isRefreshing, onAddExpense }: ExpensesHeaderProps) {
  const formattedTimestamp = lastUpdated
    ? timestampFormatter.format(lastUpdated)
    : "Just now";

  return (
    <header className="expenses-card__header">
      <div>
        <p className="muted">Chapter 6 · Day 2</p>
        <h1>Review team expenses</h1>
        <p className="muted">Monitoring {totalCount.toLocaleString()} line items in real time.</p>
      </div>
      <div className="expenses-card__actions">
        <div className="muted" aria-live="polite">
          Last refreshed {formattedTimestamp}
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </button>
        {onAddExpense ? (
          <button className="btn btn-muted" type="button" onClick={onAddExpense}>
            Add expense
          </button>
        ) : null}
      </div>
    </header>
  );
}
