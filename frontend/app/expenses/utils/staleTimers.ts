export type StaleTimerHandle = ReturnType<typeof setTimeout> | null;

const FIVE_MINUTES = 5 * 60 * 1000;

export function createStaleTimer(
  callback: () => void,
  staleThresholdMs = FIVE_MINUTES,
): StaleTimerHandle {
  return setTimeout(callback, staleThresholdMs);
}

export function resetStaleTimer(
  handle: StaleTimerHandle,
  callback: () => void,
  staleThresholdMs = FIVE_MINUTES,
): StaleTimerHandle {
  if (handle) clearTimeout(handle);
  return createStaleTimer(callback, staleThresholdMs);
}

export function isStale(lastUpdatedAt: string, staleThresholdMs = FIVE_MINUTES) {
  const updatedAt = new Date(lastUpdatedAt).getTime();
  return Date.now() - updatedAt >= staleThresholdMs;
}
