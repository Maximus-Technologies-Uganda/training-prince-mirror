import { formatTime } from '../../../src/stopwatch/core.js';
import { exportLapsAsTable } from '../../../src/stopwatch/exporter.js';
import './styles.css';
import { createClock } from './clock.js';

export function createUiState() {
  return { isRunning: false, startedAt: 0, elapsedMs: 0, laps: [] };
}

export function start(state, clock) {
  if (state.isRunning) {
    return { state, error: 'Already running' };
  }
  const now = clock?.nowMs ? clock.nowMs() : Date.now();
  return { state: { ...state, isRunning: true, startedAt: now, elapsedMs: 0 } };
}

export function stop(state, clock) {
  if (!state.isRunning) {
    return { state, error: 'Not running' };
  }
  const now = clock?.nowMs ? clock.nowMs() : Date.now();
  const elapsed = now - state.startedAt;
  return { state: { ...state, isRunning: false, startedAt: 0, elapsedMs: elapsed } };
}

export function reset(state) {
  if (state.isRunning) {
    return { state, error: 'Cannot reset while running' };
  }
  return { state: { isRunning: false, startedAt: 0, elapsedMs: 0, laps: [] } };
}

export function lap(state, clock) {
  if (!state.isRunning) {
    return { state, error: 'Not running' };
  }
  const now = clock?.nowMs ? clock.nowMs() : Date.now();
  const elapsedSoFar = now - state.startedAt;
  const totalOfPrevious = state.laps.reduce((sum, t) => sum + t, 0);
  const thisLap = elapsedSoFar - totalOfPrevious;
  return { state: { ...state, laps: [...state.laps, thisLap], elapsedMs: elapsedSoFar } };
}

export function exportCsv(state) {
  const header = 'Lap,Time';
  if (!state.laps?.length) return header;
  // Reuse exporter format but convert tabs to commas
  const table = exportLapsAsTable(state.laps.map((t) => ({ time: t })));
  return table.replaceAll('\t', ',');
}

function getElements() {
  return {
    startBtn: document.getElementById('sw-start'),
    stopBtn: document.getElementById('sw-stop'),
    resetBtn: document.getElementById('sw-reset'),
    lapBtn: document.getElementById('sw-lap'),
    exportBtn: document.getElementById('sw-export'),
    timeText: document.getElementById('sw-time'),
    lapsList: document.getElementById('sw-laps'),
    error: document.getElementById('sw-error'),
  };
}

function render(state, els) {
  if (els.timeText) {
    els.timeText.textContent = formatTime(state.elapsedMs);
  }
  if (els.lapsList) {
    els.lapsList.innerHTML = '';
    state.laps.forEach((ms, i) => {
      const li = document.createElement('li');
      li.textContent = `Lap ${i + 1}: ${formatTime(ms)}`;
      els.lapsList.appendChild(li);
    });
  }
}

export function initStopwatchUI() {
  const els = getElements();
  if (!els.timeText) return;
  const clock = createClock('Africa/Kampala');
  const state = createUiState();
  // Accessibility attributes
  els.timeText.setAttribute?.('aria-live', 'polite');
  els.timeText.setAttribute?.('role', 'status');
  els.startBtn?.setAttribute?.('aria-label', 'Start stopwatch');
  els.stopBtn?.setAttribute?.('aria-label', 'Stop stopwatch');
  els.resetBtn?.setAttribute?.('aria-label', 'Reset stopwatch');
  els.lapBtn?.setAttribute?.('aria-label', 'Record lap');
  els.exportBtn?.setAttribute?.('aria-label', 'Export laps as CSV');
  render(state, els);

  els.startBtn?.addEventListener('click', () => {
    els.error.textContent = '';
    const r = start(state, clock);
    if (r.error) return (els.error.textContent = r.error);
    Object.assign(state, r.state);
  });

  els.stopBtn?.addEventListener('click', () => {
    els.error.textContent = '';
    const r = stop(state, clock);
    if (r.error) return (els.error.textContent = r.error);
    Object.assign(state, r.state);
    render(state, els);
  });

  els.resetBtn?.addEventListener('click', () => {
    els.error.textContent = '';
    const r = reset(state);
    if (r.error) return (els.error.textContent = r.error);
    Object.assign(state, r.state);
    render(state, els);
  });

  els.lapBtn?.addEventListener('click', () => {
    els.error.textContent = '';
    const r = lap(state, clock);
    if (r.error) return (els.error.textContent = r.error);
    Object.assign(state, r.state);
    render(state, els);
  });

  els.exportBtn?.addEventListener('click', () => {
    els.error.textContent = '';
    const csv = exportCsv(state);
    // In tests, we just return; UI could trigger download.
    console.log(csv);
  });
}


