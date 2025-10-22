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

    // Test filter for active tasks
    const activeFilter = page.locator('[data-testid="filter-active"]');
    await expect(activeFilter).toBeVisible();
    await activeFilter.click();

    // Should show only active tasks
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(1);

    // Test filter for completed tasks
    const completedFilter = page.locator('[data-testid="filter-completed"]');
    await expect(completedFilter).toBeVisible();
    await completedFilter.click();

    // Should show only completed tasks
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(1);

    // Test show all filter
    const allFilter = page.locator('[data-testid="filter-all"]');
    await expect(allFilter).toBeVisible();
    await allFilter.click();

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
