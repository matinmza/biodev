import { describe, expect, it } from "vitest";
import { RESUME_UPDATED, resume } from "./resume";
import { profile } from "./profile";
import { SITE_URL } from "@/lib/seo";

describe("résumé", () => {
  it("targets senior IC roles, never a team-lead title", () => {
    expect(resume.title).toBe("Senior Frontend Engineer");
    const text = JSON.stringify(resume);
    expect(text).not.toMatch(/team lead|tech lead|engineering manager/i);
  });

  // The whole point of the rewrite: ownership and mentoring, not "I ran a team".
  it("claims architecture ownership and mentoring, not people-leadership", () => {
    const current = resume.experience[0];
    const points = current.points.join(" ");
    expect(points).toMatch(/own frontend architecture/i);
    expect(points).toMatch(/mentor/i);
    expect(current.points.filter((p) => /\blead(s|ing)\b/i.test(p))).toHaveLength(0);
  });

  it("carries the portfolio URL and every contact channel", () => {
    expect(resume.site).toBe(SITE_URL);
    expect(resume.email).toBe(profile.email);
    expect(resume.phone).toBe(profile.phone);
    expect(resume.github).toBe(profile.social.github);
    expect(resume.linkedin).toBe(profile.social.linkedin);
  });

  it("states the AI-assisted workflow recruiters now ask about", () => {
    const text = JSON.stringify(resume);
    expect(text).toContain("Claude Code");
    expect(resume.skills.map((group) => group.label)).toContain(
      "AI-assisted engineering"
    );
  });

  it("is current: 6+ years and an open-ended role", () => {
    expect(resume.summary).toContain("6+ years");
    expect(resume.experience[0].period).toMatch(/Present$/);
    expect(RESUME_UPDATED).toMatch(/\b20\d{2}$/);
  });

  it("has no empty bullet anywhere", () => {
    for (const role of resume.experience) {
      expect(role.points.length).toBeGreaterThan(0);
      for (const point of role.points) expect(point.trim()).not.toBe("");
    }
  });
});
