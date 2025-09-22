import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

function run(args) {
  return spawnSync('node', ['src/temp-converter/index.js', ...args], { encoding: 'utf8' });
}

describe('temp-converter CLI table-driven', () => {
  const cases = [
    { name: 'lowercase flags c->f', args: ['100', '--from', 'c', '--to', 'f'], ok: true, expectOut: '100°C is 212.00°F' },
    { name: 'identical units error', args: ['100', '--from', 'C', '--to', 'C'], ok: false, expectErr: 'Invalid units' },
    { name: 'invalid unit error', args: ['100', '--from', 'X', '--to', 'F'], ok: false, expectErr: 'Invalid units' },
    { name: 'non-numeric temp', args: ['abc', '--from', 'C', '--to', 'F'], ok: false, expectErr: 'Usage' },
  ];

  for (const tc of cases) {
    it(tc.name, () => {
      const { status, stdout, stderr } = run(tc.args);
      if (tc.ok) {
        expect(status).toBe(0);
        expect(stdout.trim()).toContain(tc.expectOut);
      } else {
        expect(status).not.toBe(0);
        expect((stderr || '').toString()).toContain(tc.expectErr);
      }
    });
  }
});
