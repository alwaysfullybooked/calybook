import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { addDays, addMinutes, set } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateToFormatInTimezone(date: Date, timezone: string, output: string) {
  return formatInTimeZone(date, timezone, output);
}

export function toDateInTimezone(date: Date, timezone: string) {
  return toZonedTime(date, timezone);
}

export function toDateFromFormat(string: string, timezone: string) {
  return toZonedTime(string, timezone);
}

export function addMinutesToDate(date: Date, minutes: number) {
  return addMinutes(date, minutes);
}

export function addDaysToDate(date: Date, days: number) {
  return addDays(date, days);
}

export function setStartOfDay(date: Date) {
  return set(date, { hours: 0, minutes: 0, seconds: 0 });
}

export function nowInTimezone(timezone: string) {
  const utc = new Date();
  return toZonedTime(utc, timezone);
}
