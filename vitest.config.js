import { defineConfig } from 'vitest/config';
import path from 'node:path';

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
    include: ['tests/**/*.test.{js,ts,tsx}'],
    exclude: ['node_modules/**', 'frontend/**', 'coverage/**'],
    environmentMatchGlobs: [
      ['tests/contract/vitest-config.test.js', 'node'],
      ['tests/stopwatch-ui-*.test.js', 'jsdom'],
      ['tests/temp-converter.table.test.js', 'jsdom'],
      ['tests/contract/**/*.test.*', 'jsdom']
    ],
    setupFiles: ['tests/setup-vitest.ts'],
    coverage: {
      all: true,
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html', 'text-summary'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.js', 'frontend/app/expenses/**/*.{ts,tsx}'],
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
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/app/expenses'),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  }
});
