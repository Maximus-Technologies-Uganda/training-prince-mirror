import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  preview: {
    port: 5173,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
});
