import { describe, expect, it } from "vitest";
import type { ProjectShot } from "@/data/projects";
import { rows } from "./shot-gallery";

const shot = (width: number, height: number): ProjectShot => ({
  src: `/images/shots/x/${width}x${height}-${Math.random()}.png`,
  width,
  height,
});

const DESKTOP = () => shot(1440, 900); // 1.60
const PHONE = () => shot(860, 1864); // 0.46, clamped to 0.50
const RIBBON = () => shot(1440, 7456); // 0.19, clamped to 0.50

/** Total width a row's tiles take up, as a fraction of the container. */
const width = (row: { tiles: { ratio: number }[]; ratio: number }) =>
  row.tiles.reduce((sum, tile) => sum + tile.ratio, 0) / row.ratio;

describe("rows", () => {
  it("fills a full row exactly, leaving no gap", () => {
    const [first] = rows([DESKTOP(), DESKTOP(), DESKTOP(), DESKTOP()]);
    expect(first.tiles).toHaveLength(2);
    expect(width(first)).toBeCloseTo(1);
  });

  it("breaks into as many rows as the ratios need", () => {
    expect(rows(Array.from({ length: 4 }, DESKTOP))).toHaveLength(2);
    expect(rows(Array.from({ length: 6 }, DESKTOP))).toHaveLength(3);
  });

  it("does not stretch a short last row to the full width", () => {
    const laid = rows([DESKTOP(), DESKTOP(), DESKTOP()]);
    expect(laid).toHaveLength(2);
    expect(laid[1].tiles).toHaveLength(1);
    // 1.6 of a 2.4-wide row: same height as a full row, ends early.
    expect(width(laid[1])).toBeCloseTo(1.6 / 2.4);
  });

  it("keeps a lone shot at a sane size instead of blowing it up", () => {
    const [only] = rows([PHONE()]);
    expect(width(only)).toBeLessThan(0.25);
  });

  it("clamps an extreme full-page capture so it cannot flatten its row", () => {
    const [row] = rows([RIBBON(), DESKTOP(), DESKTOP()]);
    const ribbon = row.tiles[0];
    expect(ribbon.ratio).toBe(0.5);
    expect(width(row)).toBeCloseTo(1);
  });

  it("puts a phone set on one line", () => {
    const laid = rows(Array.from({ length: 5 }, PHONE));
    expect(laid).toHaveLength(1);
    expect(laid[0].tiles).toHaveLength(5);
    expect(width(laid[0])).toBeCloseTo(1);
  });

  it("carries the original index so the lightbox opens the right frame", () => {
    const laid = rows(Array.from({ length: 5 }, DESKTOP));
    expect(laid.flatMap((row) => row.tiles.map((tile) => tile.index))).toEqual([
      0, 1, 2, 3, 4,
    ]);
  });

  it("returns nothing for no shots", () => {
    expect(rows([])).toEqual([]);
  });
});
