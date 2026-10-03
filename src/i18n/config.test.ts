import { describe, expect, it } from "vitest";
import { isLocale, pickLocale } from "./config";

describe("locale config", () => {
  it("recognizes supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fa")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });

  it("opens in Persian on Tehran time or for Persian speakers", () => {
    expect(pickLocale(["en-US"], "Asia/Tehran")).toBe("fa");
    expect(pickLocale(["fa-IR", "en"], "Europe/Berlin")).toBe("fa");
  });

  it("falls back to English otherwise", () => {
    expect(pickLocale(["en-US", "de"], "Europe/Berlin")).toBe("en");
    expect(pickLocale([])).toBe("en");
  });

  it("survives being inlined as source, as the root page does", () => {
    const run = new Function(`return (${pickLocale.toString()})(["fa"])`);
    expect(run()).toBe("fa");
  });
});
