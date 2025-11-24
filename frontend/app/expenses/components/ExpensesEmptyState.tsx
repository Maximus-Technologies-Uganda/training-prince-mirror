"use client";

import React from "react";

interface ExpensesEmptyStateProps {
  onAddExpense: () => void;
}

export function ExpensesEmptyState({ onAddExpense }: ExpensesEmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <img
        src="/illustrations/empty-ledger.svg"
        alt="Illustration of an empty ledger awaiting its first record"
        className="empty-state__illustration"
        loading="lazy"
      />
      <p className="muted">All systems are healthy, we just need your first entry.</p>
      <h3>No expenses found</h3>
      <p className="muted">
        Kick off Day 2 by drafting an expense. You can reference vendor, amount, and status before
        the workflow unlocks in Day 3.
      </p>
      <div className="empty-state__cta">
        <button
          className="btn btn-primary"
          type="button"
          onClick={onAddExpense}
          data-testid="empty-ledger-cta"
        >
          Add expense
        </button>
        <span className="muted" role="note">
          We’ll walk you through the full form inside the drawer.
        </span>
      </div>
    </div>
  );
}
