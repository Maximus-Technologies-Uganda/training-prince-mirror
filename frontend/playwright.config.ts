import { defineConfig } from '@playwright/test';

const REQUIRED_ENV_DEFAULTS: Record<string, string> = {
  NEXT_PUBLIC_API_URL: 'https://chapter5-api.example.com',
  NEXT_SERVICE_TOKEN: 'local-dev-token',
};

for (const [key, value] of Object.entries(REQUIRED_ENV_DEFAULTS)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

const WEB_SERVER_ENV = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  NEXT_SERVICE_TOKEN: process.env.NEXT_SERVICE_TOKEN!,
};

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: /.*\.spec\.(js|ts)$/,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://127.0.0.1:3000',
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
          command: 'npm run build && npm run start',
          url: 'http://127.0.0.1:3000',
          reuseExistingServer: true,
          timeout: 120000,
          env: WEB_SERVER_ENV,
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
