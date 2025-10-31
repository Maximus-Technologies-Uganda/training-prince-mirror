/**
 * API Contracts: Stopwatch UI Module
 * 
 * This file defines the function signatures and expected input/output schemas
 * for the Stopwatch UI module. These contracts serve as:
 * 1. Documentation for the module's public interface
 * 2. Basis for contract tests (before implementation)
 * 3. Reference for integration with other modules
 * 
 * Phase: 1 (Design & Contracts)
 * Branch: 014-thursday-stopwatch-ui
 */

// ============================================================================
// CONTRACTS
// ============================================================================

/**
 * Contract: startTimer()
 * 
 * Initiates the stopwatch timer from a reset or stopped state.
 * 
 * @function startTimer
 * @returns {Object} Result object with the following shape:
 *   {
 *     success: boolean,       // true if timer started, false if error
 *     newState: TimerState,   // Updated timer state after start
 *     error?: string          // Error message if success=false
 *   }
 * 
 * TimerState shape:
 *   {
 *     startTime: number (Unix timestamp in ms),
 *     isRunning: boolean,
 *     laps: Array<number> (Unix timestamps in ms)
 *   }
 * 
 * Side Effects:
 *   - Sets startTime to current Date.now()
 *   - Sets isRunning = true
 *   - Persists state to localStorage (if available)
 *   - Triggers UI update (display starts counting)
 * 
 * Constraints:
 *   - Can only start from reset state or after previous timer stopped
 *   - Cannot start if timer already running (should return error or no-op)
 * 
 * Test Requirements:
 *   - Verifies startTime is set to recent timestamp (within 100ms)
 *   - Verifies isRunning becomes true
 *   - Verifies state is persisted to localStorage
 *   - Verifies second call while running returns error
 * 
 * Example:
 *   const result = startTimer();
 *   if (result.success) {
 *     console.log('Timer started at', result.newState.startTime);
 *   }
 */

/**
 * Contract: stopTimer()
 * 
 * Pauses the stopwatch timer at the current elapsed time.
 * 
 * @function stopTimer
 * @returns {Object} Result object:
 *   {
 *     success: boolean,
 *     newState: TimerState,
 *     error?: string
 *   }
 * 
 * Side Effects:
 *   - Sets isRunning = false
 *   - Does NOT clear startTime (timer value preserved)
 *   - Persists state to localStorage
 *   - UI stops updating timer display
 * 
 * Constraints:
 *   - Only works if timer is currently running (isRunning=true)
 *   - Calling stop on already-stopped timer returns error or no-op
 * 
 * Test Requirements:
 *   - Verifies isRunning becomes false
 *   - Verifies startTime is unchanged
 *   - Verifies state is persisted
 *   - Verifies stopping twice in a row returns error
 * 
 * Example:
 *   const result = stopTimer();
 *   if (result.success) {
 *     console.log('Timer stopped at elapsed time');
 *   }
 */

/**
 * Contract: resetTimer()
 * 
 * Clears the stopwatch, returning it to initial state (00:00:00).
 * 
 * @function resetTimer
 * @returns {Object} Result object:
 *   {
 *     success: boolean,
 *     newState: TimerState,
 *     error?: string
 *   }
 * 
 * newState after reset:
 *   {
 *     startTime: null,
 *     isRunning: false,
 *     laps: []
 *   }
 * 
 * Side Effects:
 *   - Sets startTime = null
 *   - Sets isRunning = false
 *   - Clears laps array
 *   - Clears localStorage (removes 'stopwatchState' key)
 *   - UI display returns to "00:00:00"
 *   - Lap list is emptied
 * 
 * Test Requirements:
 *   - Verifies all fields reset to initial state
 *   - Verifies localStorage is cleared
 *   - Verifies laps array is empty array (not null)
 * 
 * Example:
 *   const result = resetTimer();
 *   console.log(result.newState);  // {startTime: null, isRunning: false, laps: []}
 */

