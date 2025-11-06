export function createClock(tz = 'Africa/Kampala', nowFn = () => Date.now()) {
  function nowMs() {
    return nowFn();
  }
  return { nowMs };
}
