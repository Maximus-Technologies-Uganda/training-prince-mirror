import { describe, it, expect } from 'vitest';
import { createUiState, start, stop, reset, lap, exportCsv } from './index.js';

function makeClock(times) {
  let idx = 0;
  return { nowMs: () => times[idx++] };
}

describe('ui-stopwatch CSV export', () => {
  it('empty state -> header only', () => {
    const s = createUiState();
    expect(exportCsv(s)).toBe('Lap,Time');
  });

  it('golden with laps', () => {
    const s0 = createUiState();
    const clock = makeClock([1000, 1600, 2200, 3000]);
    const { state: s1 } = start(s0, clock);
    const { state: s2 } = lap(s1, clock); // 600ms
    const { state: s3 } = lap(s2, clock); // +600ms
    const { state: s4 } = stop(s3, clock); // total 2000ms
    const csv = exportCsv(s4);
    expect(csv).toBe(['Lap,Time', '1,00:00.600', '2,00:00.600'].join('\n'));
  });

  it('lap accumulates elapsedMs and stop preserves value', () => {
    const clock = makeClock([1000, 1600, 1900]);
    const { state: running } = start(createUiState(), clock);
    const { state: afterLap } = lap(running, clock); // +600ms
    expect(afterLap.elapsedMs).toBe(600);
    const { state: stopped } = stop(afterLap, clock); // +300ms
    expect(stopped.elapsedMs).toBe(900);
    expect(stopped.isRunning).toBe(false);
  });
});

describe('ui-stopwatch guards', () => {
  it('prevents start while already running', () => {
    const s0 = createUiState();
    const clock = makeClock([1000]);
    const { state: s1 } = start(s0, clock);
    const r = start(s1, clock);
    expect(r.error).toBeDefined();
  });

  it('prevents stop when not running', () => {
    const s0 = createUiState();
    const r = stop(s0);
    expect(r.error).toBeDefined();
  });

  it('prevents reset while running', () => {
    const s0 = createUiState();
    const clock = makeClock([1000]);
    const { state: s1 } = start(s0, clock);
    const r = reset(s1);
    expect(r.error).toBeDefined();
  });
});


