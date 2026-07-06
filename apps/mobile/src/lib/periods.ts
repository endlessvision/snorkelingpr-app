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

/** Local calendar day, "YYYY-MM-DD" (used for the daily streak). */
export function dateKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** True if `prev` (a dateKey) is exactly the calendar day before `now`. */
export function isYesterday(prev: string, now: Date = new Date()): boolean {
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  return prev === dateKey(y);
}

/** The raffle draw: last day of the current month at 20:00 local (Phase 8). */
export function raffleDrawDate(now: Date = new Date()): Date {
  // Day 0 of next month = last day of this month.
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 20, 0, 0, 0);
}

/** The weekly leaderboard reset: upcoming Sunday 23:59 local (Phase 9). */
export function weekResetDate(now: Date = new Date()): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0);
  const day = d.getDay(); // 0 = Sunday
  const daysUntilSunday = (7 - day) % 7;
  d.setDate(d.getDate() + daysUntilSunday);
  return d;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthName(now: Date = new Date()): string {
  return MONTH_NAMES[now.getMonth()];
}
