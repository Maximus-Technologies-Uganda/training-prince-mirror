import fs from 'fs';
const DB_FILE = 'data/stopwatch.json';


/**
 * A pure function to format milliseconds into mm:ss.ms format.
 * @param {number} ms - The total number of milliseconds.
 * @returns {string} The formatted time string.
 */
export function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  const paddedMilliseconds = String(milliseconds).padStart(3, '0');

  return `${paddedMinutes}:${paddedSeconds}.${paddedMilliseconds}`;
}

/**
 * This function returns an object with methods to control the stopwatch.
 */
export function createStopwatch() {
  let startTime = 0;
  let laps = [];

  return {
    get startTime() {
      return startTime;
    },
    get laps() {
      return laps;
    },

    start() {
      startTime = Date.now();
      laps = [];
    },

    lap() {
      if (startTime === 0) {
        throw new Error('Stopwatch has not been started.');
      }
      const now = Date.now();
      const lastTime = laps.reduce((sum, lap) => sum + lap.time, startTime);
      const lapTime = now - lastTime;
      laps.push({ time: lapTime });
    },
  };
}

export function saveState(state) {
  const data = JSON.stringify(state, null, 2);
  fs.writeFileSync(DB_FILE, data);
}

export function loadState() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If no file, return a default state
    return { startTime: 0, laps: [] };
  }
}