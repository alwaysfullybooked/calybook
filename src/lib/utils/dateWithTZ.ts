import { toZonedTime, format as formatDateFns } from "date-fns-tz";
import { isSameDay as isSameDayFns, compareAsc } from "date-fns";

/**
 * Parse a date string or Date object in a specific timezone.
 */
export function parseDateInTimeZone(date: string | number | Date, tz: string): Date {
  if (typeof date === "number" || date instanceof Date) {
    return toZonedTime(date, tz);
  }
  return toZonedTime(date, tz);
}

/**
 * Format a date in a specific timezone.
 */
export function formatDateInTimeZone(date: string | number | Date, tz: string, formatStr: string): string {
  const zonedDate = parseDateInTimeZone(date, tz);
  return formatDateFns(zonedDate, formatStr, { timeZone: tz });
}

/**
 * Check if two dates are the same day in a specific timezone.
 */
export function isSameDayInTimeZone(date1: string | number | Date, date2: string | number | Date, tz: string): boolean {
  const d1 = parseDateInTimeZone(date1, tz);
  const d2 = parseDateInTimeZone(date2, tz);
  return isSameDayFns(d1, d2);
}

/**
 * Compare two dates in a specific timezone.
 */
export function compareDatesInTimeZone(date1: string | number | Date, date2: string | number | Date, tz: string): number {
  const d1 = parseDateInTimeZone(date1, tz);
  const d2 = parseDateInTimeZone(date2, tz);
  return compareAsc(d1, d2);
}

/**
 * Get the current time in a specific timezone.
 */
export function getCurrentTimeInTimeZone(tz: string): Date {
  return toZonedTime(new Date(), tz);
}

/**
 * Convert a date from one timezone to another.
 */
export function convertTimeZone(date: string | number | Date, fromTz: string, toTz: string): Date {
  const utcDate = new Date(date);
  return toZonedTime(utcDate, toTz);
}
