import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  COLS,
  LAYOUTS,
  MARGIN,
  ROW_HEIGHT,
  columnSwitches,
} from "./grid-geometry";

/**
 * The desktop is described twice: once as react-grid-layout config, and once
 * as the CSS that paints it before hydration. Nothing in the type system ties
 * them together, and when they disagree the page jumps the moment the
 * JavaScript lands — so the agreement is asserted here instead.
 */
const css = readFileSync(
  join(__dirname, "..", "..", "app", "globals.css"),
  "utf8"
);

/** The `.static-grid` tiers, as `{ minWidth, cols }`, narrowest first. */
function cssTiers() {
  const section = css.slice(css.indexOf(".static-grid {"));
  const tiers: { minWidth: number; cols: number }[] = [];

  const base = section.match(/\.static-grid \{[^}]*grid-template-columns: repeat\((\d+)/);
  if (base) tiers.push({ minWidth: 0, cols: Number(base[1]) });

  const media =
    /@media \(min-width: (\d+)px\) \{\s*\.static-grid \{\s*grid-template-columns: repeat\((\d+)/g;
  for (const hit of section.matchAll(media)) {
    tiers.push({ minWidth: Number(hit[1]), cols: Number(hit[2]) });
  }
  return tiers.sort((a, b) => a.minWidth - b.minWidth);
}

describe("static grid", () => {
  it("switches columns at the same widths react-grid-layout does", () => {
    expect(cssTiers()).toEqual(columnSwitches());
  });

  it("paints every widget in every tier it can be shown in", () => {
    // `placement()` reads xxs/sm/lg, which only covers xs and md because they
    // repeat sm and lg. If that ever stops being true, this fails.
    expect(LAYOUTS.xs).toBe(LAYOUTS.sm);
    expect(LAYOUTS.md).toBe(LAYOUTS.lg);

    for (const tier of ["xxs", "sm", "lg"] as const) {
      const layout = LAYOUTS[tier] ?? [];
      expect(layout.length).toBeGreaterThan(0);
      for (const item of layout) {
        expect(item.x + item.w).toBeLessThanOrEqual(COLS[tier]);
      }
    }
  });

  it("keeps the row geometry the CSS reproduces", () => {
    // grid-auto-rows + gap in globals.css, as plain numbers.
    expect(css).toContain(`grid-auto-rows: ${ROW_HEIGHT}px`);
    expect(css).toContain(`gap: ${MARGIN}px`);
    expect(css).toContain(`padding: ${MARGIN}px`);
  });
});
