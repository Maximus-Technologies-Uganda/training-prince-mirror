import path from 'node:path';
import { defineConfig } from 'vitest/config';

const ROOT = __dirname;

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest.setup.ts'],
  include: ['tests/{unit,component}/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: path.join(ROOT, 'coverage', 'ui'),
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['app/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
      thresholds: {
        statements: 55,
        branches: 55,
        functions: 55,
        lines: 55,
      },
    },
  },
  resolve: {
    alias: {
      '@/app': path.join(ROOT, 'app'),
      '@/components': path.join(ROOT, 'app/expenses/components'),
      '@/config': path.join(ROOT, 'config'),
      '@/context': path.join(ROOT, 'app/expenses/context'),
      '@/hooks': path.join(ROOT, 'app/expenses/hooks'),
      '@/lib': path.join(ROOT, 'lib'),
      '@/models': path.join(ROOT, 'app/expenses/models'),
      '@/utils': path.join(ROOT, 'app/expenses/utils'),
    },
  },
});
