import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

function runTempCLI(args = []) {
  const result = spawnSync('node', ['src/temp-converter/index.js', ...args], {
    encoding: 'utf8'
  });
  return result;
}

describe('Temperature Converter CLI negative cases', () => {
  it('should error when identical units are provided', () => {
    const { status, stderr } = runTempCLI(['100', '--from', 'C', '--to', 'C']);
    expect(status).not.toBe(0);
    expect(stderr).toContain('Cannot convert from C to C (identical units)');
  });

  it('should show usage when arguments are missing', () => {
    const { status, stderr } = runTempCLI([]);
    expect(status).not.toBe(0);
    expect(stderr).toContain('Usage:');
  });
});
