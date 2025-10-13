import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:5173';

test('Expense UI loads and totals area visible', async ({ page }) => {
  await page.goto(BASE_URL);
  const total = page.locator('#exp-total');
  await expect(total).toBeVisible();
});
