import { describe, expect, it } from "vitest";
import { i18n, isLocale, matchLocale } from "./config";

describe("locale config", () => {
  it("recognizes supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fa")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });

  it("matches Persian speakers to fa", () => {
    expect(matchLocale("fa-IR,fa;q=0.9,en;q=0.8")).toBe("fa");
  });

  it("falls back to the default locale otherwise", () => {
    expect(matchLocale("en-US,en;q=0.9")).toBe(i18n.defaultLocale);
    expect(matchLocale(null)).toBe(i18n.defaultLocale);
  });
});
