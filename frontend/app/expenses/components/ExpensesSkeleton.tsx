"use client";

import React from "react";

interface ExpensesSkeletonProps {
  rows?: number;
  label?: string;
}

export function ExpensesSkeleton({ rows = 8, label = "Loading expenses ledger" }: ExpensesSkeletonProps) {
  const headerPlaceholders = Array.from({ length: 5 });
  const rowPlaceholders = Array.from({ length: rows });
  const summaryPlaceholders = Array.from({ length: 3 });

  return (
    <div
      className="expenses-skeleton"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      data-testid="expenses-skeleton"
    >
      <span className="sr-only">{label}</span>
      <section className="expenses-card skeleton-card">
        <div className="skeleton-stack">
          <div className="skeleton-pill" />
          <div className="skeleton-title" />
          <div className="skeleton-subtitle" />
        </div>
        <div className="info-grid">
          {summaryPlaceholders.map((_, index) => (
            <div key={`summary-${index}`} className="info-tile skeleton-tile">
              <div className="skeleton-bar skeleton-bar--compact" />
              <div className="skeleton-bar skeleton-bar--wide" />
            </div>
          ))}
        </div>
      </section>
      <section className="expenses-card skeleton-card" aria-hidden="true">
        <div className="table-head skeleton-row">
          {headerPlaceholders.map((_, index) => (
            <div key={`header-${index}`} className="skeleton-bar skeleton-bar--compact" />
          ))}
        </div>
        <div className="skeleton-ledger">
          {rowPlaceholders.map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="skeleton-row">
              {headerPlaceholders.map((__, cellIndex) => {
                const className = ["skeleton-bar", cellIndex === headerPlaceholders.length - 1 ? "skeleton-bar--amount" : ""]
                  .filter(Boolean)
                  .join(" ");
                return <div key={`row-${rowIndex}-cell-${cellIndex}`} className={className} />;
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
