import { test, expect } from '@playwright/test';

test.describe('Todo Application Smoke Test', () => {
  test('should add task and mark as complete', async ({ page }) => {
    // Navigate to todo application
    await page.goto('/todo');

    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Todo List');

    // Verify initial state
    const taskList = page.locator('[data-testid="task-list"]');
    await expect(taskList).toBeVisible();

    // Add a new task
    const taskInput = page.locator('[data-testid="task-input"]');
    const addButton = page.locator('[data-testid="add-task"]');

    await expect(taskInput).toBeVisible();
    await expect(addButton).toBeVisible();

    // Add a task
    await taskInput.fill('Complete Day 0 CI implementation');
    await addButton.click();

    // Verify task was added
    const taskItem = page.locator('[data-testid="task-item"]').first();
    await expect(taskItem).toBeVisible();
    await expect(taskItem).toContainText('Complete Day 0 CI implementation');

    // Verify task is not completed initially
    const checkbox = taskItem.locator('[data-testid="task-checkbox"]');
    await expect(checkbox).not.toBeChecked();

    // Mark task as complete
    await checkbox.click();

    // Verify task is marked as complete
    await expect(checkbox).toBeChecked();
    await expect(taskItem).toHaveClass(/completed/);

    // Verify task count updated
    const taskCount = page.locator('[data-testid="task-count"]');
    await expect(taskCount).toContainText('1');
  });

  test('should delete completed tasks', async ({ page }) => {
    await page.goto('/todo');

    // Add a task
    await page.locator('[data-testid="task-input"]').fill('Test task');
    await page.locator('[data-testid="add-task"]').click();

    // Mark as complete
    await page.locator('[data-testid="task-checkbox"]').click();

    // Delete completed task
    const deleteButton = page.locator('[data-testid="delete-task"]').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Verify task was deleted
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(0);
  });

  test('should filter tasks by status', async ({ page }) => {
    await page.goto('/todo');

    // Add multiple tasks
    await page.locator('[data-testid="task-input"]').fill('Task 1');
    await page.locator('[data-testid="add-task"]').click();

    await page.locator('[data-testid="task-input"]').fill('Task 2');
    await page.locator('[data-testid="add-task"]').click();

    // Mark one as complete
    await page.locator('[data-testid="task-checkbox"]').first().click();
    
    // Wait for state to update
    await page.waitForTimeout(300);

    // Test filter for active tasks - use the static filter button, not advanced
    const activeFilter = page.locator('div.todo-filters [data-testid="filter-active"]');
    await activeFilter.waitFor({ state: 'visible' });
    await activeFilter.click();
    await page.waitForTimeout(200);

    // Should show only active tasks
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(1);

    // Test filter for completed tasks - use the static filter button
    const completedFilter = page.locator('div.todo-filters [data-testid="filter-completed"]');
    await completedFilter.waitFor({ state: 'visible' });
    await completedFilter.click();
    await page.waitForTimeout(200);

    // Should show only completed tasks
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(1);

    // Test show all filter - use the static filter button
    const allFilter = page.locator('div.todo-filters [data-testid="filter-all"]');
    await allFilter.waitFor({ state: 'visible' });
    await allFilter.click();
    await page.waitForTimeout(200);

    // Should show all tasks
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(2);
  });

  test('should handle empty task input', async ({ page }) => {
    await page.goto('/todo');

    // Try to add empty task
    await page.locator('[data-testid="add-task"]').click();

    // Should show validation error
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
  });

  test('should persist tasks in localStorage', async ({ page }) => {
    await page.goto('/todo');

    // Add a task
    await page.locator('[data-testid="task-input"]').fill('Persistent task');
    await page.locator('[data-testid="add-task"]').click();

    // Verify task exists
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(1);

    // Reload page
    await page.reload();

    // Verify task persists
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="task-item"]')).toContainText('Persistent task');
  });
});
