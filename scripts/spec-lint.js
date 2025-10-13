#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['.specify/scripts/spec-lint.js'], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);