/**
 * Contract: recordLap()
 * 
 * Records a lap (split time) at the current elapsed time.
 * 
 * @function recordLap
 * @returns {Object} Result object:
 *   {
 *     success: boolean,
 *     newLap?: LapRecord,  // Only if success=true
 *     newState?: TimerState,
 *     error?: string       // Error message if failed
 *   }
 * 
 * LapRecord shape:
 *   {
 *     lapNumber: number,    // 1-indexed position in laps list
 *     absoluteElapsedTime: number,  // ms from session start
 *     lapDuration: number | null,   // ms from previous lap (null for first)
 *     recordedAtTimestamp: number   // Unix timestamp when recorded
 *   }
 * 
 * Side Effects:
 *   - Appends current timestamp to laps array (only if isRunning=true)
 *   - Persists updated state to localStorage
 *   - Triggers lap list UI update
 *   - Timer continues running (NOT stopped by lap recording)
 * 
 * Constraints:
 *   - Only records if isRunning = true
 *   - Implements 100ms debounce: calls within 100ms of previous lap are ignored
 *   - Returns error if attempting to lap while timer stopped
 * 
 * Test Requirements:
 *   - Verifies lap timestamp is appended to laps array
 *   - Verifies lapNumber = length of laps array (1-indexed)
 *   - Verifies 100ms debounce: second call within 100ms returns error
 *   - Verifies error returned when timer not running
 *   - Verifies state persisted to localStorage
 *   - Verifies timer continues after lap recorded
 * 
 * Example:
 *   const result = recordLap();
 *   if (result.success) {
 *     console.log(`Lap ${result.newLap.lapNumber} recorded at ${result.newLap.absoluteElapsedTime}ms`);
 *   }
 */

/**
 * Contract: exportToCSV()
 * 
 * Generates and downloads a CSV file of all recorded laps.
 * 
 * @function exportToCSV
 * @returns {Object} Result object:
 *   {
 *     success: boolean,
 *     filename?: string,    // e.g., "stopwatch_export_1729792950000.csv"
 *     error?: string
 *   }
 * 
 * CSV Format:
 *   - Header: "Lap Number,Absolute Elapsed Time,Lap Duration"
 *   - Rows: one per lap with format: "1,00:01:30,00:01:30"
 *   - Time format: HH:MM:SS (e.g., "00:01:30", "01:05:42")
 *   - First lap duration = absolute elapsed time (same as lap 1 absolute time)
 *   - Subsequent laps show delta from previous lap
 * 
 * Side Effects:
 *   - Creates Blob with CSV content
 *   - Triggers browser download (via URL.createObjectURL + anchor)
 *   - File is named stopwatch_export_{unix_timestamp}.csv
 *   - MIME type: text/csv
 * 
 * Constraints:
 *   - Can be called anytime (no requirement to be stopped)
 *   - Empty laps (no laps recorded) results in CSV with header only
 * 
 * Test Requirements:
 *   - Verifies download is triggered
 *   - Verifies filename matches pattern stopwatch_export_*.csv
 *   - Verifies CSV content has correct headers
 *   - Verifies each lap row has 3 columns
 *   - Verifies time format is HH:MM:SS
 *   - Verifies CSV opens in Excel/spreadsheet apps
 * 
 * Example:
 *   const result = exportToCSV();
 *   if (result.success) {
 *     console.log('Downloaded:', result.filename);
 *   }
 */

