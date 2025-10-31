/**
 * Data Models: Stopwatch UI
 * 
 * This module defines the core data structures and validation logic for the Stopwatch UI.
 * 
 * Phase: 3.3 (Models & Utilities)
 * Task: T008 - Implement TimerState data model & validation
 */

/**
 * Default/initial TimerState
 * Used as the reset state or when no state has been created
 */
const DEFAULT_STATE = {
  startTime: null,
  isRunning: false,
  laps: []
};

/**
 * Validates a TimerState object
 * 
 * Validation Rules:
 * 1. startTime must be null or a Unix timestamp (positive number in milliseconds)
 * 2. isRunning must be a boolean
 * 3. laps must be an array
 * 4. All lap timestamps must be numbers
 * 5. laps array must be sorted in ascending order
 * 6. If isRunning=true, startTime must not be null
 * 7. startTime must not be in the future (clock skew guard)
 * 
 * @param {Object} state - The state object to validate
 * @returns {Object} Validation result: { isValid: boolean, errors: string[] }
 */
function validateTimerState(state) {
  const errors = [];

  // Check state is an object
  if (!state || typeof state !== 'object') {
    return { isValid: false, errors: ['State must be an object'] };
  }

  // Validate startTime
  if (state.startTime !== null && typeof state.startTime !== 'number') {
    errors.push('startTime must be null or a number (Unix timestamp in ms)');
  }

  // If startTime is a number, verify it's a reasonable timestamp
  if (typeof state.startTime === 'number') {
    if (state.startTime < 0) {
      errors.push('startTime must be non-negative');
    }
    // Clock skew guard: warn if startTime is in the future
    if (state.startTime > Date.now() + 60000) {
      // Allow 1 minute tolerance for clock skew
      errors.push('startTime appears to be in the future (possible clock skew)');
    }
  }

  // Validate isRunning
  if (typeof state.isRunning !== 'boolean') {
    errors.push('isRunning must be a boolean');
  }

  // Validate laps array
  if (!Array.isArray(state.laps)) {
    errors.push('laps must be an array');
  } else {
    // Validate all lap elements are numbers
    for (let i = 0; i < state.laps.length; i++) {
      if (typeof state.laps[i] !== 'number') {
        errors.push(`laps[${i}] must be a number (Unix timestamp in ms)`);
      }
    }

    // Validate laps are sorted in ascending order
    for (let i = 1; i < state.laps.length; i++) {
      if (state.laps[i] < state.laps[i - 1]) {
        errors.push('laps array must be sorted in ascending order by timestamp');
      }
    }
  }

  // Consistency rule: if running, startTime must be set
  if (state.isRunning === true && state.startTime === null) {
    errors.push('If isRunning=true, startTime must not be null');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates a new TimerState object with validation
 * 
 * Useful for ensuring a state object has the correct shape.
 * Can be called with partial state or no arguments for a default state.
 * 
 * @param {Object} [initialState] - Optional partial state object to merge with defaults
 * @returns {Object} A validated TimerState object
 * @throws {Error} If the resulting state is invalid
 */
function createTimerState(initialState = {}) {
  const state = {
    startTime: initialState.startTime !== undefined ? initialState.startTime : DEFAULT_STATE.startTime,
    isRunning: initialState.isRunning !== undefined ? initialState.isRunning : DEFAULT_STATE.isRunning,
    laps: Array.isArray(initialState.laps) ? [...initialState.laps] : [...DEFAULT_STATE.laps]
  };

  const validation = validateTimerState(state);
  if (!validation.isValid) {
    throw new Error(`Invalid TimerState: ${validation.errors.join('; ')}`);
  }

  return state;
}

/**
 * Creates a default/reset TimerState
 * 
 * This is the initial state when the stopwatch is not running and no laps are recorded.
 * 
 * @returns {Object} Default TimerState: { startTime: null, isRunning: false, laps: [] }
 */
function createDefaultState() {
  return createTimerState({});
}

/**
 * Checks if a TimerState is in the "reset" (initial) state
 * 
 * @param {Object} state - The state to check
 * @returns {boolean} true if state matches reset state exactly
 */
function isResetState(state) {
  return !!(
    state &&
    state.startTime === null &&
    state.isRunning === false &&
    Array.isArray(state.laps) &&
    state.laps.length === 0
  );
}

/**
 * Checks if a TimerState indicates the timer is running
 * 
 * @param {Object} state - The state to check
 * @returns {boolean} true if isRunning is true and startTime is set
 */
function isRunningState(state) {
  return !!(state && state.isRunning === true && state.startTime !== null);
}

/**
 * Checks if a TimerState has recorded laps
 * 
 * @param {Object} state - The state to check
 * @returns {boolean} true if laps array is not empty
 */
function hasLaps(state) {
  return !!(state && Array.isArray(state.laps) && state.laps.length > 0);
}

/**
 * Gets the number of laps recorded in a state
 * 
 * @param {Object} state - The state to check
 * @returns {number} The number of laps, or 0 if no state or no laps
 */
function getLapCount(state) {
  return (state && Array.isArray(state.laps)) ? state.laps.length : 0;
}

/**
 * Clones a TimerState (deep copy)
 * 
 * Useful when you need to mutate a state without affecting the original.
 * 
 * @param {Object} state - The state to clone
 * @returns {Object} A new TimerState object with the same values
 */
function cloneTimerState(state) {
  return createTimerState({
    startTime: state.startTime,
    isRunning: state.isRunning,
    laps: state.laps ? [...state.laps] : []
  });
}

/**
 * Format milliseconds to HH:MM:SS format
 * 
 * Converts milliseconds to human-readable time format.
 * Handles times >24 hours with no upper cap on hours.
 * 
 * Test cases:
 * - formatTime(0) → "00:00:00"
 * - formatTime(60000) → "00:01:00"
 * - formatTime(3661000) → "01:01:01"
 * 
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string "HH:MM:SS"
 */
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Derives lap records from a TimerState
 * 
 * Transforms the raw laps array into display-ready records with computed
 * absolute elapsed times, lap durations, and formatted time strings.
 * 
 * Each lap record contains:
 * - lapNumber: 1-indexed ordinal position
 * - recordedAtTimestamp: Unix timestamp when lap was recorded
 * - absoluteElapsedTime: Total ms from session start to this lap
 * - lapDuration: Time delta from previous lap (null for first lap)
 * - absoluteElapsedTimeDisplay: Formatted HH:MM:SS for absolute time
 * - lapDurationDisplay: Formatted HH:MM:SS for lap duration
 * 
 * @param {Object} timerState - The timer state object with startTime and laps
 * @returns {Array} Array of lap record objects (empty if no laps)
 * @throws {Error} If timerState is invalid
 */
function deriveLapRecords(timerState) {
  // Validate input
  if (!timerState || typeof timerState !== 'object') {
    throw new Error('deriveLapRecords requires a valid timerState object');
  }

  // Return empty array if no laps
  if (!Array.isArray(timerState.laps) || timerState.laps.length === 0) {
    return [];
  }

  // Validate startTime exists for time calculations
  if (timerState.startTime === null || typeof timerState.startTime !== 'number') {
    throw new Error('deriveLapRecords requires timerState.startTime to be a valid timestamp');
  }

  // Transform each lap timestamp into a lap record
  return timerState.laps.map((lapTimestamp, index) => {
    const lapNumber = index + 1;
    const absoluteElapsedTime = lapTimestamp - timerState.startTime;
    
    // For first lap, duration equals absolute time; for subsequent laps, duration is delta from previous
    const lapDuration = index === 0 
      ? null  // First lap duration is null per spec
      : lapTimestamp - timerState.laps[index - 1];

    // Format times for display
    const absoluteElapsedTimeDisplay = formatTime(absoluteElapsedTime);
    const lapDurationDisplay = index === 0 
      ? formatTime(absoluteElapsedTime)  // First lap: show absolute as duration
      : formatTime(lapDuration);

    return {
      lapNumber,
      recordedAtTimestamp: lapTimestamp,
      absoluteElapsedTime,
      lapDuration,
      absoluteElapsedTimeDisplay,
      lapDurationDisplay
    };
  });
}

// Export module API
export {
  DEFAULT_STATE,
  validateTimerState,
  createTimerState,
  createDefaultState,
  isResetState,
  isRunningState,
  hasLaps,
  getLapCount,
  cloneTimerState,
  formatTime,
  deriveLapRecords
};
