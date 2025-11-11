import { test, expect } from '@playwright/test';

/**
 * Smoke Test: Expense UI + API Integration
 * 
 * Validates that:
 * 1. User can load the Expense UI
 * 2. User can submit an expense form
 * 3. API receives the request and returns HTTP 201
 * 4. UI updates to show the new expense
 */

test.describe('Expense UI & API Integration Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to expenses page
    await page.goto('/expenses', { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="expense-list"], .expense-list, [class*="expense"]', {
      timeout: 5000
    });
  });

  test('should create an expense and see it in the UI', async ({ page }) => {
    // Intercept API calls to track requests and responses
    let apiResponseData = null;
    page.on('response', response => {
      if (response.url().includes('/api/expenses') && response.request().method() === 'POST') {
        response.json().then(data => {
          apiResponseData = data;
        });
      }
    });

    // Get initial expense count
    const expenseItems = page.locator('[data-testid="expense-item"], .expense-item, li[class*="expense"]');
    const initialCount = await expenseItems.count();

    // Fill expense form
    const amountInput = page.locator('input[name="amount"], input[placeholder*="amount" i], input[type="number"]').first();
    const descriptionInput = page.locator('input[name="description"], input[placeholder*="description" i]').first();
    const submitButton = page.locator('button:has-text("Add"), button:has-text("Submit"), button:has-text("Create"), [data-testid="submit-button"]').first();

    // Test data
    const testAmount = '25.50';
    const testDescription = 'Smoke Test Expense';

    // Enter form values
    await amountInput.fill(testAmount);
    await descriptionInput.fill(testDescription);

    // Wait for API response
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/expenses') && response.request().method() === 'POST',
      { timeout: 10000 }
    );

    // Submit form
    await submitButton.click();

    // Wait for API response
    const response = await responsePromise;
    
    // Validate API response
    expect(response.status()).toBe(201);
    
    const responseData = await response.json();
    expect(responseData).toHaveProperty('id');
    expect(responseData).toHaveProperty('amount');
    expect(responseData).toHaveProperty('description');
    expect(String(responseData.amount)).toContain(testAmount.split('.')[0]); // Check amount (may have rounding)
    expect(responseData.description).toBe(testDescription);

    // Wait for UI to update
    await page.waitForTimeout(500);

    // Validate UI updated
    const updatedCount = await expenseItems.count();
    expect(updatedCount).toBe(initialCount + 1);

    // Check that new expense is visible
    const newExpenseText = page.locator(`text=${testDescription}`);
    await expect(newExpenseText).toBeVisible();

    // Check that amount is visible
    const amountLocator = page.locator(`text=${testAmount}`);
    await expect(amountLocator).toBeVisible();
  });

  test('should handle error when submitting invalid expense', async ({ page }) => {
    // Intercept API error responses
    let apiErrorCaught = false;
    page.on('response', response => {
      if (response.url().includes('/api/expenses') && response.status() >= 400) {
        apiErrorCaught = true;
      }
    });

    // Get form elements
    const amountInput = page.locator('input[name="amount"], input[placeholder*="amount" i], input[type="number"]').first();
    const descriptionInput = page.locator('input[name="description"], input[placeholder*="description" i]').first();
    const submitButton = page.locator('button:has-text("Add"), button:has-text("Submit"), button:has-text("Create"), [data-testid="submit-button"]').first();

    // Try to submit empty form (invalid)
    await submitButton.click();

    // Wait a bit for validation
    await page.waitForTimeout(300);

    // Either form validation error appears or API returns 400
    const hasValidationError = await page.locator('.error, [class*="error"], [role="alert"]').count() > 0;
    
    // One of these should be true:
    // 1. Form validation error visible
    // 2. API error response received
    expect(hasValidationError || apiErrorCaught).toBeTruthy();

    // Try again with invalid amount
    await amountInput.fill('invalid');
    await descriptionInput.fill('Test');
    await submitButton.click();

    // Wait for validation
    await page.waitForTimeout(300);

    // Should show error or reject submission
    const hasErrorNow = await page.locator('.error, [class*="error"], [role="alert"]').count() > 0;
    expect(hasErrorNow || apiErrorCaught).toBeTruthy();
  });

  test('should maintain expense list across page reload', async ({ page }) => {
    // Add an expense
    const amountInput = page.locator('input[name="amount"], input[placeholder*="amount" i], input[type="number"]').first();
    const descriptionInput = page.locator('input[name="description"], input[placeholder*="description" i]').first();
    const submitButton = page.locator('button:has-text("Add"), button:has-text("Submit"), button:has-text("Create"), [data-testid="submit-button"]').first();

    const testDescription = 'Persistence Test';
    await amountInput.fill('15.00');
    await descriptionInput.fill(testDescription);

    // Wait for API response
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/expenses') && response.request().method() === 'POST'
    );

    await submitButton.click();
    await responsePromise;

    // Get initial count
    const expenseItems = page.locator('[data-testid="expense-item"], .expense-item, li[class*="expense"]');
    const initialCount = await expenseItems.count();

    // Reload page
    await page.reload({ waitUntil: 'networkidle' });

    // Wait for new expenses to load
    await page.waitForTimeout(500);

    // Count should be same
    const reloadedCount = await expenseItems.count();
    expect(reloadedCount).toBe(initialCount);

    // New expense should still be visible
    const newExpenseText = page.locator(`text=${testDescription}`);
    await expect(newExpenseText).toBeVisible();
  });
});
