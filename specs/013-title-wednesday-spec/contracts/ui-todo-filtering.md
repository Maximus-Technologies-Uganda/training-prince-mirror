# Contract: To-Do UI Filtering

**Feature**: Wednesday UI Polishing - Expense and To-Do Filtering
**Component**: TodoFilter, TodoList (with filtering logic)
**Date**: October 22, 2025

---

## Component: TodoFilter

**Purpose**: Provide UI controls for users to filter to-do items by status and priority.

### Props

```javascript
{
  onFilter: (filterState) => void,   // Callback when filter changes
  initialFilters: {                   // (Optional) restore previous filters
    status: 'all' | 'pending' | 'completed',
    priority: 'High' | 'Medium' | 'Low' | null
  }
}
```

### State

```javascript
{
  selectedStatus: 'all' | 'pending' | 'completed',  // default: 'all'
  selectedPriority: 'High' | 'Medium' | 'Low' | null // default: null
}
```

### Event Handlers

**onStatusChange(status)**:
- User clicks status button/tab ('All', 'Pending', 'Completed')
- Emits: `onFilter({ status, priority: this.state.selectedPriority })`
- Triggers list re-render with filtered data

**onPriorityChange(priority)**:
- User selects priority from dropdown
- Emits: `onFilter({ status: this.state.selectedStatus, priority })`
- Triggers list re-render with filtered data

**onClearFilters()**:
- User clicks "Clear Filters" button
- Resets state: `{ selectedStatus: 'all', selectedPriority: null }`
- Emits: `onFilter({ status: 'all', priority: null })`
- List displays all to-do items

### UI Elements

```html
<div class="todo-filters">
  <!-- Status Filter: Button Tabs -->
  <div class="status-filter">
    <label>Status:</label>
    <button 
      className={selectedStatus === 'all' ? 'active' : ''}
      onClick={() => onStatusChange('all')}>
      All
    </button>
    <button 
      className={selectedStatus === 'pending' ? 'active' : ''}
      onClick={() => onStatusChange('pending')}>
      Pending
    </button>
    <button 
      className={selectedStatus === 'completed' ? 'active' : ''}
      onClick={() => onStatusChange('completed')}>
      Completed
    </button>
  </div>

  <!-- Priority Filter: Dropdown -->
  <label>Priority:</label>
  <select value={selectedPriority || ''} onChange={onPriorityChange}>
    <option value="">All Priorities</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>

  <button onClick={onClearFilters}>Clear Filters</button>
</div>
```

### Performance Contract

- **Interaction latency**: < 50ms from user input to callback emission
- **Re-render latency**: < 300ms from filter change to list update visible on screen
- **No network calls**: Filtering is purely client-side

---

## Component: TodoList (Filter Integration)

**Purpose**: Render list of to-do items, filtered by applied filter state.

### Props

```javascript
{
  todos: [
    {
      id: number,
      title: string,
      description: string,
      status: 'pending' | 'completed',
      priority: 'High' | 'Medium' | 'Low',
      createdAt: string (ISO 8601)
    }
  ],
  filterState: {
    status: 'all' | 'pending' | 'completed',
    priority: 'High' | 'Medium' | 'Low' | null
  },
  onEmptyState: () => void   // Callback when no matches exist
}
```

### Filtering Algorithm

```javascript
// In component render or useMemo
const filteredTodos = todos.filter(todo => {
  // Status filter: 'all' (no filter) or exact match
  const statusMatch = filterState.status === 'all' || 
    todo.status === filterState.status;
  
  // Priority filter: null (all) or exact match
  const priorityMatch = !filterState.priority || 
    todo.priority === filterState.priority;
  
  return statusMatch && priorityMatch;
});
```

### Empty State Detection

```javascript
if (filteredTodos.length === 0) {
  return <TodoEmptyState 
    reason={filterState.status === 'all' && !filterState.priority ? 'no-data' : 'filtered'}
    onClearFilters={...}
  />;
}
```

### Render Output

- If filters match items: Display filtered list (< 300ms)
- If no matches: Call `onEmptyState()` + display empty state component
- If no data at all: Display empty state with "Create First Task" CTA

---

## Component: TodoEmptyState

**Purpose**: Display friendly message when to-do list is empty.

### Props

```javascript
{
  reason: 'filtered' | 'no-data',
  onAddTodo: () => void,            // Navigate to add form
  onClearFilters: () => void        // Clear filters and show all
}
```

### UI Structure

