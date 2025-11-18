const globals = require('globals');

module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  ignorePatterns: [
    'node_modules/',
    'api/',
    'frontend/',
    'api/dist/',
    'frontend/dist/',
    'coverage/',
    'dist/',
    'playwright-report/',
    'test-results/',
    'frontend/node_modules/',
    'api/node_modules/',
    'scripts/**',
    'specs/**',
    'tests/**',
    '*.mjs',
    '**/*.d.ts',
  ],
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['**/*.config.{js,cjs,mjs,ts}', 'vitest.config.{js,ts}'],
      env: {
        node: true,
      },
    },
    {
      files: ['scripts/**/*.{js,mjs}'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: [
        'tests/**/*.{js,mjs,cjs}',
        '**/*.test.{js,mjs,cjs}',
        '**/*.spec.{js,mjs,cjs}',
      ],
      env: {
        node: true,
      },
      globals: {
        ...globals.vitest,
      },
    },
    {
      files: ['**/*.ts', '**/*.mts', '**/*.cts'],
      excludedFiles: ['api/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
        project: null,
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
