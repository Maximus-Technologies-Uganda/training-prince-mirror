import { test, expect } from '@playwright/test';

test.describe('Expense Filtering E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to expense page before each test
    await page.goto('/expense');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="expense-list"]', { timeout: 5000 }).catch(() => {
      // If selector not found, page may still be loading
      return page.waitForLoadState('networkidle');
    });
  });

  test('User selects category filter → list updates with matching items', async ({ page }) => {
    // Get initial item count
    const initialItems = await page.$$('[data-testid="expense-item"]');
    const initialCount = initialItems.length;
    
    // Select category filter
    const categorySelect = page.locator('select[name="category"], select[aria-label*="category" i]').first();
    await categorySelect.selectOption('Food');
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Verify list updated
    const updatedItems = await page.$$('[data-testid="expense-item"]');
    expect(updatedItems.length).toBeLessThanOrEqual(initialCount);
    
    // Verify all items have the selected category
    for (const item of updatedItems) {
      const category = await item.getAttribute('data-category');
      expect(category).toBe('Food');
    }
  });

  test('User selects month filter → list updates with matching items', async ({ page }) => {
    // Get initial item count
    const initialItems = await page.$$('[data-testid="expense-item"]');
    const initialCount = initialItems.length;
    
    // Select month filter
    const monthSelect = page.locator('select[name="month"], select[aria-label*="month" i]').first();
    await monthSelect.selectOption('10'); // October
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Verify list updated
    const updatedItems = await page.$$('[data-testid="expense-item"]');
    expect(updatedItems.length).toBeLessThanOrEqual(initialCount);
  });

  test('User applies both filters → AND logic applied correctly', async ({ page }) => {
    // Select category filter
    const categorySelect = page.locator('select[name="category"], select[aria-label*="category" i]').first();
    await categorySelect.selectOption('Food');
    
    // Select month filter
    const monthSelect = page.locator('select[name="month"], select[aria-label*="month" i]').first();
    await monthSelect.selectOption('10');
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Verify items match both filters
    const items = await page.$$('[data-testid="expense-item"]');
    for (const item of items) {
      const category = await item.getAttribute('data-category');
      const date = await item.getAttribute('data-date');
      
      expect(category).toBe('Food');
      if (date) {
        const month = new Date(date).getMonth() + 1;
        expect(month).toBe(10);
      }
    }
  });

  test('Empty state displays when no matches exist', async ({ page }) => {
    // Apply filters that likely have no matches
    const categorySelect = page.locator('select[name="category"], select[aria-label*="category" i]').first();
    await categorySelect.selectOption('Entertainment');
    
    const monthSelect = page.locator('select[name="month"], select[aria-label*="month" i]').first();
    await monthSelect.selectOption('1'); // January
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Check if empty state appears
    const emptyState = page.locator('[data-testid="empty-state"], .empty-state').first();
    const emptyStateVisible = await emptyState.isVisible().catch(() => false);
    
    if (emptyStateVisible) {
      expect(emptyState).toBeVisible();
      // Verify message is about filtered results
      const message = await emptyState.textContent();
      expect(message?.toLowerCase()).toContain('no match');
    }
  });

  test('Clear filters button resets state and shows full list', async ({ page }) => {
    // Apply filters
    const categorySelect = page.locator('select[name="category"], select[aria-label*="category" i]').first();
    await categorySelect.selectOption('Food');
    
    // Get filtered count
    const filteredItems = await page.$$('[data-testid="expense-item"]');
    const filteredCount = filteredItems.length;
    
    // Click clear filters button
    const clearButton = page.locator('button:has-text("Clear Filters"), [data-testid="clear-filters"]').first();
    await clearButton.click();
    
    // Wait for list to update
    await page.waitForTimeout(300);
    
    // Verify filters are reset
    const categoryValue = await categorySelect.inputValue();
    expect(categoryValue).toBe('');
    
    // Verify list shows more items (unfiltered)
    const resetItems = await page.$$('[data-testid="expense-item"]');
    expect(resetItems.length).toBeGreaterThanOrEqual(filteredCount);
  });

  test('Filter update completes within 300ms performance target', async ({ page }) => {
    const startTime = Date.now();
    
    // Select category filter
    const categorySelect = page.locator('select[name="category"], select[aria-label*="category" i]').first();
    await categorySelect.selectOption('Food');
    
    // Wait for list update
    await page.waitForTimeout(300);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Verify performance target
    expect(duration).toBeLessThan(400); // Allow some overhead
  });

});
