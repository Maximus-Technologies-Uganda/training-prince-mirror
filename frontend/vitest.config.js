import { defineConfig } from 'vitest/config';

const disableThreshold = process.env.VITEST_DISABLE_THRESHOLD === '1';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      include: ['src/ui-todo/**/*.js'],
      ...(disableThreshold
        ? {}
        : {
            thresholds: {
              statements: 40,
              lines: 40,
            },
          }),
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
});
