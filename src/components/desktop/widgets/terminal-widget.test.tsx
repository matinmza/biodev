import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import TerminalWidget from "./terminal-widget";
import { profile } from "@/data/profile";
import en from "@/i18n/dictionaries/en.json";

async function typeCommand(command: string) {
  const input = screen.getByRole("textbox", {
    name: en.terminal.widgetTitle,
  });
  await userEvent.type(input, `${command}{Enter}`);
  return input;
}

describe("<TerminalWidget />", () => {
  it("shows the banner and localized hint", () => {
    renderWithProviders(<TerminalWidget />);
    expect(screen.getByText(/MatinOS Terminal/)).toBeInTheDocument();
    expect(screen.getByText(`# ${en.terminal.hint}`)).toBeInTheDocument();
  });

  it("runs `help` and prints the command list", async () => {
    renderWithProviders(<TerminalWidget />);
    await typeCommand("help");
    expect(screen.getByText(/Available commands:/)).toBeInTheDocument();
  });

  it("opens a project window from `open seltrip`", async () => {
    renderWithProviders(<TerminalWidget />);
    await typeCommand("open seltrip");
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent(en.projects.items.seltrip.name);
  });

  it("opens GitHub in a new tab from `github`", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    renderWithProviders(<TerminalWidget />);
    await typeCommand("github");
    expect(open).toHaveBeenCalledWith(
      profile.social.github,
      "_blank",
      "noopener,noreferrer"
    );
    open.mockRestore();
  });

  it("clears the scrollback on `clear`", async () => {
    renderWithProviders(<TerminalWidget />);
    await typeCommand("clear");
    expect(screen.queryByText(/MatinOS Terminal/)).not.toBeInTheDocument();
  });

  it("recalls the previous command with ArrowUp", async () => {
    renderWithProviders(<TerminalWidget />);
    const input = await typeCommand("whoami");
    await userEvent.type(input, "{ArrowUp}");
    expect(input).toHaveValue("whoami");
  });

  it("goes full screen on a phone and keeps the scrollback", async () => {
    const matchMedia = vi
      .spyOn(window, "matchMedia")
      .mockReturnValue({ matches: true } as MediaQueryList);
    renderWithProviders(<TerminalWidget />);
    await typeCommand("whoami");

    await userEvent.click(
      screen.getByRole("textbox", { name: en.terminal.widgetTitle })
    );
    const dialog = screen.getByRole("dialog", {
      name: en.terminal.widgetTitle,
    });
    expect(dialog).toHaveTextContent("whoami");
    expect(
      screen.getByRole("textbox", { name: en.terminal.widgetTitle })
    ).toHaveFocus();

    await userEvent.click(screen.getByRole("button", { name: en.a11y.close }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    matchMedia.mockRestore();
  });
});
