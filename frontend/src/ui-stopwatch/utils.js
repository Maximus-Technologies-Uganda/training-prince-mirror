/**
 * Utility Functions: Stopwatch UI
 * 
 * This module contains helper functions for the Stopwatch UI.
 * 
 * Phase: 3.3 (Models & Utilities)
 * Task: T010 - Implement formatTime(milliseconds) utility
 */

/**
 * Format milliseconds to HH:MM:SS format
 * 
 * Converts milliseconds to human-readable time format.
 * Handles times >24 hours with no upper cap on hours.
 * 
 * Test cases:
 * - formatTime(0) → "00:00:00"
 * - formatTime(1000) → "00:00:01"
 * - formatTime(60000) → "00:01:00"
 * - formatTime(3661000) → "01:01:01"
 * - formatTime(360000000) → "100:00:00"
 * - formatTime(450930000) → "125:45:30"
 * 
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string "HH:MM:SS"
 */
export function formatTime(milliseconds) {
  // Handle edge case: non-numeric or negative values
  if (typeof milliseconds !== 'number' || milliseconds < 0) {
    return '00:00:00';
  }

  // Convert milliseconds to total seconds
  const totalSeconds = Math.floor(milliseconds / 1000);
  
  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format with zero-padding to 2 digits
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
