import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.EXPENSES_E2E_PORT ?? 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const frontendDir = path.join(repoRoot, 'frontend');

export default defineConfig({
  testDir: __dirname,
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
  command: `npm run dev --prefix ${frontendDir}`,
  cwd: repoRoot,
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stderr: 'pipe',
        stdout: 'pipe',
      },
});
