import { defineConfig } from 'vitest/config';

const disableThreshold = process.env.VITEST_DISABLE_THRESHOLD === '1';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      include: ['src/ui-*/**/*.js', 'src/main.js'],
      ...(disableThreshold
        ? {}
        : {
            thresholds: {
              statements: 55,
              lines: 55,
              functions: 55,
              branches: 55,
            },
          }),
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
});
