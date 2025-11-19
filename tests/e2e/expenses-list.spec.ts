import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const BASE_URL = process.env.EXPENSES_E2E_BASE_URL ?? 'http://localhost:3000/expenses';

async function throttleToFast3G(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  });
}

test.describe('Expenses list e2e', () => {
  test('loading, pagination, and retry states', async ({ page }) => {
    await throttleToFast3G(page);

    let retried = false;
    await page.route('**/expenses**', async (route) => {
      if (route.request().url().includes('/expenses/summary')) {
        await route.continue();
        return;
      }
      const url = new URL(route.request().url());
      const pageParam = url.searchParams.get('page') ?? '1';
      if (pageParam === '2' && !retried) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Server error', requestId: 'req_retry' }),
        });
        retried = true;
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildListPayload(Number(pageParam))),
      });
    });

    await page.route('**/expenses/summary**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ total: 500, count: 5, filters: {}, generatedAt: new Date().toISOString() }),
      });
    });

    const start = Date.now();
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="expenses-skeleton"]', { timeout: 200 });
    await expect(page.getByTestId('expenses-success')).toBeVisible();
    expect(Date.now() - start).toBeLessThanOrEqual(2500);

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByTestId('expenses-error')).toHaveText(/req_retry/);
    await page.getByRole('button', { name: 'Retry' }).click();
    await expect(page.getByTestId('expenses-success')).toBeVisible();

    await page.getByRole('button', { name: 'Prev' }).click();
    await expect(page.getByText('Page 1 of 3')).toBeVisible();
  });
});

function buildListPayload(page: number) {
  const baseRow = {
    amount: 42 + page,
    category: page % 2 === 0 ? 'food' : 'travel',
    date: '2025-11-18',
  };
  return {
    data: Array.from({ length: 20 }).map((_, index) => ({
      ...baseRow,
      id: `exp_${page}_${index}`,
    })),
    pagination: {
      totalItems: 60,
      currentPage: page,
      pageSize: 20,
      totalPages: 3,
    },
    requestId: `req_page_${page}`,
  };
}
