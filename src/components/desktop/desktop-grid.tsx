"use client";

import { Responsive, WidthProvider, type Layouts } from "react-grid-layout";
import { useMounted } from "@/hooks/use-mounted";
import "react-grid-layout/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface GridEntry {
  key: string;
  node: React.ReactNode;
}

interface DesktopGridProps {
  layouts: Layouts;
  entries: GridEntry[];
}

/**
 * The desktop surface: a responsive, draggable bento grid.
 * Dragging is handle-only (`.drag-handle`) so widget content stays
 * interactive and the page scrolls normally on touch.
 */
export default function DesktopGrid({ layouts, entries }: DesktopGridProps) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="min-h-screen w-full" />;
  }

  return (
    <ResponsiveGridLayout
      layouts={layouts}
      breakpoints={{ lg: 1024, md: 800, sm: 640, xs: 480, xxs: 0 }}
      cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 1 }}
      rowHeight={118}
      margin={[16, 16]}
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
