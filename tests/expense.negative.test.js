import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

function runExpenseCLI(args = []) {
  const result = spawnSync('node', ['src/expense/index.js', ...args], {
    encoding: 'utf8'
  });
  return result;
}

describe('Expense CLI negative cases', () => {
  it('should error when --amount is non-numeric', () => {
    const { status, stderr } = runExpenseCLI(['add', '--amount', 'abc', '--category', 'food']);
    expect(status).not.toBe(0);
    expect(stderr).toContain('must be a number');
  });
});
