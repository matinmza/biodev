import { describe, expect, it } from "vitest";
import { runCommand } from "./terminal";
import { PROJECT_IDS } from "@/data/projects";
import { profile } from "@/data/profile";

describe("terminal command engine", () => {
  it("returns help text for `help`", () => {
    const result = runCommand("help");
    expect(result.type).toBe("output");
    if (result.type === "output") {
      expect(result.lines[0]).toMatch(/available commands/i);
    }
  });

  it("is case-insensitive and whitespace-tolerant", () => {
    const result = runCommand("  HELP  ");
    expect(result.type).toBe("output");
  });

  it("returns empty output for blank input", () => {
    const result = runCommand("   ");
    expect(result).toEqual({ type: "output", lines: [] });
  });

  it("introduces Matin as a senior frontend engineer on `whoami`", () => {
    const result = runCommand("whoami");
    if (result.type !== "output") throw new Error("expected output");
    const text = result.lines.join(" ");
    expect(text).toContain("Matin Zarifamin");
    expect(text).toContain("Senior Frontend Engineer");
    expect(text).toContain("4-person");
  });

  it("lists every project id in `projects`", () => {
    const result = runCommand("projects");
    if (result.type !== "output") throw new Error("expected output");
    const text = result.lines.join("\n");
    for (const id of PROJECT_IDS) {
      expect(text).toContain(id);
    }
  });

  it("opens a project window for `open <id>`", () => {
    const result = runCommand("open seltrip");
    expect(result).toMatchObject({ type: "open-project", id: "seltrip" });
  });

  it("rejects unknown project ids on `open`", () => {
    const result = runCommand("open doesnotexist");
    if (result.type !== "output") throw new Error("expected output");
    expect(result.lines[0]).toContain("no such project");
  });

  it("opens the GitHub profile via `github`", () => {
    const result = runCommand("github");
    expect(result).toMatchObject({
      type: "open-url",
      url: profile.social.github,
    });
  });

  it("clears the screen on `clear`", () => {
    expect(runCommand("clear")).toEqual({ type: "clear" });
    expect(runCommand("cls")).toEqual({ type: "clear" });
  });

  it("includes contact details on `contact`", () => {
    const result = runCommand("contact");
    if (result.type !== "output") throw new Error("expected output");
    expect(result.lines.join("\n")).toContain(profile.email);
  });

  it("denies sudo", () => {
    const result = runCommand("sudo rm -rf /");
    if (result.type !== "output") throw new Error("expected output");
    expect(result.lines[0]).toContain("not in the sudoers file");
  });

  it("echoes arguments", () => {
    const result = runCommand("echo hello world");
    expect(result).toEqual({ type: "output", lines: ["hello world"] });
  });

  it("reports unknown commands", () => {
    const result = runCommand("frobnicate");
    if (result.type !== "output") throw new Error("expected output");
    expect(result.lines[0]).toContain("command not found: frobnicate");
  });
});
