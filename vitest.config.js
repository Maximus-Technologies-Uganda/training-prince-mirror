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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html', 'text'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.js'],
      exclude: [
        'src/**/*.test.js',
        'src/**/*.spec.js',
        'node_modules/**',
        'coverage/**'
      ]
    }
  }
});
