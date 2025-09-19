import { describe, it, expect } from 'vitest';

// We will simulate the CLI by spawning a Node process
import { spawnSync } from 'node:child_process';

function runHelloCLI(args = []) {
  const result = spawnSync('node', ['src/hello/index.js', ...args], {
    encoding: 'utf8'
  });
  return result;
}

describe('Hello CLI negative cases', () => {
  it('should fail with usage help when --shout is provided without a name', () => {
    const { status, stderr } = runHelloCLI(['--shout']);
    expect(status).not.toBe(0);
    expect(stderr).toContain('requires a name');
  });
});
