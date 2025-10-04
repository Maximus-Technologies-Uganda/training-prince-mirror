import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:5173';

test('filters quotes by author name', async ({ page }) => {
  await page.goto(BASE_URL);

  const filterInput = page.locator('#author-filter').first();
  await filterInput.fill('Steve Jobs');

  const quoteDisplay = page.locator('#quote-display').first();
  await expect(quoteDisplay).toContainText(/Steve Jobs/i);
});

