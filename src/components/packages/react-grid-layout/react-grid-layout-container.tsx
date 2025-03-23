import React, { FC, ReactElement } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

interface ItemI {
  key: string;
  component: ReactElement;
  width: number;
  height: number;
  x?: number;
  y?: number;
}
const ReactGridLayoutContainer: FC<{ items: ItemI[] }> = ({ items }) => {
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
