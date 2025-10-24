import React from 'react';

/**
 * TodoEmptyState Component
 * Displays friendly message when to-do list is empty
 */

export function TodoEmptyState({ reason = 'no-data', onAddTodo = () => {}, onClearFilters = () => {} }) {
  const isFiltered = reason === 'filtered';

  return (
    <div className="empty-state" data-testid="empty-state">
      {/* Icon: SVG checkmark graphic */}
      <svg className="empty-icon" aria-hidden="true" viewBox="0 0 24 24" width="64" height="64">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" 
              fill="currentColor" opacity="0.5" />
      </svg>

      {isFiltered ? (
        <>
          <h2 className="empty-title">No matching tasks found</h2>
          <p className="empty-description">Try adjusting your filters to find tasks</p>
          <button
            onClick={onClearFilters}
            className="empty-cta-button"
            aria-label="Clear all filters and show all tasks"
          >
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <h2 className="empty-title">No tasks yet</h2>
          <p className="empty-description">Create your first task to get started</p>
          <button
            onClick={onAddTodo}
            className="empty-cta-button"
            aria-label="Navigate to create new task form"
          >
            Create Your First Task
          </button>
        </>
      )}
    </div>
  );
}
