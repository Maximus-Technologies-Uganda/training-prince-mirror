/**
 * Stopwatch UI Module
 * Main entry point for stopwatch functionality
 * Handles: timer control (start/stop/reset), lap recording, state management, DOM updates
 */

// Import formatTime utility
import { formatTime } from './utils.js';

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

// Track last display update time for throttling
let lastDisplayUpdateTime = 0;
const DISPLAY_UPDATE_INTERVAL_MS = 100; // Update display every 100ms

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
  lastDisplayUpdateTime = 0;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/**
 * Update timer display with current elapsed time
 * Uses requestAnimationFrame for smooth updates
 * @private
 */
function updateTimerDisplay() {
  if (!timerState.isRunning || !timerState.startTime) {
    return;
  }

  const now = Date.now();
  
  // Throttle display updates to 100-500ms interval
  if (now - lastDisplayUpdateTime < DISPLAY_UPDATE_INTERVAL_MS) {
    animationFrameId = requestAnimationFrame(updateTimerDisplay);
    return;
  }

  const elapsedMs = now - timerState.startTime;
  const displayElement = document.querySelector('.timer-display');
  
  if (displayElement) {
    displayElement.textContent = formatTime(elapsedMs);
  }

  lastDisplayUpdateTime = now;
  
  // Continue animation loop if timer is still running
  if (timerState.isRunning) {
    animationFrameId = requestAnimationFrame(updateTimerDisplay);
  }
}

/**
 * Force update the timer display (regardless of running state)
 * Used for UI updates after pause/reset/resume
 * @private
 */
function forceUpdateDisplay() {
  const displayElement = document.querySelector('.timer-display');
  if (!displayElement) {
    return;
  }

  if (timerState.isRunning && timerState.startTime) {
    const now = Date.now();
    const elapsedMs = now - timerState.startTime;
    displayElement.textContent = formatTime(elapsedMs);
  } else if (timerState.startTime === null) {
    // Reset state - show 00:00:00
    displayElement.textContent = formatTime(0);
  } else {
    // Paused state - show paused time
    const displayElement = document.querySelector('.timer-display');
    // The display will already be showing the paused time, so no update needed
  }
}

/**
 * Update lap list display with current recorded laps
 * Derives LapRecords from current state and renders each lap
 * @private
 */
function updateLapListDisplay() {
  const lapListContainer = document.querySelector('.laps-display');
  if (!lapListContainer) {
    return;
  }

  // If no laps, show empty state
  if (!timerState.laps || timerState.laps.length === 0) {
    lapListContainer.innerHTML = '';
    return;
  }

  // Validate we have startTime to calculate durations
  if (timerState.startTime === null) {
    lapListContainer.innerHTML = '';
    return;
  }

  // Derive lap records from current state
  const lapRecords = deriveLapRecords(timerState);
  
  // Render each lap as an HTML element
  const lapHTML = lapRecords
    .map(lap => {
      // Format lap display: "Lap N: 00:MM:SS (Duration: 00:MM:SS)"
      const lapNumberText = `Lap ${lap.lapNumber}`;
      const absoluteTimeText = lap.absoluteElapsedTimeDisplay;
      const lapDurationText = lap.lapDurationDisplay;
      
      return `<div class="lap-item" data-testid="lap-item">
        <div class="lap-info">
          <span class="lap-number">${lapNumberText}</span>
          <span class="lap-time">Total: ${absoluteTimeText}</span>
        </div>
        <div class="lap-duration">
          Duration: ${lapDurationText}
        </div>
      </div>`;
    })
    .join('');
  
  lapListContainer.innerHTML = lapHTML;
}

/**
 * Derive lap records from current state
 * This function transforms the raw laps array into display-ready records
 * @private
 * @returns {Array} Array of lap record objects
 */
function deriveLapRecords(state) {
  if (!state || !Array.isArray(state.laps) || state.laps.length === 0) {
    return [];
  }

  if (state.startTime === null) {
    return [];
  }

  return state.laps.map((lapTimestamp, index) => {
    const lapNumber = index + 1;
    const absoluteElapsedTime = lapTimestamp - state.startTime;
    const lapDuration = index === 0
      ? absoluteElapsedTime
      : lapTimestamp - state.laps[index - 1];

    return {
      lapNumber,
      recordedAtTimestamp: lapTimestamp,
      absoluteElapsedTime,
      lapDuration,
      absoluteElapsedTimeDisplay: formatTime(absoluteElapsedTime),
      lapDurationDisplay: formatTime(lapDuration),
    };
  });
}

/**
 * Get current timer state (for exporter and external use)
 * @private
 * @returns {Object} Current timerState
 */
