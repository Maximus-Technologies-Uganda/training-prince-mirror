/**
 * Stopwatch UI Module
 * Main entry point for stopwatch functionality
 * Handles: timer control (start/stop/reset), lap recording, state management, DOM updates
 */

// Timer state object
let timerState = {
  startTime: null,
  isRunning: false,
  laps: [],
};

// Animation frame ID for timer display updates
let animationFrameId = null;

// Debounce tracking for lap recording
let lastLapTime = 0;
const LAP_DEBOUNCE_MS = 100;

/**
 * Internal reset function for testing (resets debounce timer and state)
 * @private
 */
function __resetForTesting() {
  timerState = {
    startTime: null,
    isRunning: false,
    laps: [],
  };
  lastLapTime = 0;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/**
 * Start the timer
 * @returns {Object} {success: boolean, newState: Object}
 */
export function startTimer() {
  try {
    timerState.startTime = Date.now();
    timerState.isRunning = true;
    persistState(timerState);
    return { success: true, newState: { ...timerState } };
  } catch (error) {
    console.error('Error starting timer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Stop the timer
 * @returns {Object} {success: boolean, newState: Object}
 */
export function stopTimer() {
  try {
    timerState.isRunning = false;
    persistState(timerState);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    return { success: true, newState: { ...timerState } };
  } catch (error) {
    console.error('Error stopping timer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Reset the timer
 * @returns {Object} {success: boolean, newState: Object}
 */
export function resetTimer() {
  try {
    timerState = {
      startTime: null,
      isRunning: false,
      laps: [],
    };
    localStorage.removeItem('stopwatchState');
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    return { success: true, newState: { ...timerState } };
  } catch (error) {
    console.error('Error resetting timer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Record a lap with 100ms debounce
 * @returns {Object} {success: boolean, newLap?: number, newState?: Object, error?: string}
 */
export function recordLap() {
  try {
    if (!timerState.isRunning) {
      return { success: false, error: 'Timer not running' };
    }

    const now = Date.now();
    if (now - lastLapTime < LAP_DEBOUNCE_MS) {
      return { success: false, error: 'Lap debounce active' };
    }

    lastLapTime = now;
    timerState.laps.push(now);
    persistState(timerState);

    return {
      success: true,
      newLap: now,
      newState: { ...timerState },
    };
  } catch (error) {
    console.error('Error recording lap:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Persist current timer state to localStorage
 * @param {Object} state - Timer state to persist
 */
export function persistState(state) {
  try {
    localStorage.setItem('stopwatchState', JSON.stringify(state));
  } catch (error) {
    if (error.name === 'SecurityError') {
      console.warn('localStorage not available (private browsing mode)');
    } else {
      console.error('Error persisting state:', error);
    }
  }
}

/**
 * Restore timer state from localStorage
 * @returns {Object} Restored state or default state
 */
export function restoreState() {
  try {
    const stored = localStorage.getItem('stopwatchState');
    if (!stored) {
      return { startTime: null, isRunning: false, laps: [], resumed: false };
    }

    const restored = JSON.parse(stored);
    const resumed = restored.isRunning === true;

    if (resumed) {
      console.log('Session-only mode: Timer resumed from checkpoint');
    }

    timerState = restored;
    return { ...restored, resumed };
  } catch (error) {
    console.error('Error restoring state:', error);
    console.warn('Session-only mode: localStorage unavailable');
    return { startTime: null, isRunning: false, laps: [], resumed: false };
  }
}

// Export for testing purposes
export { __resetForTesting };
