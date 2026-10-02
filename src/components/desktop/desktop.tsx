"use client";

import { useI18n } from "@/i18n/i18n-provider";
import { WindowProvider } from "./window-context";
import MenuBar from "./menu-bar";
import Dock from "./dock";
import DesktopGrid, { type GridEntry } from "./desktop-grid";
import { LAYOUTS } from "./grid-geometry";
import ProfileWidget from "./widgets/profile-widget";
import ClockWidget from "./widgets/clock-widget";
import PhotoWidget from "./widgets/photo-widget";
import StatsWidget from "./widgets/stats-widget";
import TerminalWidget from "./widgets/terminal-widget";
import ExperienceWidget from "./widgets/experience-widget";
import StackWidget from "./widgets/stack-widget";
import ResumeWidget from "./widgets/resume-widget";

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
