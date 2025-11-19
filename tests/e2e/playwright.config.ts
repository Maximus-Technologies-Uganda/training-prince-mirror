import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.EXPENSES_E2E_PORT ?? 3000);

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: ['smoke/**'],
  fullyParallel: false,
  timeout: 30_000,
  expect: {
    timeout: 7_500,
  },
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/e2e/playwright-report' }],
  ],
  use: {
    baseURL: process.env.EXPENSES_E2E_BASE_URL ?? `http://localhost:${port}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    headless: process.env.CI ? true : true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.EXPENSES_E2E_SKIP_SERVER
    ? undefined
    : {
        command: 'cd frontend && npm run dev',
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stderr: 'pipe',
        stdout: 'pipe',
      },
});
