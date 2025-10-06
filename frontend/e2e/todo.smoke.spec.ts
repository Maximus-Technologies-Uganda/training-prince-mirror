import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:5173';

test('To‑Do smoke: add new item then toggle', async ({ page }) => {
  await page.goto(BASE_URL);

  const input = page.locator('#todo-input');
  await input.fill('Buy milk');
  await page.click('#todo-add');

  const list = page.locator('#todo-list li');
  await expect(list).toHaveCount(1);
  await expect(list.first()).toContainText('Buy milk');

  const toggleBtn = list.first().getByRole('button', { name: /toggle/i });
  await toggleBtn.click();
  // We don't render completed state textually beyond button label swap; ensure still present
  await expect(list.first()).toContainText('Buy milk');
});
