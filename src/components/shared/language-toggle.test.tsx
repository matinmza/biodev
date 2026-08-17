import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import LanguageToggle from "./language-toggle";
import en from "@/i18n/dictionaries/en.json";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push }),
}));

describe("<LanguageToggle />", () => {
  beforeEach(() => push.mockClear());

  it("shows both languages so the choice is visible", () => {
    renderWithProviders(<LanguageToggle />);
    expect(
      screen.getByRole("button", { name: en.menu.english })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: en.menu.persian })
    ).toBeInTheDocument();
  });

  it("marks the active language as pressed", () => {
    renderWithProviders(<LanguageToggle />);
    expect(screen.getByRole("button", { name: en.menu.english })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: en.menu.persian })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("navigates to the other locale when clicked", async () => {
    renderWithProviders(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: en.menu.persian }));
    expect(push).toHaveBeenCalledWith("/fa");
  });

  it("does not navigate when the active language is clicked", async () => {
    renderWithProviders(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: en.menu.english }));
    expect(push).not.toHaveBeenCalled();
  });
});
