/**
 * ExpenseFilter Component
 * Provides UI controls for filtering expenses by category and month
 */

export function ExpenseFilter({ categories = [], onFilter = () => {}, initialFilters = {} }) {
  const [selectedCategory, setSelectedCategory] = React.useState(initialFilters.category || null);
  const [selectedMonth, setSelectedMonth] = React.useState(initialFilters.month || null);

  const handleCategoryChange = (e) => {
    const category = e.target.value || null;
    setSelectedCategory(category);
    onFilter({ category, month: selectedMonth });
  };

  const handleMonthChange = (e) => {
    const month = e.target.value ? parseInt(e.target.value, 10) : null;
    setSelectedMonth(month);
    onFilter({ category: selectedCategory, month });
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedMonth(null);
    onFilter({ category: null, month: null });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="expense-filters" data-testid="expense-filters">
      <div className="filter-group">
        <label htmlFor="category-filter">Category:</label>
        <select
          id="category-filter"
          name="category"
          value={selectedCategory || ''}
          onChange={handleCategoryChange}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="month-filter">Month:</label>
        <select
          id="month-filter"
          name="month"
          value={selectedMonth || ''}
          onChange={handleMonthChange}
          className="filter-select"
        >
          <option value="">All Months</option>
          {months.map((month, index) => (
            <option key={index} value={index + 1}>{month}</option>
          ))}
        </select>
      </div>

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

// Make React available if needed
import React from 'react';