function getTimerState() {
  return { ...timerState };
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
    
    // Start the display animation loop
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(updateTimerDisplay);
    
    return { success: true, newState: { ...timerState } };
  } catch (error) {
    console.error('Error starting timer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Pause the timer (stops without resetting)
 * @returns {Object} {success: boolean, newState: Object}
 */
export function pauseTimer() {
  try {
    timerState.isRunning = false;
    persistState(timerState);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    return { success: true, newState: { ...timerState } };
  } catch (error) {
    console.error('Error pausing timer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Resume the timer (continues from paused state)
 * @returns {Object} {success: boolean, newState: Object}
 */
export function resumeTimer() {
  try {
    if (timerState.startTime === null) {
      return { success: false, error: 'No previous start time' };
    }
    timerState.isRunning = true;
    persistState(timerState);
    
    // Restart the display animation loop
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(updateTimerDisplay);
    
    return { success: true, newState: { ...timerState } };
  } catch (error) {
    console.error('Error resuming timer:', error);
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
    
    // Update lap list display and timer display
    updateLapListDisplay();
    forceUpdateDisplay();
    
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
    
    // Update lap list display after recording lap
    updateLapListDisplay();

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

/**
 * Provide access to updateTimerDisplay for manual updates (if needed)
 * @private
 */
function startDisplayAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  animationFrameId = requestAnimationFrame(updateTimerDisplay);
}

/**
 * Update button visibility and state based on timer state
 * @private
 */
function updateButtonStates() {
  const startBtn = document.querySelector('.start-btn');
  const pauseBtn = document.querySelector('.pause-btn');
  const resumeBtn = document.querySelector('.resume-btn');
  const stopBtn = document.querySelector('.stop-btn');
  const lapBtn = document.querySelector('.lap-btn');
  const clearLapsBtn = document.querySelector('.clear-laps-btn');
  const exportBtn = document.querySelector('.export-btn');

  if (timerState.isRunning) {
    // Timer is running
    if (startBtn) startBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = false;
    if (resumeBtn) resumeBtn.disabled = true;
    if (lapBtn) lapBtn.disabled = false;
  } else if (timerState.startTime !== null) {
    // Timer is paused (has a start time but not running)
    if (startBtn) startBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = true;
    if (resumeBtn) resumeBtn.disabled = false;
    if (lapBtn) lapBtn.disabled = true;
  } else {
    // Timer is not started or reset
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    if (resumeBtn) resumeBtn.disabled = true;
    if (lapBtn) lapBtn.disabled = true;
  }

  // Reset and Export buttons are always enabled
  if (stopBtn) stopBtn.disabled = false;
  if (clearLapsBtn) clearLapsBtn.disabled = false;
  if (exportBtn) exportBtn.disabled = false;
}

/**
 * Initialize button event handlers
 * Wires all buttons to their corresponding timer functions
 * @private
 */
function initializeButtonHandlers() {
  const startBtn = document.querySelector('.start-btn');
  const pauseBtn = document.querySelector('.pause-btn');
  const resumeBtn = document.querySelector('.resume-btn');
  const stopBtn = document.querySelector('.stop-btn');
  const lapBtn = document.querySelector('.lap-btn');
  const clearLapsBtn = document.querySelector('.clear-laps-btn');
  const exportBtn = document.querySelector('.export-btn');

  // Start button
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startTimer();
      updateButtonStates();
      updateTimerDisplay();
    });
  }

  // Pause button (maps to pauseTimer)
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      pauseTimer();
      updateButtonStates();
      updateTimerDisplay();
    });
  }

  // Resume button (maps to resumeTimer)
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      resumeTimer();
      updateButtonStates();
      updateTimerDisplay();
    });
  }

  // Reset button (maps to resetTimer)
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      resetTimer();
      updateButtonStates();
      updateTimerDisplay();
    });
  }

  // Lap button
  if (lapBtn) {
    lapBtn.addEventListener('click', () => {
      recordLap();
      updateButtonStates();
      updateLapListDisplay();
    });
  }

  // Clear Laps button (maps to resetTimer for clearing laps)
  if (clearLapsBtn) {
    clearLapsBtn.addEventListener('click', () => {
      resetTimer();
      updateButtonStates();
      updateTimerDisplay();
    });
  }

  // Export CSV button
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      try {
        const exporter = await import('./exporter.js');
        exporter.exportToCSV();
      } catch (error) {
        console.error('Error exporting CSV:', error);
      }
    });
  }
}

/**
 * Public initialization function for the Stopwatch UI
 * Restores state from localStorage and initializes button handlers
 * Call this when the DOM is ready (e.g., in DOMContentLoaded event)
 * @public
 */
export function initializeStopwatch() {
  // Restore state from localStorage if available
  const restored = restoreState();
  if (restored) {
    timerState = {
      startTime: restored.startTime,
      isRunning: restored.isRunning,
      laps: restored.laps,
    };
  }

  // Initialize button event handlers
  initializeButtonHandlers();

  // Update button states based on current timer state
  updateButtonStates();

  // Update lap list display
  updateLapListDisplay();

  // If timer was running before page reload, resume the display
  if (timerState.isRunning && timerState.startTime) {
    startDisplayAnimation();
  }
}

// Export for testing purposes
export { __resetForTesting, getTimerState, startDisplayAnimation, updateLapListDisplay, initializeButtonHandlers, updateButtonStates };
