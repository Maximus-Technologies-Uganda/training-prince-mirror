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

  it('should error on unknown flag for add', () => {
    const { status, stderr } = runExpenseCLI(['add', '--amount', '10', '--category', 'food', '--bogus']);
    expect(status).not.toBe(0);
    expect(stderr).toContain('Unknown flag(s): --bogus');
  });

  it('should error on unknown flag for total', () => {
    const { status, stderr } = runExpenseCLI(['total', '--weird']);
    expect(status).not.toBe(0);
    expect(stderr).toContain('Unknown flag(s): --weird');
  });

  it('should error on unknown flag for list', () => {
    const { status, stderr } = runExpenseCLI(['list', '--extra']);
    expect(status).not.toBe(0);
    expect(stderr).toContain('Unknown flag(s): --extra');
  });
});
