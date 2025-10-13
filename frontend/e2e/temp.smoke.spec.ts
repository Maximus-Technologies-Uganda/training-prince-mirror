import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:5173';

test('Temp UI loads and converts 0 C→F to 32', async ({ page }) => {
  await page.goto(BASE_URL);

  // Enter value 0; defaults are C -> F in HTML
  const value = page.locator('#temp-value');
  await value.fill('0');

  const result = page.locator('#temp-result');
  await expect(result).toHaveText('32');
});