/**
 * Contract: restoreState()
 * 
 * Restores timer state from localStorage on page load.
 * Called automatically during UI initialization.
 * 
 * @function restoreState
 * @returns {Object} Result object:
 *   {
 *     success: boolean,
 *     state?: TimerState,           // Restored state or default
 *     resumed?: boolean,            // true if was running before unload
 *     error?: string
 *   }
 * 
 * Behavior:
 *   - Reads 'stopwatchState' from localStorage
 *   - Parses JSON to TimerState object
 *   - If localStorage unavailable or empty, returns default state:
 *     {startTime: null, isRunning: false, laps: []}
 *   - If previously running (isRunning=true), automatically resumes:
 *     - Recalculates elapsed time as Date.now() - startTime
 *     - Updates UI to show correct time
 *     - Restarts animation loop to update display
 *   - If was stopped, restores that state without resuming
 * 
 * Side Effects:
 *   - Populates UI display with restored timer value
 *   - Populates lap list with restored laps
 *   - Starts animation frame loop if resumed=true
 *   - Shows "Session-only mode" message if localStorage unavailable
 * 
 * Constraints:
 *   - Gracefully handles corrupted JSON in localStorage (defaults to reset state)
 *   - Handles case where localStorage throws SecurityError (private browsing)
 * 
 * Test Requirements:
 *   - Verifies localStorage is read
 *   - Verifies state is correctly deserialized from JSON
 *   - Verifies elapsed time is correctly calculated if running
 *   - Verifies error handling when localStorage unavailable
 *   - Verifies default state returned if no saved state exists
 *   - Verifies resumed=true only if isRunning was true
 * 
 * Example:
 *   const result = restoreState();
 *   if (result.resumed) {
 *     console.log('Resuming timer from', result.state.startTime);
 *   }
 */

// ============================================================================
// SHARED TYPE DEFINITIONS
// ============================================================================

/**
 * @typedef {Object} TimerState
 * @property {number|null} startTime - Unix timestamp (ms) when session began, or null if reset
 * @property {boolean} isRunning - true if timer is actively running
 * @property {Array<number>} laps - Array of lap timestamps (Unix ms), sorted ascending
 */

/**
 * @typedef {Object} LapRecord
 * @property {number} lapNumber - 1-indexed position (1, 2, 3, ...)
 * @property {number} absoluteElapsedTime - ms from session start to this lap
 * @property {number|null} lapDuration - ms from previous lap (null for first lap)
 * @property {number} recordedAtTimestamp - Unix ms when lap was recorded
 * @property {string} absoluteElapsedTimeDisplay - Formatted as HH:MM:SS
 * @property {string} lapDurationDisplay - Formatted as HH:MM:SS
 */

/**
 * @typedef {Object} FunctionResult
 * @property {boolean} success - Indicates success or failure
 * @property {TimerState} [newState] - Updated state (if applicable)
 * @property {LapRecord} [newLap] - New lap record (recordLap only)
 * @property {string} [filename] - Download filename (exportToCSV only)
 * @property {string} [error] - Error message if success=false
 */

// ============================================================================
// EXPORT (for test generation and documentation)
// ============================================================================

export const STOPWATCH_UI_CONTRACTS = {
  startTimer: {
    name: 'startTimer',
    description: 'Starts the timer',
    params: [],
    returns: { type: 'Object', shape: 'FunctionResult' },
  },
  stopTimer: {
    name: 'stopTimer',
    description: 'Stops the timer',
    params: [],
    returns: { type: 'Object', shape: 'FunctionResult' },
  },
  resetTimer: {
    name: 'resetTimer',
    description: 'Resets the timer to initial state',
    params: [],
    returns: { type: 'Object', shape: 'FunctionResult' },
  },
  recordLap: {
    name: 'recordLap',
    description: 'Records a lap at current elapsed time',
    params: [],
    returns: { type: 'Object', shape: 'FunctionResult' },
    debounce: 100, // ms threshold
  },
  exportToCSV: {
    name: 'exportToCSV',
    description: 'Exports laps to CSV file',
    params: [],
    returns: { type: 'Object', shape: 'FunctionResult' },
  },
  restoreState: {
    name: 'restoreState',
    description: 'Restores timer state from localStorage on page load',
    params: [],
    returns: { type: 'Object', shape: 'FunctionResult' },
  },
};
