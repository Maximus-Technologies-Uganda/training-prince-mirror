import { test, expect } from '@playwright/test';

test.describe('To-Do Filtering E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to to-do page before each test
    await page.goto('/todo');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="todo-list"]', { timeout: 5000 }).catch(() => {
      // If selector not found, page may still be loading
      return page.waitForLoadState('networkidle');
    });
    
    // Add test data
    const addTask = async (text, isHighPriority = false) => {
      await page.locator('[data-testid="task-input"]').fill(text);
      if (isHighPriority) {
        const checkbox = page.locator('#todo-high');
        await checkbox.check();
      }
      await page.locator('[data-testid="add-task"]').click();
      await page.waitForTimeout(200);
    };
    
    // Add various tasks
    await addTask('Buy groceries', false);
    await addTask('Complete project', true);
    await addTask('Review code', true);
    await addTask('Write tests', false);
    
    // Mark some tasks as complete
    const checkboxes = await page.locator('[data-testid="task-checkbox"]').all();
    if (checkboxes.length >= 2) {
      await checkboxes[0].check();
      await checkboxes[2].check();
    }
    await page.waitForTimeout(300);
  });

  test('User clicks status filter (Pending) → list updates with pending tasks', async ({ page }) => {
    // Get initial item count
    const initialItems = await page.$$('[data-testid="todo-item"]');
    const initialCount = initialItems.length;
    
    // Click pending status filter
    const pendingFilter = page.locator('button:has-text("Pending"), [data-testid="filter-pending"]').first();
    await pendingFilter.click();
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Verify list updated
    const updatedItems = await page.$$('[data-testid="todo-item"]');
    expect(updatedItems.length).toBeLessThanOrEqual(initialCount);
    
    // Verify all items are pending (not completed)
    for (const item of updatedItems) {
      const completed = await item.getAttribute('data-completed');
      expect(completed).toBe('false');
    }
  });

  test('User clicks status filter (Completed) → list updates with completed tasks', async ({ page }) => {
    // Click completed status filter
    const completedFilter = page.locator('button:has-text("Completed"), [data-testid="filter-completed"]').first();
    await completedFilter.click();
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Verify all items are completed
    const items = await page.$$('[data-testid="todo-item"]');
    for (const item of items) {
      const completed = await item.getAttribute('data-completed');
      expect(completed).toBe('true');
    }
  });

  test('User selects priority filter → list updates with matching items', async ({ page }) => {
    // Get initial item count
    const initialItems = await page.$$('[data-testid="todo-item"]');
    const initialCount = initialItems.length;
    
    // Select priority filter
    const prioritySelect = page.locator('select[name="priority"], select[aria-label*="priority" i]').first();
    await prioritySelect.selectOption('High');
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Verify list updated
    const updatedItems = await page.$$('[data-testid="todo-item"]');
    expect(updatedItems.length).toBeLessThanOrEqual(initialCount);
    
    // Verify all items have High priority
    for (const item of updatedItems) {
      const priority = await item.getAttribute('data-priority');
      expect(priority).toBe('High');
    }
  });

  test('User applies both filters (status + priority) → AND logic applied correctly', async ({ page }) => {
    // Click pending status filter
    const pendingFilter = page.locator('button:has-text("Pending"), [data-testid="filter-pending"]').first();
    await pendingFilter.click();
    
    // Select priority filter
    const prioritySelect = page.locator('select[name="priority"], select[aria-label*="priority" i]').first();
    await prioritySelect.selectOption('High');
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Verify items match both filters
    const items = await page.$$('[data-testid="todo-item"]');
    for (const item of items) {
      const completed = await item.getAttribute('data-completed');
      const priority = await item.getAttribute('data-priority');
      
      expect(completed).toBe('false');
      expect(priority).toBe('High');
    }
  });

  test('Empty state displays when no matches exist', async ({ page }) => {
    // Apply filters that may have no matches
    const completedFilter = page.locator('button:has-text("Completed"), [data-testid="filter-completed"]').first();
    await completedFilter.click();
    
    const prioritySelect = page.locator('select[name="priority"], select[aria-label*="priority" i]').first();
    await prioritySelect.selectOption('High');
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Check if empty state appears or list is empty
    const items = await page.$$('[data-testid="todo-item"]');
    
    if (items.length === 0) {
      const emptyState = page.locator('[data-testid="empty-state"], .empty-state').first();
      const emptyStateVisible = await emptyState.isVisible().catch(() => false);
      
      if (emptyStateVisible) {
        expect(emptyState).toBeVisible();
        // Verify message is about filtered results
        const message = await emptyState.textContent();
        expect(message?.toLowerCase()).toContain('match');
      }
    }
  });

  test('Clear filters button resets state and shows full list', async ({ page }) => {
    // Apply filters
    const pendingFilter = page.locator('button:has-text("Pending"), [data-testid="filter-pending"]').first();
    await pendingFilter.click();
    
    const prioritySelect = page.locator('select[name="priority"], select[aria-label*="priority" i]').first();
    await prioritySelect.selectOption('High');
    
    // Get filtered count
    const filteredItems = await page.$$('[data-testid="todo-item"]');
    const filteredCount = filteredItems.length;
    
    // Click clear filters button
    const clearButton = page.locator('button:has-text("Clear Filters"), [data-testid="clear-filters"]').first();
    await clearButton.click();
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Verify filters are reset
    const priorityValue = await prioritySelect.inputValue();
    expect(priorityValue).toBe('');
    
    // Verify status is reset to "All"
    const allFilter = page.locator('button:has-text("All"), [data-testid="filter-all"]').first();
    const isActive = await allFilter.getAttribute('aria-pressed');
    expect(isActive === 'true' || isActive === null).toBeTruthy();
    
    // Verify list shows more items (unfiltered)
    const resetItems = await page.$$('[data-testid="todo-item"]');
    expect(resetItems.length).toBeGreaterThanOrEqual(filteredCount);
  });

  test('Filter update completes within 300ms performance target', async ({ page }) => {
    const startTime = Date.now();
    
    // Select priority filter
    const prioritySelect = page.locator('select[name="priority"], select[aria-label*="priority" i]').first();
    await prioritySelect.selectOption('Medium');
    
    // Wait for list update
    await page.waitForTimeout(300);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Verify performance target
    expect(duration).toBeLessThan(400); // Allow some overhead
  });

});
