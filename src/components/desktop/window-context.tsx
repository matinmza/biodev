"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ProjectId } from "@/data/projects";
import ProjectWindow from "./project-window";

interface WindowManager {
  activeProject: ProjectId | null;
  openProject: (id: ProjectId) => void;
  closeProject: () => void;
}

const WindowContext = createContext<WindowManager | null>(null);

/**
 * Desktop window manager: any widget (dock, terminal, …) can open a
 * project window through this context.
 */
export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [activeProject, setActiveProject] = useState<ProjectId | null>(null);

  const openProject = useCallback((id: ProjectId) => setActiveProject(id), []);
  const closeProject = useCallback(() => setActiveProject(null), []);

  const value = useMemo(
    () => ({ activeProject, openProject, closeProject }),
    [activeProject, openProject, closeProject]
  );

  return (
    <WindowContext.Provider value={value}>
      {children}
      <ProjectWindow projectId={activeProject} onClose={closeProject} />
    </WindowContext.Provider>
  );
}

export function useWindows(): WindowManager {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindows must be used within a WindowProvider");
  return ctx;
}
