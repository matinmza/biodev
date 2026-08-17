import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import StatsWidget from "./widgets/stats-widget";
import ExperienceWidget from "./widgets/experience-widget";
import ProfileWidget from "./widgets/profile-widget";
import Dock from "./dock";
import en from "@/i18n/dictionaries/en.json";
import fa from "@/i18n/dictionaries/fa.json";
import { profile } from "@/data/profile";

describe("desktop widgets", () => {
  it("renders the profile hero with name, role and social links", () => {
    renderWithProviders(<ProfileWidget />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      en.profile.name
    );
    expect(screen.getByText(en.profile.role)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: new RegExp(en.profile.cta.github) })
    ).toHaveAttribute("href", profile.social.github);
  });

  it("renders the profile hero in Persian", () => {
    renderWithProviders(<ProfileWidget />, { lang: "fa" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      fa.profile.name
    );
  });

  it("shows all four impact stats", () => {
    renderWithProviders(<StatsWidget />);
    for (const stat of Object.values(en.stats.items)) {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    }
  });

  it("lists both roles and the education line in experience", () => {
    renderWithProviders(<ExperienceWidget />);
    for (const job of en.experience.items) {
      expect(screen.getByText(job.company)).toBeInTheDocument();
      expect(screen.getByText(job.role)).toBeInTheDocument();
    }
    expect(
      screen.getByText(new RegExp(en.experience.education.school))
    ).toBeInTheDocument();
  });

  it("opens a project window when a dock app is clicked", async () => {
    renderWithProviders(<Dock />);
    await userEvent.click(
      screen.getByRole("button", { name: en.projects.items["hiweb-ai"].name })
    );
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent(en.projects.items["hiweb-ai"].tagline);
  });
});
