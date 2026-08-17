"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { projects, type ProjectId } from "@/data/projects";
import { useI18n } from "@/i18n/i18n-provider";
import { useWindows } from "./window-context";
import AppIcon from "./app-icon";

const BASE_SIZE = 48;
const MAX_SIZE = 76;
const REACH = 140;

interface DockIconProps {
  id: ProjectId;
  name: string;
  mouseX: MotionValue<number>;
  onOpen: (id: ProjectId) => void;
  isActive: boolean;
}

function DockIcon({ id, name, mouseX, onOpen, isActive }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (x: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return REACH;
    return x - bounds.x - bounds.width / 2;
  });

  const sizeTarget = useTransform(
    distance,
    [-REACH, 0, REACH],
    [BASE_SIZE, MAX_SIZE, BASE_SIZE]
  );
  const size = useSpring(sizeTarget, { mass: 0.1, stiffness: 220, damping: 16 });

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ width: size, height: size }}
      onClick={() => onOpen(id)}
      aria-label={name}
      className="group relative flex shrink-0 items-end justify-center outline-offset-4"
    >
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-black/75 px-2 py-1 text-[11px] font-medium text-white opacity-0 backdrop-blur transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {name}
      </span>
      <AppIcon id={id} className="h-full w-full" />
      <span
        aria-hidden
        className={
          isActive
            ? "absolute -bottom-2 h-1 w-1 rounded-full bg-zinc-800 dark:bg-white"
            : "absolute -bottom-2 h-1 w-1 rounded-full bg-transparent"
        }
      />
    </motion.button>
  );
}

/** The projects dock — every shipped product is an app you can open. */
export default function Dock() {
  const { dict } = useI18n();
  const { openProject, activeProject } = useWindows();
  const mouseX = useMotionValue<number>(Infinity);

  return (
    <nav
      aria-label={dict.projects.dockLabel}
      className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex flex-col items-center gap-1.5 px-3"
    >
      {/* Without this label, visitors read the dock as decoration. */}
      <p className="pointer-events-auto max-w-full truncate rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white/95 backdrop-blur-md">
        <span className="font-semibold">{dict.projects.dockTitle}</span>
        <span className="mx-1.5 opacity-50">·</span>
        {dict.projects.dockHint}
      </p>

      <div
        dir="ltr"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass pointer-events-auto flex max-w-full items-end gap-2 overflow-x-auto rounded-3xl px-3 pb-2.5 pt-2 scrollbar-ios"
      >
        {projects.map((project) => (
          <DockIcon
            key={project.id}
            id={project.id}
            name={dict.projects.items[project.id].name}
            mouseX={mouseX}
            onOpen={openProject}
            isActive={activeProject === project.id}
          />
        ))}
      </div>
    </nav>
  );
}
