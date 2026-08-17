import { format as formatGregorian } from "date-fns";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import type { Locale } from "@/i18n/config";

/** "Saturday, August 17" or its Jalali equivalent in Persian. */
export function formatDate(time: Date, lang: Locale): string {
  return lang === "fa"
    ? formatJalali(time, "EEEE، d MMMM", { locale: faIR })
    : formatGregorian(time, "EEEE, MMMM d");
}

/** 24-hour wall-clock time, e.g. "14:05". */
export function formatTime(time: Date): string {
  return formatGregorian(time, "HH:mm");
}

/** Seconds, rendered separately so the layout doesn't jump. */
export function formatSeconds(time: Date): string {
  return formatGregorian(time, "ss");
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Convert latin digits to Persian digits when rendering in fa. */
export function localizeDigits(value: string, lang: Locale): string {
  if (lang !== "fa") return value;
  return value.replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}
