import { ReactElement } from "react";

export interface GridItem {
  key: string;
  component: ReactElement;
  width: number;
  height: number;
  x?: number;
  y?: number;
}
