import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./theme-provider";

function Probe() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme("dark")}>go dark</button>
      <button onClick={() => setTheme("light")}>go light</button>
    </div>
  );
}

describe("<ThemeProvider />", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** Freezes the local clock at `hour` on a fixed day. */
  const atHour = (hour: number) => {
    vi.useFakeTimers();
    const at = new Date(2026, 0, 15, hour, 30);
    vi.setSystemTime(at);
  };

  it("opens light during the day", () => {
    atHour(13);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
  });

  it("opens dark at night", () => {
    atHour(22);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
  });

  it("opens dark before dawn", () => {
    atHour(5);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
  });

  it("applies the dark class and persists the choice", async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    await userEvent.click(screen.getByRole("button", { name: "go dark" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("matinos-theme")).toBe("dark");

    await userEvent.click(screen.getByRole("button", { name: "go light" }));
    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement).toHaveClass("light");
  });

  it("reads a stored theme on startup", () => {
    localStorage.setItem("matinos-theme", "dark");
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
  });
});
