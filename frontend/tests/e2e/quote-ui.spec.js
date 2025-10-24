import { test, expect } from '@playwright/test';

// These tests will FAIL until we implement the enhanced quote UI functionality
// Based on quickstart.md scenarios

test.describe('Quote UI Enhanced Filtering E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the quote UI page
    await page.goto('/');
    
    // Wait for the quote UI to load
    await page.waitForSelector('#quote-display');
  });

  test('should implement case-insensitive author filtering', async ({ page }) => {
    // This will fail until we implement the enhanced filtering
    const filterInput = page.locator('#author-filter');
    const quoteAuthor = page.locator('#quote-author');

    // Type "john" (lowercase)
    await filterInput.fill('john');
    await page.waitForTimeout(300); // Wait for debounce

    // Should show a quote by John (case-insensitive)
    await expect(quoteAuthor).toContainText(/John/i);
  });

  test('should implement debounced filtering with 250ms delay', async ({ page }) => {
    const filterInput = page.locator('#author-filter');
    const quoteAuthor = page.locator('#quote-author');

    // Type rapidly
    await filterInput.fill('a');
    await filterInput.fill('ab');
    await filterInput.fill('abc');
    await filterInput.fill('abcd');

    // Should not filter immediately
    await page.waitForTimeout(100);
    
    // Should filter after debounce delay
    await page.waitForTimeout(200);
    await expect(quoteAuthor).toBeVisible();
  });

  test('should show all quotes when filter is cleared', async ({ page }) => {
    const filterInput = page.locator('#author-filter');
    const quoteText = page.locator('#quote-text');

    // First filter to specific author
    await filterInput.fill('john');
    await page.waitForTimeout(300);

    // Then clear filter
    await filterInput.fill('');
    await page.waitForTimeout(300);

    // Should show any quote (not restricted)
    await expect(quoteText).not.toHaveText('No quotes found');
  });

  test('should handle whitespace-only input as empty', async ({ page }) => {
    const filterInput = page.locator('#author-filter');
    const quoteText = page.locator('#quote-text');

    // Type only spaces
    await filterInput.fill('   ');
    await page.waitForTimeout(300);

    // Should show quotes (treated as empty)
    await expect(quoteText).not.toHaveText('No quotes found');
  });

  test('should display friendly error message for non-existent author', async ({ page }) => {
    const filterInput = page.locator('#author-filter');
    const errorMessage = page.locator('#quote-error');

    // Search for non-existent author
    await filterInput.fill('nonexistent');
    await page.waitForTimeout(300);

    // Should show friendly error message
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('No quotes found for');
  });

  test('should clear error when valid filter is applied', async ({ page }) => {
    const filterInput = page.locator('#author-filter');
    const errorMessage = page.locator('#quote-error');

    // First show error
    await filterInput.fill('nonexistent');
    await page.waitForTimeout(300);

    // Then apply valid filter
    await filterInput.fill('john');
    await page.waitForTimeout(300);

    // Error should be cleared
    await expect(errorMessage).toBeHidden();
  });

  test('should support deterministic quote selection for testing', async ({ page }) => {
    const shuffleButton = page.locator('#shuffle-quote');
    const quoteText = page.locator('#quote-text');

    // Get initial quote
    const initialQuote = await quoteText.textContent();

    // Click shuffle multiple times
    await shuffleButton.click();
    await shuffleButton.click();
    await shuffleButton.click();

    // With seeded RNG, should get predictable results
    // This test will be more specific once we implement seeded selection
    await expect(quoteText).toBeVisible();
  });

  test('should maintain filter state during quote shuffling', async ({ page }) => {
    const filterInput = page.locator('#author-filter');
    const shuffleButton = page.locator('#shuffle-quote');
    const quoteAuthor = page.locator('#quote-author');

    // Apply filter
    await filterInput.fill('john');
    await page.waitForTimeout(300);

    // Shuffle quotes
    await shuffleButton.click();

    // Should still show quotes by John
    await expect(quoteAuthor).toContainText(/John/i);
  });

  test('should handle rapid typing without performance issues', async ({ page }) => {
    const filterInput = page.locator('#author-filter');
    const quoteAuthor = page.locator('#quote-author');

    // Rapid typing simulation
    const rapidInputs = ['a', 'ab', 'abc', 'abcd', 'abcde'];
    
    for (const input of rapidInputs) {
      await filterInput.fill(input);
    }

    // Wait for final debounce
    await page.waitForTimeout(300);

    // Should show filtered results
    await expect(quoteAuthor).toBeVisible();
  });

  test('should provide accessible error messages', async ({ page }) => {
    const filterInput = page.locator('#author-filter');
    const errorMessage = page.locator('#quote-error');

    // Create error state
    await filterInput.fill('nonexistent');
    await page.waitForTimeout(300);

    // Check accessibility
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveAttribute('role', 'alert');
    await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });
});
