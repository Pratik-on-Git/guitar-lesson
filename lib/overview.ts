import { NAV, STUDY_PAGES } from "./nav";
import type { PracticeSession } from "./store";
import { practiceFocusLabel } from "./music/practice-labels";

/** Progress keys and denominators come from the same map as the sidebar. */
export function studySummary(studied: readonly string[]) {
  const saved = new Set(studied);
  const groups = NAV.slice(1).map((group) => {
    const pages = STUDY_PAGES.filter((page) => page.group === group.title);
    const done = pages.filter((page) => saved.has(page.href)).length;
    return { ...group, pages, done, total: pages.length, next: pages.find((page) => !saved.has(page.href)) };
  });
  return {
    groups,
    done: STUDY_PAGES.filter((page) => saved.has(page.href)).length,
    total: STUDY_PAGES.length,
    remaining: STUDY_PAGES.filter((page) => !saved.has(page.href)),
    complete: groups.filter((group) => group.done === group.total).length,
    started: groups.filter((group) => group.done > 0 && group.done < group.total).length,
    untouched: groups.filter((group) => group.done === 0).length,
  };
}

// Match the practice studio's calendar, including sessions near midnight.
const dayFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" });
export const practiceDateKey = (date: Date) => dayFormatter.format(date);
export const calendarLabel = (key: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(`${key}T12:00:00Z`));

export function practiceSummary(sessions: readonly PracticeSession[], days: number, now: Date) {
  const today = practiceDateKey(now);
  const end = new Date(`${today}T12:00:00Z`);
  const dates = Array.from({ length: days }, (_, index) => {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - days + index + 1);
    return date.toISOString().slice(0, 10);
  });
  const selected = sessions.filter((session) => {
    const date = new Date(session.date);
    if (!Number.isFinite(date.getTime()) || date > now || !Number.isFinite(session.minutes) || session.minutes <= 0) return false;
    const key = practiceDateKey(date);
    return key >= dates[0] && key <= today;
  });
  const activity = dates.map((date) => {
    const entries = selected.filter((session) => practiceDateKey(new Date(session.date)) === date);
    return { date, minutes: entries.reduce((sum, session) => sum + session.minutes, 0), sessions: entries.length };
  });
  const minutes = selected.reduce((sum, session) => sum + session.minutes, 0);
  const byFocus = new Map<string, number>();
  selected.forEach((session) => {
    const focus = practiceFocusLabel(session.focus);
    byFocus.set(focus, (byFocus.get(focus) ?? 0) + session.minutes);
  });
  const ranked = [...byFocus].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const focus = ranked.slice(0, 3).map(([name, value]) => ({ name, minutes: value }));
  if (ranked.length > 3) focus.push({ name: "Other focuses", minutes: ranked.slice(3).reduce((sum, [, value]) => sum + value, 0) });
  return { minutes, count: selected.length, activeDays: activity.filter((day) => day.sessions > 0).length, activity, focus };
}
