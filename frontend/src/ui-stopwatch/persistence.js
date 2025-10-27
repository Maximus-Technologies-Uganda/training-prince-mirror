/**
 * Persistence Module for Stopwatch
 * Handles localStorage read/write operations with error handling
 */

const STORAGE_KEY = 'stopwatchState';

/**
 * Persist timer state to localStorage
 * @param {Object} state - Timer state object to persist
 * @returns {Object} {success: boolean, error?: string}
 */
export function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { success: true };
  } catch (error) {
    if (error.name === 'SecurityError') {
      console.warn('localStorage not available (private browsing mode)');
      return { success: false, error: 'SecurityError: Private browsing mode detected' };
    }
    console.error('Error persisting state:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Restore timer state from localStorage
 * @returns {Object} Restored state or default state with resumed flag
 */
export function restoreState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {
        startTime: null,
        isRunning: false,
        laps: [],
        resumed: false,
      };
    }

    const restored = JSON.parse(stored);
    const resumed = restored.isRunning === true;

    if (resumed) {
      console.log('Session resumed: Timer state recovered from checkpoint');
      showSessionMessage('Session-only mode: Timer resumed from checkpoint');
    }

    return { ...restored, resumed };
  } catch (error) {
    console.error('Error restoring state:', error);
    console.warn('Session-only mode: localStorage unavailable or corrupted');
    showSessionMessage('Session-only mode: localStorage unavailable');
    return {
      startTime: null,
      isRunning: false,
      laps: [],
      resumed: false,
    };
  }
}

/**
 * Clear persisted state from localStorage
 * @returns {Object} {success: boolean}
 */
export function clearPersistedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error clearing persisted state:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Display session status message to user
 * @param {string} message - Status message to display
 */
function showSessionMessage(message) {
  const statusEl = document.getElementById('session-status');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 5000);
  }
}
