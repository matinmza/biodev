import { describe, expect, it } from "vitest";
import { PROJECT_IDS, getProject, projects } from "./projects";

describe("project registry", () => {
  it("registers every declared project id exactly once", () => {
    const ids = projects.map((p) => p.id);
    expect(ids).toEqual([...PROJECT_IDS]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every project a valid two-stop hex gradient", () => {
    for (const project of projects) {
      expect(project.gradient).toHaveLength(2);
      for (const stop of project.gradient) {
        expect(stop).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it("gives every project a non-empty stack and period", () => {
    for (const project of projects) {
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.period).not.toBe("");
    }
  });

  it("looks projects up by id", () => {
    expect(getProject("seltrip").id).toBe("seltrip");
  });
});
