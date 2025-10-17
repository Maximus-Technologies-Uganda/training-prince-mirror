import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

function run(args) {
  return spawnSync('node', ['src/hello/index.js', ...args], { encoding: 'utf8' });
}

describe('Hello CLI version flag', () => {
  it('shows version information', () => {
    const result = run(['--version']);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('Hello CLI v1.0.0');
  });

  it('shows version even with other arguments', () => {
    const result = run(['Alice', '--version']);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('Hello CLI v1.0.0');
  });

  it('shows version with shout flag', () => {
    const result = run(['--version', '--shout']);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('Hello CLI v1.0.0');
  });
});
