import { describe, expect, it } from "vitest";
import {
  SITE_URL,
  languageAlternates,
  ogLocale,
  personJsonLd,
  serializeJsonLd,
} from "./seo";
import en from "@/i18n/dictionaries/en.json";
import fa from "@/i18n/dictionaries/fa.json";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

describe("seo helpers", () => {
  it("exposes an absolute site url with no trailing slash", () => {
    expect(SITE_URL).toMatch(/^https?:\/\//);
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("maps locales to OpenGraph locale tags", () => {
    expect(ogLocale("fa")).toBe("fa_IR");
    expect(ogLocale("en")).toBe("en_US");
  });

  it("emits hreflang alternates including x-default", () => {
    const alternates = languageAlternates();
    expect(alternates["x-default"]).toBe(`${SITE_URL}/en`);
    expect(alternates.en).toBe(`${SITE_URL}/en`);
    expect(alternates["fa-IR"]).toBe(`${SITE_URL}/fa`);
  });

  it("describes the person with links search engines can verify", () => {
    const graph = personJsonLd(en, "en");
    const person = graph["@graph"][0] as Record<string, unknown>;
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe(en.profile.name);
    expect(person.jobTitle).toBe(en.profile.role);
    expect(person.sameAs).toContain(profile.social.github);
    expect(person.sameAs).toContain(profile.social.linkedin);
  });

  it("includes a WebSite node and one CreativeWork per project", () => {
    const graph = personJsonLd(fa, "fa");
    const types = graph["@graph"].map(
      (node) => (node as { "@type": string })["@type"]
    );
    expect(types).toContain("WebSite");
    expect(types.filter((t) => t === "CreativeWork")).toHaveLength(
      projects.length
    );
  });

  it("escapes `<` so JSON-LD can never close its script tag", () => {
    const serialized = serializeJsonLd({ evil: "</script><script>alert(1)" });
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c");
  });
});
