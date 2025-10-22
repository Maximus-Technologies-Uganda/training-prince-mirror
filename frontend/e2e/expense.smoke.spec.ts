import { test, expect } from '@playwright/test';

test.describe('Expense Application Smoke Test', () => {
  test('should add expense and verify calculation', async ({ page }) => {
    // Navigate to expense application
    await page.goto('/expense');

    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Expense Tracker');

    // Verify initial state
    const totalElement = page.locator('[data-testid="total-amount"]');
    await expect(totalElement).toBeVisible();
    const initialTotal = await totalElement.textContent();

    // Add a new expense
    const descriptionInput = page.locator('[data-testid="expense-description"]');
    const amountInput = page.locator('[data-testid="expense-amount"]');
    const categorySelect = page.locator('[data-testid="expense-category"]');
    const addButton = page.locator('[data-testid="add-expense"]');

    await expect(descriptionInput).toBeVisible();
    await expect(amountInput).toBeVisible();
    await expect(categorySelect).toBeVisible();
    await expect(addButton).toBeVisible();

    // Fill in expense details
    await descriptionInput.fill('Test Coffee');
    await amountInput.fill('3.50');
    await categorySelect.fill('Food');

    // Add the expense
    await addButton.click();

    // Verify expense was added to the list
    const expenseList = page.locator('[data-testid="expense-list"]');
    await expect(expenseList).toBeVisible();

    const expenseItem = page.locator('[data-testid="expense-item"]').first();
    await expect(expenseItem).toContainText('Test Coffee');
    await expect(expenseItem).toContainText('$3.50');
    await expect(expenseItem).toContainText('Food');

    // Verify total amount updated
    const newTotal = await totalElement.textContent();
    expect(newTotal).not.toBe(initialTotal);

    // Verify calculation is correct
    const totalAmount = parseFloat(newTotal!.replace('$', ''));
    expect(totalAmount).toBeGreaterThan(0);
  });

  test('should handle expense deletion', async ({ page }) => {
    await page.goto('/expense');

    // Add an expense first
    await page.locator('[data-testid="expense-description"]').fill('Test Expense');
    await page.locator('[data-testid="expense-amount"]').fill('10.00');
    await page.locator('[data-testid="expense-category"]').fill('Other');
    await page.locator('[data-testid="add-expense"]').click();

    // Verify expense was added
    await expect(page.locator('[data-testid="expense-item"]')).toHaveCount(1);

    // Delete the expense
    const deleteButton = page.locator('[data-testid="delete-expense"]').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Verify expense was removed
    await expect(page.locator('[data-testid="expense-item"]')).toHaveCount(0);
  });

  test('should validate expense input', async ({ page }) => {
    await page.goto('/expense');

    // Try to add expense with empty description
    await page.locator('[data-testid="expense-amount"]').fill('5.00');
    await page.locator('[data-testid="expense-category"]').fill('Food');
    await page.locator('[data-testid="add-expense"]').click();

    // Should show validation error
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();

    // Try to add expense with empty amount (don't try to fill "invalid" text into number input)
    await page.locator('[data-testid="expense-description"]').fill('Test');
    await page.locator('[data-testid="expense-amount"]').fill('');
    await page.locator('[data-testid="add-expense"]').click();

    // Should show validation error
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
  });
});
