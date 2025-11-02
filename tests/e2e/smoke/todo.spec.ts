import { test, expect } from '@playwright/test';

test.describe('Todo List UI Smoke Test', () => {
  test('should add task with priority and toggle completion', async ({ page }) => {
    // Navigate to todo app
    await page.goto('/todo');
    
    // Assert todo UI loads (input field and task list visible)
    const todoInput = await page.locator('[data-testid="task-input"]');
    await expect(todoInput).toBeVisible();
    
    const taskList = await page.locator('[data-testid="task-list"]');
    await expect(taskList).toBeVisible();
    
    // Get initial task count
    const initialItems = await taskList.locator('li').count();
    
    // Add new task via input field
    await todoInput.fill('Test task');
    
    // Check high priority checkbox
    const highPriorityCheckbox = await page.locator('#todo-high');
    await expect(highPriorityCheckbox).toBeVisible();
    await highPriorityCheckbox.check();
    
    // Click add task button
    const addButton = await page.locator('[data-testid="add-task"]');
    await expect(addButton).toBeVisible();
    await addButton.click();
    
    // Verify task appears in list
    const updatedItems = await taskList.locator('li').count();
    expect(updatedItems).toBe(initialItems + 1);
    
    // Verify the new task is visible
    const newTask = await taskList.locator('li').last();
    await expect(newTask).toBeVisible();
    
    // Verify task contains the entered text
    const taskText = await newTask.textContent();
    expect(taskText).toContain('Test task');
    
    // Screenshot on success
    await page.screenshot({ path: 'test-results/todo-success.png', fullPage: true });
  });
});
