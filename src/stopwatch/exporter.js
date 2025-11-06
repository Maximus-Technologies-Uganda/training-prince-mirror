import { formatTime } from './core.js';

export function exportLapsAsTable(laps) {
  const header = 'Lap\tTime';
  if (!laps || laps.length === 0) return `${header}`;
  const rows = laps.map((lap, i) => `${i + 1}\t${formatTime(lap.time)}`);
  return [header, ...rows].join('\n');
}
