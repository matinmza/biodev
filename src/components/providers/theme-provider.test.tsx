import { beforeEach, describe, expect, it } from "vitest";
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

  it("resolves to light by default (matchMedia stub is light)", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
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
