import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const withFiles = configs =>
  configs.map(config => ({
    ...config,
    files: config.files ?? ['**/*.{ts,tsx}'],
  }));

export default [
  {
    ignores: ['eslint.config.mjs', 'node_modules/**', 'dist/**'],
  },
  ...withFiles(compat.config(require('./.eslintrc.json'))),
];
