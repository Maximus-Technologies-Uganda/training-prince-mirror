import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const rootLegacy = require('./.eslintrc.cjs');
const apiLegacy = require('./api/.eslintrc.json');
const frontendLegacy = require('./frontend/.eslintrc.json');

if (apiLegacy?.parserOptions?.project === './tsconfig.json') {
  apiLegacy.parserOptions.project = './api/tsconfig.json';
}

const withFiles = (configs, files) =>
  configs.map(config => ({
    ...config,
    files,
  }));

export default [
  ...compat.config(rootLegacy),
  ...withFiles(compat.config(apiLegacy), ['api/**/*.{ts,tsx}']),
  ...withFiles(compat.config(frontendLegacy), ['frontend/**/*.{js,jsx,ts,tsx}']),
];
