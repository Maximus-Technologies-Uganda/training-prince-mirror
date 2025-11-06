# Contract: Expense UI Filtering

**Feature**: Wednesday UI Polishing - Expense and To-Do Filtering
**Component**: ExpenseFilter, ExpenseList (with filtering logic)
**Date**: October 22, 2025

---

## Component: ExpenseFilter

**Purpose**: Provide UI controls for users to filter expenses by category and month.

### Props

```javascript
{
  categories: string[],              // Array of unique categories from loaded expenses
  onFilter: (filterState) => void,   // Callback when filter changes
  initialFilters: {                   // (Optional) restore previous filters
    category: string | null,
    month: number | null
  }
}
```

### State

```javascript
{
  selectedCategory: string | null,    // null = "all categories"
  selectedMonth: number | null        // null = "all months", 1-12 for specific month
}
```

### Event Handlers

**onCategoryChange(category)**:
- User selects category from dropdown
- Emits: `onFilter({ category, month: this.state.selectedMonth })`
- Triggers list re-render with filtered data

**onMonthChange(month)**:
- User selects month from dropdown
- Emits: `onFilter({ category: this.state.selectedCategory, month })`
- Triggers list re-render with filtered data

**onClearFilters()**:
- User clicks "Clear Filters" button
- Resets state: `{ selectedCategory: null, selectedMonth: null }`
- Emits: `onFilter({ category: null, month: null })`
- List displays all expenses

### UI Elements

```html
<div class="expense-filters">
  <label>Category:</label>
  <select value={selectedCategory || ''} onChange={onCategoryChange}>
    <option value="">All Categories</option>
    {categories.map(cat => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>

  <label>Month:</label>
  <select value={selectedMonth || ''} onChange={onMonthChange}>
    <option value="">All Months</option>
    <option value="1">January</option>
    <!-- ... -->
    <option value="12">December</option>
  </select>

  <button onClick={onClearFilters}>Clear Filters</button>
</div>
```

### Performance Contract

- **Interaction latency**: < 50ms from user input to callback emission
- **Re-render latency**: < 300ms from filter change to list update visible on screen
- **No network calls**: Filtering is purely client-side

---

## Component: ExpenseList (Filter Integration)

**Purpose**: Render list of expenses, filtered by applied filter state.

### Props

```javascript
{
  expenses: [
    {
      id: number,
      description: string,
      amount: number,
      category: string,
      date: string (ISO 8601),
      timestamp: string (ISO 8601)
    }
  ],
  filterState: {
    category: string | null,
    month: number | null
  },
  onEmptyState: () => void   // Callback when no matches exist
}
```

### Filtering Algorithm

```javascript
// In component render or useMemo
const filteredExpenses = expenses.filter(expense => {
  // Category filter: null (all) or exact match
  const categoryMatch = !filterState.category || 
    expense.category === filterState.category;
  
  // Month filter: null (all) or extract and match month
  const monthMatch = !filterState.month || 
    new Date(expense.date).getMonth() + 1 === filterState.month;
  
  return categoryMatch && monthMatch;
});
```

### Empty State Detection

```javascript
if (filteredExpenses.length === 0) {
  return <ExpenseEmptyState 
    reason={hasAnyFilter ? 'filtered' : 'no-data'}
    onClearFilters={...}
  />;
}
```

### Render Output

- If filters match items: Display filtered list (< 300ms)
- If no matches: Call `onEmptyState()` + display empty state component
- If no data at all: Display empty state with "Add First Expense" CTA

---

## Component: ExpenseEmptyState

**Purpose**: Display friendly message when expense list is empty.

### Props

```javascript
{
  reason: 'filtered' | 'no-data',
  onAddExpense: () => void,         // Navigate to add form
  onClearFilters: () => void        // Clear filters and show all
}
```

### UI Structure

```html
<div class="empty-state">
  <!-- Icon: SVG inline or emoji -->
  <svg class="empty-icon"><!-- folder/inbox icon --></svg>
  
  <!-- Message based on reason -->
  {reason === 'filtered' && (
    <>
      <h2>No matching expenses found</h2>
      <p>Try adjusting your filters to find expenses</p>
      <button onClick={onClearFilters}>Clear Filters</button>
    </>
  )}
  
  {reason === 'no-data' && (
    <>
      <h2>No expenses yet</h2>
      <p>Start by adding your first expense</p>
      <button onClick={onAddExpense}>Add Your First Expense</button>
    </>
  )}
</div>
```

### Accessibility

- Icon has `aria-hidden="true"`
- Buttons have descriptive labels (not just icons)
- CTA button is keyboard accessible
- Focus visible on buttons

---

## Integration Flow

```
User Input
   ↓
ExpenseFilter.onCategoryChange() or onMonthChange()
   ↓
Emit: onFilter({ category, month })
   ↓
Parent component updates filterState
   ↓
ExpenseList receives new filterState prop
   ↓
Re-compute filteredExpenses with filter algorithm
   ↓
Render filtered list OR empty state
   ↓
User sees update (< 300ms)
```

---

## Test Contracts (TDD)

### Unit Test: filterExpensesByCategory

```javascript
describe('filterExpensesByCategory', () => {
  it('returns expenses matching selected category', () => {
    const expenses = [
      { category: 'Food', ... },
      { category: 'Transport', ... },
      { category: 'Food', ... }
    ];
    const result = filterExpensesByCategory(expenses, 'Food');
    expect(result).toHaveLength(2);
    expect(result.every(e => e.category === 'Food')).toBe(true);
  });
  
  it('returns all expenses when category is null', () => {
    // ...
  });
});
```

### Unit Test: filterExpensesByMonth

```javascript
describe('filterExpensesByMonth', () => {
  it('returns expenses from selected month', () => {
    const expenses = [
      { date: '2024-10-15', ... },
      { date: '2024-09-20', ... },
      { date: '2024-10-25', ... }
    ];
    const result = filterExpensesByMonth(expenses, 10);
    expect(result).toHaveLength(2);
  });
});
```

### Unit Test: filterExpensesByBoth

```javascript
describe('filterExpensesByBoth', () => {
  it('applies AND logic for category and month', () => {
    const expenses = [ /* mixed */ ];
    const result = filterExpensesByBoth(
      expenses,
      { category: 'Food', month: 10 }
    );
    expect(result.every(e => 
      e.category === 'Food' && 
      new Date(e.date).getMonth() + 1 === 10
    )).toBe(true);
  });
});
```

### E2E Test: Playwright (expense-filter.spec.ts)

```typescript
test('User filters expenses by category', async ({ page }) => {
  // Load page
  await page.goto('/expense');
  
  // Select category filter
  await page.selectOption('select[name="category"]', 'Food');
  
  // Verify list updates with only Food expenses
  const items = await page.$$('.expense-item');
  const categories = await page.$$eval(
    '.expense-item .category',
    els => els.map(e => e.textContent)
  );
  expect(categories.every(c => c === 'Food')).toBe(true);
});
```

---

*Contract completed by /plan command on 2025-10-22*
