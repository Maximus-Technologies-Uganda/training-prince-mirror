import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e/smoke',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: 1,
  reporter: 'html',
  timeout: 30 * 1000, // 30 seconds per test
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-failure',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
