"use client";

// v2 moved the width-measuring HOC and the legacy prop shapes behind this
// entry point; the root export is the new hook-based API.
import {
  Responsive,
  WidthProvider,
  type ResponsiveLayouts,
} from "react-grid-layout/legacy";
import { useMounted } from "@/hooks/use-mounted";
import { BREAKPOINTS, COLS, MARGIN, ROW_HEIGHT } from "./grid-geometry";
import "react-grid-layout/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface GridEntry {
  key: string;
  node: React.ReactNode;
}

interface DesktopGridProps {
  layouts: ResponsiveLayouts;
  entries: GridEntry[];
}

/**
 * The same positions, as CSS Grid placement.
 *
 * react-grid-layout measures its container before it can place anything, so it
 * renders nothing on the server — which used to leave the whole desktop blank
 * until hydration finished, and a blank first second is exactly what Speed
 * Index measures. CSS Grid can express the same layout with no JavaScript at
 * all: `grid-auto-rows: 118px` with a 16px gap reproduces react-grid-layout's
 * `y * (rowHeight + margin)` arithmetic exactly, and the 16px padding stands in
 * for the margin it leaves around the outside. The tiers in `.static-grid`
 * (globals.css) read these variables, so the server-rendered grid and the
 * hydrated one are pixel-identical and the swap costs no layout shift.
 *
 * Only three tiers are needed because `md` repeats `lg` and `xs` repeats `sm`
 * in `desktop.tsx` — give either its own layout and a tier has to be added
 * here, which `desktop-grid.test.ts` will say out loud.
 */
function placement(layouts: ResponsiveLayouts, key: string) {
  const tiers = [layouts.xxs, layouts.sm, layouts.lg];
  const style: Record<string, string> = {};

  tiers.forEach((tier, index) => {
    const item = tier?.find((entry) => entry.i === key);
    if (!item) return;
    style[`--b${index}-x`] = String(item.x + 1);
    style[`--b${index}-y`] = String(item.y + 1);
    style[`--b${index}-w`] = String(item.w);
    style[`--b${index}-h`] = String(item.h);
  });

  return style as React.CSSProperties;
}

/**
 * The desktop surface: a responsive, draggable bento grid.
 * Dragging is handle-only (`.drag-handle`) so widget content stays
 * interactive and the page scrolls normally on touch.
 */
export default function DesktopGrid({ layouts, entries }: DesktopGridProps) {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="static-grid">
        {entries.map((entry) => (
          <div
            key={entry.key}
            className="select-none"
            style={placement(layouts, entry.key)}
          >
            {entry.node}
          </div>
        ))}
      </div>
    );
  }

  return (
    <ResponsiveGridLayout
      layouts={layouts}
      breakpoints={BREAKPOINTS}
      cols={COLS}
      rowHeight={ROW_HEIGHT}
      margin={[MARGIN, MARGIN]}
      isResizable={false}
      isDraggable
      draggableHandle=".drag-handle"
      useCSSTransforms
    >
      {entries.map((entry) => (
        <div key={entry.key} className="select-none">
          {entry.node}
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
