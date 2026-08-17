import { describe, expect, it } from "vitest";
import en from "./dictionaries/en.json";
import fa from "./dictionaries/fa.json";
import { PROJECT_IDS } from "@/data/projects";

type Tree = Record<string, unknown>;

/** Collect every leaf path of a nested object, e.g. "profile.cta.github". */
function leafPaths(node: unknown, prefix = ""): string[] {
  if (Array.isArray(node)) {
    // Arrays are content lists — compare presence, not per-item keys.
    return [prefix + "[]"];
  }
  if (node !== null && typeof node === "object") {
    return Object.entries(node as Tree).flatMap(([key, value]) =>
      leafPaths(value, prefix ? `${prefix}.${key}` : key)
    );
  }
  return [prefix];
}

describe("i18n dictionaries", () => {
  it("fa has exactly the same key structure as en", () => {
    expect(leafPaths(fa).sort()).toEqual(leafPaths(en).sort());
  });

  it("covers every project id in both languages", () => {
    for (const id of PROJECT_IDS) {
      expect(en.projects.items[id]).toBeDefined();
      expect(fa.projects.items[id]).toBeDefined();
    }
  });

  it("has no empty strings in en", () => {
    const emptiness = JSON.stringify(en).includes('""');
    expect(emptiness).toBe(false);
  });

  it("keeps the 4-person team claim consistent", () => {
    expect(en.profile.summary).toContain("4-person");
    expect(fa.profile.summary).toContain("۴ نفره");
  });
});
