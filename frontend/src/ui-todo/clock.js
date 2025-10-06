export function createClock(tz = 'Africa/Kampala', nowFn = () => Date.now()) {
  function nowMs() {
    return nowFn();
  }
  function todayIso() {
    // Derive local date in the given tz by offsetting from UTC.
    // For Kampala (UTC+3) we use a fixed offset of +180 minutes.
    const ms = nowMs();
    const offsetMinutes = tz === 'Africa/Kampala' ? 180 : 0; // simplistic for tests
    const local = new Date(ms + offsetMinutes * 60 * 1000);
    const yyyy = String(local.getUTCFullYear());
    const mm = String(local.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(local.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return { nowMs, todayIso };
}
