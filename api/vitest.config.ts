import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'vitest.config.ts'
      ],
      thresholds: {
        statements: 70,
        functions: 70,
        branches: 70,
        lines: 70
      }
    },
    include: ['tests/**/*.test.ts']
  }
});
