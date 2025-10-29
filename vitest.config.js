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
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules/**', 'frontend/**', 'coverage/**'],
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
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60
      }
    }
  }
});
