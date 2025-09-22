import { describe, it, expect } from 'vitest';
import { exportLapsAsTable } from '../src/stopwatch/exporter.js';

function normalize(s) {
  return s.replace(/\r\n/g, '\n');
}

describe('stopwatch exporter', () => {
  it('renders empty state header only', () => {
    const out = exportLapsAsTable([]);
    expect(normalize(out)).toBe('Lap\tTime');
  });

  it('renders header and rows with formatted times', () => {
    const laps = [ { time: 65123 }, { time: 250 } ];
    const out = exportLapsAsTable(laps);
    expect(normalize(out)).toBe(['Lap\tTime','1\t01:05.123','2\t00:00.250'].join('\n'));
  });
});
