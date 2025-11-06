#!/usr/bin/env node
import { createStopwatch, formatTime } from './core.js';
import fs from 'node:fs';
import path from 'node:path';

function showHelp() {
  console.log('--- Stopwatch CLI ---');
  console.log('Usage:');
  console.log('  node src/stopwatch/index.js start');
  console.log('  node src/stopwatch/index.js lap');
  console.log('Notes: This is a simple in-memory stopwatch by core design, but the CLI persists state to a file so commands can be run separately.');
}

const stateFilePath = path.resolve(process.cwd(), 'data', '.stopwatch-state.json');

function readState() {
  try {
    const raw = fs.readFileSync(stateFilePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { startTime: 0, laps: [] };
  }
}

function writeState(state) {
  // Ensure data directory exists
  const dataDir = path.dirname(stateFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(stateFilePath, JSON.stringify(state), 'utf8');
}

function run(argv = process.argv.slice(2)) {
  const command = argv[0];

  if (!command) {
    showHelp();
    return;
  }

  try {
    if (command === 'start') {
      const state = { startTime: Date.now(), laps: [] };
      writeState(state);
      console.log('Stopwatch started.');
    } else if (command === 'lap') {
      const state = readState();
      if (!state.startTime || state.startTime === 0) {
        throw new Error('Stopwatch has not been started.');
      }
      const now = Date.now();
      const totalElapsedBefore = state.laps.reduce((sum, t) => sum + t, 0);
      const lastAnchor = state.startTime + totalElapsedBefore;
      const lapTime = now - lastAnchor;
      state.laps.push(lapTime);
      writeState(state);
      console.log(`Lap ${state.laps.length}: ${formatTime(lapTime)}`);
    } else if (command === 'reset') {
      writeState({ startTime: 0, laps: [] });
      console.log('Stopwatch reset.');
    } else {
      showHelp();
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// Only call run() if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  run();
}

export { run };
