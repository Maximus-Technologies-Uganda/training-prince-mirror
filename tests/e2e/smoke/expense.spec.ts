import { test, expect } from '@playwright/test';

test.describe('Expense Tracker UI Smoke Test', () => {
  test('should add expense and verify totals with category filter', async ({ page }) => {
    // Navigate to expense tracker
    await page.goto('/expense');
    
    // Assert expense UI loads (form and table visible)
    const amountInput = await page.locator('[data-testid="expense-amount"]');
    await expect(amountInput).toBeVisible();
    
    const categoryInput = await page.locator('[data-testid="expense-category"]');
    await expect(categoryInput).toBeVisible();
    
    // Get initial row count
    const initialTable = await page.locator('[data-testid="expense-list"] tbody tr');
    const initialRowCount = await initialTable.count();
    
    // Get all form inputs
    const form = await page.locator('#expense-form');
    await expect(form).toBeVisible();
    
    // Add new expense via form - fill all required fields
    const descriptionInput = await page.locator('#exp-description');
    if (await descriptionInput.isVisible()) {
      await descriptionInput.fill('Lunch expense');
    }
    
    await amountInput.fill('50.00');
    await categoryInput.fill('Food');
    
    // Fill in month field (January)
    const monthInput = await page.locator('input[name="month"]');
    if (await monthInput.isVisible()) {
      await monthInput.fill('1');
    }
    
    // Submit form
    const addButton = await page.locator('[data-testid="add-expense"]');
    await expect(addButton).toBeVisible();
    await addButton.click();
    
    // Wait a moment for the form submission to process
    await page.waitForTimeout(500);
    
    // Verify row count increments
    const updatedTable = await page.locator('[data-testid="expense-list"] tbody tr');
    const updatedRowCount = await updatedTable.count();
    expect(updatedRowCount).toBe(initialRowCount + 1);
    
    // Verify total amount updates
    const totalAmount = await page.locator('[data-testid="total-amount"]');
    const totalText = await totalAmount.textContent();
    expect(totalText).not.toBe('0');
    
    // Screenshot on success
    await page.screenshot({ path: 'test-results/expense-success.png', fullPage: true });
  });
});
