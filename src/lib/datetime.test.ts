import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatSeconds,
  formatTime,
  localizeDigits,
} from "./datetime";

const sample = new Date(2026, 7, 17, 14, 5, 9); // Aug 17 2026, 14:05:09

describe("datetime helpers", () => {
  it("formats 24-hour wall-clock time", () => {
    expect(formatTime(sample)).toBe("14:05");
  });

  it("formats seconds with a leading zero", () => {
    expect(formatSeconds(sample)).toBe("09");
  });

  it("formats an English Gregorian date", () => {
    expect(formatDate(sample, "en")).toBe("Monday, August 17");
  });

  it("formats a Persian Jalali date with Persian month names", () => {
    const formatted = formatDate(sample, "fa");
    // 2026-08-17 falls in Mordad 1405.
    expect(formatted).toContain("مرداد");
  });

  it("converts latin digits to Persian digits only for fa", () => {
    expect(localizeDigits("14:05", "fa")).toBe("۱۴:۰۵");
    expect(localizeDigits("14:05", "en")).toBe("14:05");
  });
});
