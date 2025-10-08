import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const clockQueue = [];

vi.mock('./clock.js', () => ({
  createClock: () => ({
    nowMs: () => {
      if (!clockQueue.length) {
        throw new Error('Clock queue exhausted');
      }
      return clockQueue.shift();
    },
  }),
}));

import { createUiState, start, stop, reset, lap, exportCsv, initStopwatchUI } from './index.js';

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

describe('ui-stopwatch DOM wiring', () => {
  beforeEach(() => {
    clockQueue.length = 0;
    document.body.innerHTML = `
      <div>
        <div id="sw-time">00:00.000</div>
        <div id="sw-error"></div>
        <ul id="sw-laps"></ul>
        <button id="sw-start">Start</button>
        <button id="sw-stop">Stop</button>
        <button id="sw-reset">Reset</button>
        <button id="sw-lap">Lap</button>
        <button id="sw-export">Export</button>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('updates UI through button events and logs CSV', () => {
    clockQueue.push(1000, 1600, 2100, 2600);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    initStopwatchUI();
    const startBtn = document.getElementById('sw-start');
    const lapBtn = document.getElementById('sw-lap');
    const stopBtn = document.getElementById('sw-stop');
    const resetBtn = document.getElementById('sw-reset');
    const exportBtn = document.getElementById('sw-export');
    const error = document.getElementById('sw-error');
    const time = document.getElementById('sw-time');
    const lapsList = document.getElementById('sw-laps');

    startBtn.click();
    lapBtn.click();
    stopBtn.click();

    expect(time.textContent).toBe('00:01.100');
    expect(lapsList.children).toHaveLength(1);

    stopBtn.click();
    expect(error.textContent).toBe('Not running');

    resetBtn.click();
    expect(time.textContent).toBe('00:00.000');
    exportBtn.click();
    expect(logSpy).toHaveBeenCalled();
  });
});

describe('clock factory', () => {
  it('uses provided nowFn', async () => {
    const actual = await vi.importActual('./clock.js');
    const clock = actual.createClock('Africa/Kampala', () => 1234);
    expect(clock.nowMs()).toBe(1234);
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


