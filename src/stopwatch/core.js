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
  
  // This function returns an object with methods to control the stopwatch.
  // It uses a closure to keep the startTime and laps private.
  export function createStopwatch() {
    let startTime = 0;
    let laps = [];
  
    return {
      // Expose the state for testing purposes
      get startTime() {
        return startTime;
      },
      get laps() {
        return laps;
      },
  
      // Methods to control the stopwatch
      start() {
        startTime = Date.now();
        laps = []; // Reset laps every time it starts
      },
  
      lap() {
        if (startTime === 0) return; // Can't record a lap if not started
        const now = Date.now();
        // This lap logic was a bit buggy, let's fix it:
        const lastTime = laps.reduce((sum, lap) => sum + lap.time, startTime);
        const lapTime = now - lastTime;
        laps.push({ time: lapTime });
      },
    };
  }
