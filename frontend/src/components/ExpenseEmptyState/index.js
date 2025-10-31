import React from 'react';

/**
 * ExpenseEmptyState Component
 * Displays friendly message when expense list is empty
 */

export function ExpenseEmptyState({ reason = 'no-data', onAddExpense = () => {}, onClearFilters = () => {} }) {
  const isFiltered = reason === 'filtered';

  return (
    <div className="empty-state" data-testid="empty-state">
      {/* Icon: SVG folder/inbox graphic */}
      <svg className="empty-icon" aria-hidden="true" viewBox="0 0 24 24" width="64" height="64">
        <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" 
              fill="currentColor" opacity="0.5" />
      </svg>

      {isFiltered ? (
        <>
          <h2 className="empty-title">No matching expenses found</h2>
          <p className="empty-description">Try adjusting your filters to find expenses</p>
          <button
            onClick={onClearFilters}
            className="empty-cta-button"
            aria-label="Clear all filters and show all expenses"
          >
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <h2 className="empty-title">No expenses yet</h2>
          <p className="empty-description">Start by adding your first expense</p>
          <button
            onClick={onAddExpense}
            className="empty-cta-button"
            aria-label="Navigate to add new expense form"
          >
            Add Your First Expense
          </button>
        </>
      )}
    </div>
  );
}
