import { describe, expect, it } from "vitest";
import { swapWidgets } from "./drag-hint";
import { LAYOUTS } from "./grid-geometry";

describe("swapWidgets", () => {
  it("trades two widgets' positions in every breakpoint and leaves the rest", () => {
    const swapped = swapWidgets(LAYOUTS, "clock", "photos");

    for (const [breakpoint, layout] of Object.entries(LAYOUTS)) {
      const at = (id: string) => layout!.find((item) => item.i === id)!;
      const now = (id: string) =>
        swapped[breakpoint]!.find((item) => item.i === id)!;

      expect(now("clock")).toMatchObject({ x: at("photos").x, y: at("photos").y });
      expect(now("photos")).toMatchObject({ x: at("clock").x, y: at("clock").y });
      expect(now("clock").h).toBe(at("clock").h);
      expect(now("profile")).toEqual(at("profile"));
    }
  });
});
