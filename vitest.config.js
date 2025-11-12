import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Run tests serially to avoid file system conflicts
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    environment: 'node',
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules/**', 'frontend/**', 'coverage/**'],
    environmentMatchGlobs: [
      ['tests/stopwatch-ui-*.test.js', 'jsdom'],
      ['tests/temp-converter.table.test.js', 'jsdom']
    ],
    coverage: {
      all: true,
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html', 'text-summary'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.js'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/review-artifacts/**',
        '**/*.test.js',
        '**/*.spec.js',
        '**/coverage/**',
        '**/.git/**'
      ],
      thresholds: process.env.VITEST_DISABLE_THRESHOLD === '1' ? undefined : {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70
      }
    }
  }
});
