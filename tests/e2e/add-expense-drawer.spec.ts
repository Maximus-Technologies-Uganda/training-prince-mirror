import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const BASE_URL = process.env.EXPENSES_E2E_BASE_URL ?? 'http://localhost:3000/expenses';

async function throttle(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  });
}

test.describe('Add expense drawer e2e', () => {
  test.beforeEach(({ page }) => {
    page.on('pageerror', (error) => {
      // eslint-disable-next-line no-console
      console.error('[pageerror]', error);
      console.error('[pageerror stack]', error.stack);
    });
  });

  test('focus trap, validation, and duplicate-submit guard', async ({ page }) => {
    await throttle(page);

    const submittedPayloads: unknown[] = [];
    await page.route('**/expenses**', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }
      const url = new URL(route.request().url());
      const isSummary = url.pathname.endsWith('/summary');
      if (route.request().method() === 'POST') {
        submittedPayloads.push(await route.request().postDataJSON());
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'exp_new', amount: 45.6, category: 'travel', date: '2025-11-18' }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          isSummary
            ? { total: 0, count: 0, filters: {}, generatedAt: new Date().toISOString() }
            : {
                data: [],
                pagination: { totalItems: 0, currentPage: 1, pageSize: 20, totalPages: 0 },
                requestId: 'req_drawer',
              },
        ),
      });
    });

    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Add expense from page header' }).click();

    const amount = page.getByLabel('Amount');
    // Wait for drawer to be fully visible and focus to be set
    // Playwright's expect will auto-wait until the condition is met
    await expect(amount).toBeVisible();
    await expect(amount).toBeFocused();
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    await expect(page.getByRole('button', { name: 'Close drawer' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(amount).toBeFocused();

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Amount must be greater than 0')).toBeVisible();

    await amount.fill('45.60');
    await page.getByLabel('Category').selectOption('travel');
    await page.getByLabel('Date').fill('2025-11-18');

    const submit = page.getByRole('button', { name: 'Submit' });
    await Promise.all([submit.click(), submit.click()]);
    await expect(page.getByRole('button', { name: 'Submitting…' })).toBeDisabled();
    await expect(page.getByText('Expense added')).toBeVisible();

    expect(submittedPayloads).toHaveLength(1);
    expect(submittedPayloads[0]).toEqual({ amount: 45.6, category: 'travel', date: '2025-11-18' });
  });

  test('requires confirmation before closing a dirty drawer and restores CTA focus', async ({ page }) => {
    await throttle(page);

    await page.route('**/expenses**', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }
      const url = new URL(route.request().url());
      const isSummary = url.pathname.endsWith('/summary');
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'exp_new', amount: 20, category: 'food', date: '2025-11-17' }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          isSummary
            ? { total: 0, count: 0, filters: {}, generatedAt: new Date().toISOString() }
            : {
                data: [],
                pagination: { totalItems: 0, currentPage: 1, pageSize: 20, totalPages: 0 },
                requestId: 'req_drawer_dirty',
              },
        ),
      });
    });

    await page.goto(BASE_URL);
    const headerCta = page.getByRole('button', { name: 'Add expense from page header' });
    await headerCta.click();

    await page.getByLabel('Amount').fill('12.34');

    let dialogCount = 0;
    page.on('dialog', async (dialog) => {
      dialogCount += 1;
      if (dialogCount === 1) {
        await dialog.dismiss();
      } else {
        expect(dialog.message()).toContain('Discard unsaved expense');
        await dialog.accept();
      }
    });

    await page.getByRole('button', { name: 'Close drawer' }).click();
    await expect(page.getByRole('dialog', { name: 'Add expense' })).toBeVisible();

    await page.getByRole('button', { name: 'Close drawer' }).click();
    // Wait for the drawer to close and verify focus returns to the triggering button (SC-002 compliance)
    // The parent page uses RAF to restore focus to lastFocusRef
    await expect(page.getByRole('dialog', { name: 'Add expense' })).not.toBeVisible();
    await expect(headerCta).toBeFocused();
  });

  test('Escape key closes drawer and returns focus to trigger button (SC-002 compliance)', async ({ page }) => {
    await throttle(page);

    await page.route('**/expenses**', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }
      const url = new URL(route.request().url());
      const isSummary = url.pathname.endsWith('/summary');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          isSummary
            ? { total: 0, count: 0, filters: {}, generatedAt: new Date().toISOString() }
            : {
                data: [],
                pagination: { totalItems: 0, currentPage: 1, pageSize: 20, totalPages: 0 },
                requestId: 'req_escape_test',
              },
        ),
      });
    });

    await page.goto(BASE_URL);
    const headerCta = page.getByRole('button', { name: 'Add expense from page header' });
    await headerCta.click();

    const amount = page.getByLabel('Amount');
    await expect(amount).toBeVisible();
    await expect(amount).toBeFocused();

    // Press Escape to close the drawer
    await page.keyboard.press('Escape');

    // Verify drawer closes and focus returns to the triggering button
    await expect(page.getByRole('dialog', { name: 'Add expense' })).not.toBeVisible();
    await expect(headerCta).toBeFocused();
  });
});
