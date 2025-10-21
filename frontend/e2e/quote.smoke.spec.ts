import { test, expect } from '@playwright/test';

test.describe('Quote Application Smoke Test', () => {
  test('should display quote interface and allow interaction', async ({ page }) => {
    // Navigate to the main page (quote app is on the main page)
    await page.goto('/');

    // Wait for the page to load
    await expect(page.locator('#quote-heading')).toContainText('Quote Explorer');

    // Verify quote elements are present
    const quoteElement = page.locator('#quote-text');
    await expect(quoteElement).toBeVisible();

    // Verify author filter is present
    const authorFilter = page.locator('#author-filter');
    await expect(authorFilter).toBeVisible();

    // Verify shuffle button is present
    const shuffleButton = page.locator('#shuffle-quote');
    await expect(shuffleButton).toBeVisible();

    // Test that we can interact with the filter
    await authorFilter.fill('test');

    // Clear the filter to get back to all quotes before clicking shuffle
    await authorFilter.fill('');
    
    // Wait for debounce to process the filter change
    await page.waitForTimeout(300);
    
    // Verify shuffle button is enabled before clicking
    await expect(shuffleButton).toBeEnabled();

    // Test that we can click the shuffle button
    await shuffleButton.click();

    // Verify elements are still visible after interaction
    await expect(quoteElement).toBeVisible();
    await expect(authorFilter).toBeVisible();
    await expect(shuffleButton).toBeVisible();
  });

  test('should handle empty filter gracefully', async ({ page }) => {
    await page.goto('/');

    // Test empty filter
    const authorFilter = page.locator('#author-filter');
    await authorFilter.fill('');

    // Should still show quote elements
    await expect(page.locator('#quote-text')).toBeVisible();
  });

  test('should handle invalid filter gracefully', async ({ page }) => {
    await page.goto('/');

    // Test filter with no matches
    const authorFilter = page.locator('#author-filter');
    await authorFilter.fill('nonexistentterm12345');

    // Should still show quote elements
    await expect(page.locator('#quote-text')).toBeVisible();
  });
});