```html
<div class="empty-state">
  <!-- Icon: SVG inline or emoji -->
  <svg class="empty-icon"><!-- checklist/inbox icon --></svg>
  
  <!-- Message based on reason -->
  {reason === 'filtered' && (
    <>
      <h2>No matching tasks found</h2>
      <p>Try adjusting your filters to find tasks</p>
      <button onClick={onClearFilters}>Clear Filters</button>
    </>
  )}
  
  {reason === 'no-data' && (
    <>
      <h2>No tasks yet</h2>
      <p>Create your first task to get started</p>
      <button onClick={onAddTodo}>Create Your First Task</button>
    </>
  )}
</div>
```

### Accessibility

- Icon has `aria-hidden="true"`
- Buttons have descriptive labels
- CTA button is keyboard accessible
- Focus visible on buttons

---

## Status Filter Behavior

### 'All' Tab (Default)
- Shows tasks with any status (pending OR completed)
- Equivalent to: `status === 'all'` (no filtering)
- Used when user wants to see everything

### 'Pending' Tab
- Shows only `status === 'pending'` tasks
- Excludes completed tasks
- Default view for most workflows

### 'Completed' Tab
- Shows only `status === 'completed'` tasks
- Excludes pending tasks
- View completed history

---

## Priority Filter Behavior

### Null/All Priorities (Default)
- Shows tasks with any priority (High OR Medium OR Low)
- Equivalent to: `priority === null` (no filtering)

### 'High' Priority
- Shows only `priority === 'High'` tasks
- Exact match required

### 'Medium' Priority
- Shows only `priority === 'Medium'` tasks

### 'Low' Priority
- Shows only `priority === 'Low'` tasks

---

## Integration Flow

```
User Input
   ↓
TodoFilter.onStatusChange() or onPriorityChange()
   ↓
Emit: onFilter({ status, priority })
   ↓
Parent component updates filterState
   ↓
TodoList receives new filterState prop
   ↓
Re-compute filteredTodos with filter algorithm
   ↓
Render filtered list OR empty state
   ↓
User sees update (< 300ms)
```

---

## Test Contracts (TDD)

### Unit Test: filterTodosByStatus

```javascript
describe('filterTodosByStatus', () => {
  it('returns todos matching selected status', () => {
    const todos = [
      { status: 'pending', ... },
      { status: 'completed', ... },
      { status: 'pending', ... }
    ];
    const result = filterTodosByStatus(todos, 'pending');
    expect(result).toHaveLength(2);
    expect(result.every(t => t.status === 'pending')).toBe(true);
  });
  
  it('returns all todos when status is "all"', () => {
    const todos = [ /* mixed statuses */ ];
    const result = filterTodosByStatus(todos, 'all');
    expect(result).toEqual(todos);
  });
});
```

### Unit Test: filterTodosByPriority

```javascript
describe('filterTodosByPriority', () => {
  it('returns todos matching selected priority', () => {
    const todos = [
      { priority: 'High', ... },
      { priority: 'Medium', ... },
      { priority: 'High', ... }
    ];
    const result = filterTodosByPriority(todos, 'High');
    expect(result).toHaveLength(2);
    expect(result.every(t => t.priority === 'High')).toBe(true);
  });
  
  it('returns all todos when priority is null', () => {
    const todos = [ /* mixed priorities */ ];
    const result = filterTodosByPriority(todos, null);
    expect(result).toEqual(todos);
  });
});
```

### Unit Test: filterTodosByBoth

```javascript
describe('filterTodosByBoth', () => {
  it('applies AND logic for status and priority', () => {
    const todos = [ /* mixed */ ];
    const result = filterTodosByBoth(todos, {
      status: 'pending',
      priority: 'High'
    });
    expect(result.every(t => 
      t.status === 'pending' && t.priority === 'High'
    )).toBe(true);
  });
  
  it('shows all todos when status is "all" and priority is null', () => {
    const todos = [ /* mixed */ ];
    const result = filterTodosByBoth(todos, {
      status: 'all',
      priority: null
    });
    expect(result).toEqual(todos);
  });
});
```

### E2E Test: Playwright (todo-filter.spec.ts)

```typescript
test('User filters todos by status and priority', async ({ page }) => {
  // Load page
  await page.goto('/todo');
  
  // Click "Pending" status button
  await page.click('button:has-text("Pending")');
  
  // Select "High" priority
  await page.selectOption('select[name="priority"]', 'High');
  
  // Verify list shows only High priority pending tasks
  const items = await page.$$('.todo-item');
  
  for (const item of items) {
    const status = await item.$eval('.status', el => el.textContent);
    const priority = await item.$eval('.priority', el => el.textContent);
    
    expect(status).toBe('Pending');
    expect(priority).toBe('High');
  }
});
```

---

*Contract completed by /plan command on 2025-10-22*
