/**
 * The numbers react-grid-layout is configured with, and the page padding
 * around it.
 *
 * They live in their own module so `desktop-grid.test.ts` can check them
 * against the CSS tiers in `globals.css` without importing the grid component,
 * which pulls in react-grid-layout and its stylesheet. The pre-hydration grid
 * is pure CSS, so nothing but a test keeps the two descriptions of the same
 * layout honest.
 */
import type { ResponsiveLayouts } from "react-grid-layout/legacy";

export const BREAKPOINTS = { lg: 1024, md: 800, sm: 640, xs: 480, xxs: 0 };
export const COLS = { lg: 4, md: 4, sm: 2, xs: 2, xxs: 1 };
export const ROW_HEIGHT = 118;
export const MARGIN = 16;

/** `mx-auto max-w-6xl px-4` around the grid, so 16px on each side. */
export const PAGE_PADDING = 32;

/**
 * The viewport widths at which the number of columns changes.
 *
 * react-grid-layout measures the container, not the viewport, and compares
 * with a strict `>` (`getBreakpointFromWidth`), so a breakpoint declared at
 * 480 takes effect at a viewport of 513.
 */
export function columnSwitches() {
  const ascending = Object.entries(BREAKPOINTS).sort((a, b) => a[1] - b[1]) as [
    keyof typeof COLS,
    number,
  ][];

  const switches: { minWidth: number; cols: number }[] = [];
  for (const [name, width] of ascending) {
    const cols = COLS[name];
    if (switches.length === 0) {
      switches.push({ minWidth: 0, cols });
      continue;
    }
    if (cols === switches[switches.length - 1].cols) continue;
    switches.push({ minWidth: width + PAGE_PADDING + 1, cols });
  }
  return switches;
}

/** Grid positions per breakpoint. Keys must match the entries below. */
export const LAYOUT_LG = [
  { i: "profile", x: 0, y: 0, w: 2, h: 3 },
  { i: "clock", x: 2, y: 0, w: 1, h: 2 },
  { i: "photos", x: 3, y: 0, w: 1, h: 2 },
  { i: "stats", x: 2, y: 2, w: 2, h: 1 },
  { i: "resume", x: 0, y: 3, w: 2, h: 2 },
  { i: "experience", x: 2, y: 3, w: 2, h: 5 },
  { i: "terminal", x: 0, y: 5, w: 2, h: 3 },
  { i: "stack", x: 0, y: 8, w: 4, h: 1 },
];

export const LAYOUT_SM = [
  { i: "profile", x: 0, y: 0, w: 2, h: 3 },
  { i: "clock", x: 0, y: 3, w: 1, h: 2 },
  { i: "photos", x: 1, y: 3, w: 1, h: 2 },
  { i: "stats", x: 0, y: 5, w: 2, h: 1 },
  { i: "resume", x: 0, y: 6, w: 2, h: 2 },
  { i: "terminal", x: 0, y: 8, w: 2, h: 3 },
  { i: "experience", x: 0, y: 11, w: 2, h: 4 },
  { i: "stack", x: 0, y: 15, w: 2, h: 1 },
];

export const LAYOUT_XXS = [
  { i: "profile", x: 0, y: 0, w: 1, h: 4 },
  { i: "clock", x: 0, y: 4, w: 1, h: 2 },
  { i: "photos", x: 0, y: 6, w: 1, h: 3 },
  { i: "stats", x: 0, y: 9, w: 1, h: 2 },
  { i: "resume", x: 0, y: 11, w: 1, h: 2 },
  { i: "terminal", x: 0, y: 13, w: 1, h: 3 },
  { i: "experience", x: 0, y: 16, w: 1, h: 4 },
  { i: "stack", x: 0, y: 20, w: 1, h: 1 },
];

export const LAYOUTS: ResponsiveLayouts = {
  lg: LAYOUT_LG,
  md: LAYOUT_LG,
  sm: LAYOUT_SM,
  xs: LAYOUT_SM,
  xxs: LAYOUT_XXS,
};
