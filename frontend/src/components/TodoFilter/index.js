import React from 'react';

/**
 * TodoFilter Component
 * Provides UI controls for filtering to-dos by status and priority
 */

export function TodoFilter({ onFilter = () => {} }) {
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedPriority, setSelectedPriority] = React.useState(null);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onFilter({ status, priority: selectedPriority });
  };

  const handlePriorityChange = (e) => {
    const priority = e.target.value || null;
    setSelectedPriority(priority);
    onFilter({ status: selectedStatus, priority });
  };

  const handleClearFilters = () => {
    setSelectedStatus('all');
    setSelectedPriority(null);
    onFilter({ status: 'all', priority: null });
  };

  return (
    <div className="todo-filters" data-testid="todo-filters">
      {/* Status filter tabs */}
      <div className="filter-group status-filters">
        <label className="filter-label">Status:</label>
        <div className="status-tabs">
          <button
            onClick={() => handleStatusChange('all')}
            className={`status-tab ${selectedStatus === 'all' ? 'active' : ''}`}
            data-testid="filter-all"
            aria-pressed={selectedStatus === 'all'}
          >
            All
          </button>
          <button
            onClick={() => handleStatusChange('pending')}
            className={`status-tab ${selectedStatus === 'pending' ? 'active' : ''}`}
            data-testid="filter-pending"
            aria-pressed={selectedStatus === 'pending'}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusChange('completed')}
            className={`status-tab ${selectedStatus === 'completed' ? 'active' : ''}`}
            data-testid="filter-completed"
            aria-pressed={selectedStatus === 'completed'}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Priority filter dropdown */}
      <div className="filter-group">
        <label htmlFor="priority-filter">Priority:</label>
        <select
          id="priority-filter"
          name="priority"
          value={selectedPriority || ''}
          onChange={handlePriorityChange}
          className="filter-select"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Clear Filters button */}
      <button
        onClick={handleClearFilters}
        className="clear-filters-btn"
        data-testid="clear-filters"
      >
        Clear Filters
      </button>
    </div>
  );
}
