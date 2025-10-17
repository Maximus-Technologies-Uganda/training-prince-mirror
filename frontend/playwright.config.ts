import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  testMatch: /.*\.spec\.(js|ts)$/,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://127.0.0.1:5173',
    headless: true,
    // Enhanced configuration for smoke tests
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // Only use webServer if not in CI (CI starts server manually)
  ...(process.env.CI
    ? {}
    : {
        webServer: {
          command: 'npm run preview -- --port 5173 --strictPort',
          url: 'http://127.0.0.1:5173',
          reuseExistingServer: true,
          timeout: 60000,
        },
      }),
  // Enhanced retry and timeout settings for smoke tests
  retries: process.env.CI ? 2 : 0,
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  // Output directory for test results and artifacts
  outputDir: 'test-results/',
  // Reporter configuration
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
});
