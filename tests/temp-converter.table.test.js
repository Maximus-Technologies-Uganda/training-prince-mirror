import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

function run(args) {
  return spawnSync('node', ['src/temp-converter/index.js', ...args], { encoding: 'utf8' });
}

describe('temp-converter CLI table-driven', () => {
  const cases = [
    // Valid conversions
    { name: 'C to F basic', args: ['0', '--from', 'C', '--to', 'F'], ok: true, expectOut: '0°C is 32.00°F' },
    { name: 'F to C basic', args: ['32', '--from', 'F', '--to', 'C'], ok: true, expectOut: '32°F is 0.00°C' },
    { name: 'C to F boiling', args: ['100', '--from', 'C', '--to', 'F'], ok: true, expectOut: '100°C is 212.00°F' },
    { name: 'F to C boiling', args: ['212', '--from', 'F', '--to', 'C'], ok: true, expectOut: '212°F is 100.00°C' },
    { name: 'lowercase flags c->f', args: ['100', '--from', 'c', '--to', 'f'], ok: true, expectOut: '100°C is 212.00°F' },
    { name: 'lowercase flags f->c', args: ['212', '--from', 'f', '--to', 'c'], ok: true, expectOut: '212°F is 100.00°C' },
    { name: 'decimal temperature', args: ['36.5', '--from', 'C', '--to', 'F'], ok: true, expectOut: '36.5°C is 97.70°F' },
    { name: 'negative temperature', args: ['-20', '--from', 'C', '--to', 'F'], ok: true, expectOut: '-20°C is -4.00°F' },
    
    // Error cases
    { name: 'identical units error', args: ['100', '--from', 'C', '--to', 'C'], ok: false, expectErr: 'Cannot convert from C to C (identical units)' },
    { name: 'identical units error F', args: ['100', '--from', 'F', '--to', 'F'], ok: false, expectErr: 'Cannot convert from F to F (identical units)' },
    { name: 'invalid unit error', args: ['100', '--from', 'X', '--to', 'F'], ok: false, expectErr: 'Invalid units. Must be C or F, got: X and F' },
    { name: 'invalid unit error both', args: ['100', '--from', 'K', '--to', 'R'], ok: false, expectErr: 'Invalid units. Must be C or F, got: K and R' },
    { name: 'non-numeric temp', args: ['abc', '--from', 'C', '--to', 'F'], ok: false, expectErr: 'Usage' },
    { name: 'missing temperature', args: ['--from', 'C', '--to', 'F'], ok: false, expectErr: 'Usage' },
    { name: 'missing from unit', args: ['100', '--to', 'F'], ok: false, expectErr: 'Usage' },
    { name: 'missing to unit', args: ['100', '--from', 'C'], ok: false, expectErr: 'Usage' },
    { name: 'empty temperature', args: ['', '--from', 'C', '--to', 'F'], ok: false, expectErr: 'Usage' },
    { name: 'whitespace temperature', args: ['   ', '--from', 'C', '--to', 'F'], ok: false, expectErr: 'Usage' },
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
