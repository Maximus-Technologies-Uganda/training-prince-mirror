import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

// Simple SPA routing middleware plugin
const spaFallbackPlugin = {
  name: 'spa-fallback',
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        // If the request is for a file with an extension, skip
        if (req.url.includes('.') || req.url.startsWith('/node_modules')) {
          next();
          return;
        }
        
        // For all other requests (routes), serve index.html
        req.url = '/';
        next();
      });
    };
  },
};

export default defineConfig({
  plugins: [spaFallbackPlugin],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        stopwatch: resolve(__dirname, 'stopwatch.html'),
        todo: resolve(__dirname, 'todo.html'),
        temp: resolve(__dirname, 'temp.html'),
        expense: resolve(__dirname, 'expense.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  preview: {
    port: 5173,
    host: true,
  },
  server: {
    middlewareMode: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
});
