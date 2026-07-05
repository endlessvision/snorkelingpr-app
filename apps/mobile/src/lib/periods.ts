/**
 * Week/month period keys for the economy (Phase 1). Pure and testable — all
 * accept an optional `now` so callers can simulate rollovers.
 *
 * - Week key: "YYYY-wNN" (ISO week; week ends Sunday 23:59).
 * - Month key: "YYYY-M".
 */

/** ISO 8601 week number for a date (weeks start Monday; week 1 has the first Thursday). */
function isoWeek(date: Date): { year: number; week: number } {
  // Copy so we don't mutate the caller's date, and work in UTC to avoid DST drift.
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Thursday of the current ISO week decides the year.
  const day = d.getUTCDay() || 7; // Sunday (0) → 7
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const year = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year, week };
}

/** e.g. "2026-w27". */
export function currentWeekKey(now: Date = new Date()): string {
  const { year, week } = isoWeek(now);
  return `${year}-w${String(week).padStart(2, "0")}`;
}

/** e.g. "2026-7" (1-based month). */
export function currentMonthKey(now: Date = new Date()): string {
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}
