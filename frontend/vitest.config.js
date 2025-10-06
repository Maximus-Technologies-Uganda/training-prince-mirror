import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 40,
        lines: 40,
      },
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
});
