import { test, expect } from '@playwright/test';

test.describe('Quote Application Smoke Test', () => {
  test('should display random quote and allow filtering', async ({ page }) => {
    // Navigate to quote application
    await page.goto('/quote');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Quote');
    
    // Verify initial quote is displayed
    const quoteElement = page.locator('[data-testid="quote-text"]');
    await expect(quoteElement).toBeVisible();
    
    // Get initial quote text
    const initialQuote = await quoteElement.textContent();
    expect(initialQuote).toBeTruthy();
    expect(initialQuote!.length).toBeGreaterThan(10);
    
    // Test quote filtering functionality
    const filterInput = page.locator('[data-testid="quote-filter"]');
    await expect(filterInput).toBeVisible();
    
    // Type a filter term
    await filterInput.fill('inspiration');
    
    // Verify filtered quotes are displayed
    const filteredQuotes = page.locator('[data-testid="quote-item"]');
    await expect(filteredQuotes.first()).toBeVisible();
    
    // Test clear filter
    const clearButton = page.locator('[data-testid="clear-filter"]');
    await expect(clearButton).toBeVisible();
    await clearButton.click();
    
    // Verify all quotes are shown again
    await expect(page.locator('[data-testid="quote-item"]')).toHaveCount(10);
    
    // Test refresh quote functionality
    const refreshButton = page.locator('[data-testid="refresh-quote"]');
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();
    
    // Verify new quote is different from initial
    const newQuote = await quoteElement.textContent();
    expect(newQuote).not.toBe(initialQuote);
  });
  
  test('should handle empty filter gracefully', async ({ page }) => {
    await page.goto('/quote');
    
    // Test empty filter
    const filterInput = page.locator('[data-testid="quote-filter"]');
    await filterInput.fill('');
    
    // Should show all quotes
    await expect(page.locator('[data-testid="quote-item"]')).toHaveCount(10);
  });
  
  test('should handle invalid filter gracefully', async ({ page }) => {
    await page.goto('/quote');
    
    // Test filter with no matches
    const filterInput = page.locator('[data-testid="quote-filter"]');
    await filterInput.fill('nonexistentterm12345');
    
    // Should show no quotes message
    await expect(page.locator('[data-testid="no-quotes"]')).toBeVisible();
  });
});
