import React, { FC } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import type { GridItem } from "@/types/grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

const ReactGridLayoutContainer: FC<{ items: GridItem[] }> = ({ items }) => {
  return (
    <ResponsiveGridLayout
      breakpoints={{ lg: 1068, xs: 0 }}
      cols={{ lg: 4, xs: 2 }}
      className={"select-none cursor-grab"}
      style={{ direction: "ltr" }}
      isBounded
      useCSSTransforms
    >
      {items.map((item) => (
        <div
          key={item.key}
          data-grid={{
            i: item.key,
            h: item.height,
            w: item.width,
            x: item.x ?? 0,
            y: item.y ?? 0,
          }}
        >
          {item.component}
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default ReactGridLayoutContainer;
