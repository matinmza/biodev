"use client";

import type { ResponsiveLayouts } from "react-grid-layout/legacy";
import { useI18n } from "@/i18n/i18n-provider";
import { WindowProvider } from "./window-context";
import MenuBar from "./menu-bar";
import Dock from "./dock";
import DesktopGrid, { type GridEntry } from "./desktop-grid";
import ProfileWidget from "./widgets/profile-widget";
import ClockWidget from "./widgets/clock-widget";
import PhotoWidget from "./widgets/photo-widget";
import StatsWidget from "./widgets/stats-widget";
import TerminalWidget from "./widgets/terminal-widget";
import ExperienceWidget from "./widgets/experience-widget";
import StackWidget from "./widgets/stack-widget";
import ResumeWidget from "./widgets/resume-widget";

/** Grid positions per breakpoint. Keys must match the entries below. */
const LAYOUT_LG = [
  { i: "profile", x: 0, y: 0, w: 2, h: 3 },
  { i: "clock", x: 2, y: 0, w: 1, h: 2 },
  { i: "photos", x: 3, y: 0, w: 1, h: 2 },
  { i: "stats", x: 2, y: 2, w: 2, h: 1 },
  { i: "resume", x: 0, y: 3, w: 2, h: 2 },
  { i: "experience", x: 2, y: 3, w: 2, h: 5 },
  { i: "terminal", x: 0, y: 5, w: 2, h: 3 },
  { i: "stack", x: 0, y: 8, w: 4, h: 1 },
];

const LAYOUT_SM = [
  { i: "profile", x: 0, y: 0, w: 2, h: 3 },
  { i: "clock", x: 0, y: 3, w: 1, h: 2 },
  { i: "photos", x: 1, y: 3, w: 1, h: 2 },
  { i: "stats", x: 0, y: 5, w: 2, h: 1 },
  { i: "resume", x: 0, y: 6, w: 2, h: 2 },
  { i: "terminal", x: 0, y: 8, w: 2, h: 3 },
  { i: "experience", x: 0, y: 11, w: 2, h: 4 },
  { i: "stack", x: 0, y: 15, w: 2, h: 1 },
];

const LAYOUT_XXS = [
  { i: "profile", x: 0, y: 0, w: 1, h: 4 },
  { i: "clock", x: 0, y: 4, w: 1, h: 2 },
  { i: "photos", x: 0, y: 6, w: 1, h: 3 },
  { i: "stats", x: 0, y: 9, w: 1, h: 2 },
  { i: "resume", x: 0, y: 11, w: 1, h: 2 },
  { i: "terminal", x: 0, y: 13, w: 1, h: 3 },
  { i: "experience", x: 0, y: 16, w: 1, h: 4 },
  { i: "stack", x: 0, y: 20, w: 1, h: 1 },
];

const LAYOUTS: ResponsiveLayouts = {
  lg: LAYOUT_LG,
  md: LAYOUT_LG,
  sm: LAYOUT_SM,
  xs: LAYOUT_SM,
  xxs: LAYOUT_XXS,
};

const ENTRIES: GridEntry[] = [
  { key: "profile", node: <ProfileWidget /> },
  { key: "clock", node: <ClockWidget /> },
  { key: "photos", node: <PhotoWidget /> },
  { key: "stats", node: <StatsWidget /> },
  { key: "resume", node: <ResumeWidget /> },
  { key: "terminal", node: <TerminalWidget /> },
  { key: "experience", node: <ExperienceWidget /> },
  { key: "stack", node: <StackWidget /> },
];

/** The whole MatinOS desktop: menu bar, widget grid, dock, windows. */
export default function Desktop() {
  const { dict } = useI18n();

  return (
    <WindowProvider>
      <MenuBar />

      <div dir="ltr" className="mx-auto max-w-6xl px-4 pb-36 pt-14">
        <DesktopGrid layouts={LAYOUTS} entries={ENTRIES} />

        <footer className="mt-6 text-center text-xs font-medium text-white/85 [text-shadow:0_1px_3px_rgb(0_0_0/0.55)]">
          {dict.footer.madeWith}
        </footer>
      </div>

      <Dock />
    </WindowProvider>
  );
}
