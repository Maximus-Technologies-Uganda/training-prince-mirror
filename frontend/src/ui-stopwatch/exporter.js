/**
 * Exporter Module for Stopwatch
 * Handles CSV export of lap data
 */

/**
 * Format milliseconds to HH:MM:SS format
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Derive lap records from timer state
 * @param {Object} timerState - Current timer state
 * @returns {Array} Array of lap record objects
 */
export function deriveLapRecords(timerState) {
  if (!timerState.laps || timerState.laps.length === 0) {
    return [];
  }

  return timerState.laps.map((lapTime, index) => {
    const lapNumber = index + 1;
    const absoluteElapsedTime = lapTime - timerState.startTime;
    const lapDuration = index === 0
      ? absoluteElapsedTime
      : lapTime - timerState.laps[index - 1];

    return {
      lapNumber,
      absoluteElapsedTime,
      lapDuration,
      absoluteElapsedTimeFormatted: formatTime(absoluteElapsedTime),
      lapDurationFormatted: formatTime(lapDuration),
    };
  });
}

/**
 * Export current laps to CSV format
 * @param {Object} timerState - Current timer state
 * @returns {Object} {success: boolean, filename?: string, error?: string}
 */
export function exportToCSV(timerState) {
  try {
    const lapRecords = deriveLapRecords(timerState);

    // CSV headers
    const headers = ['Lap Number', 'Absolute Elapsed Time', 'Lap Duration'];
    const csvLines = [headers.join(',')];

    // CSV rows
    lapRecords.forEach((record) => {
      const row = [
        record.lapNumber,
        record.absoluteElapsedTimeFormatted,
        record.lapDurationFormatted,
      ];
      csvLines.push(row.join(','));
    });

    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Generate filename with timestamp
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `stopwatch_export_${timestamp}.csv`;

    // Trigger download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return { success: false, error: error.message };
  }
}
