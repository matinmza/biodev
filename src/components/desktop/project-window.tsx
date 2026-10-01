"use client";

import { ArrowUpRight } from "lucide-react";
import Modal from "@/components/shared/modal";
import { getProject, type ProjectId } from "@/data/projects";
import { shotsByProject } from "@/data/shots.generated";
import { useI18n } from "@/i18n/i18n-provider";
import { localizeDigits } from "@/lib/datetime";
import AppIcon from "./app-icon";
import ShotGallery from "./shot-gallery";

interface ProjectWindowProps {
  projectId: ProjectId | null;
  onClose: () => void;
}

/** A macOS-style window presenting one project's full story. */
export default function ProjectWindow({ projectId, onClose }: ProjectWindowProps) {
  const { dict, lang } = useI18n();

  const project = projectId ? getProject(projectId) : null;
  const text = projectId ? dict.projects.items[projectId] : null;
  // Indexed from public/images/shots at build time, so adding a file is enough.
  const shots = projectId ? (shotsByProject[projectId] ?? []) : [];

  return (
    <Modal isOpen={projectId !== null} onClose={onClose}>
      {project && text && (
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl dark:border-white/10 dark:bg-zinc-900/95">
          {/* Window chrome */}
          <div
            dir="ltr"
            className="flex items-center gap-2 border-b border-black/5 px-4 py-3 dark:border-white/5"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={dict.a11y.close}
              className="h-3 w-3 rounded-full bg-[#FF5F57] transition-transform hover:scale-110"
            />
            <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" aria-hidden />
            <span className="h-3 w-3 rounded-full bg-[#28C840]" aria-hidden />
            <span className="mx-auto pe-14 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {project.id}.app
            </span>
          </div>

          {/* Window body */}
          <div
            dir={lang === "fa" ? "rtl" : "ltr"}
            className="scrollbar-ios max-h-[70vh] space-y-5 overflow-y-auto p-6 md:p-8"
          >
            <div className="flex items-center gap-4">
              <AppIcon id={project.id} className="h-16 w-16 shrink-0" />
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {text.name}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {text.tagline}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-black/5 px-3 py-1 font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {dict.projects.meta.role}: {dict.projects.roles[project.role]}
              </span>
              <span className="rounded-full bg-black/5 px-3 py-1 font-medium tabular-nums text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {dict.projects.meta.period}: {localizeDigits(project.period, lang)}
              </span>
            </div>

            <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              {text.description}
            </p>

            {shots.length > 0 && (
              <div>
                <h3 className="widget-title mb-2.5">{dict.projects.meta.screens}</h3>
                <ShotGallery shots={shots} title={text.name} />
              </div>
            )}

            <div>
              <h3 className="widget-title mb-2">{dict.projects.meta.highlights}</h3>
              <ul className="space-y-2">
                {text.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <ArrowUpRight
                      size={15}
                      className="mt-1 shrink-0 text-accent-violet rtl:-scale-x-100"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="widget-title mb-2">{dict.projects.meta.stack}</h3>
              <div dir="ltr" className="flex flex-wrap gap-1.5 rtl:justify-end">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-black/10 px-2.5 py-0.5 font-mono text-[11px] text-zinc-600 dark:border-white/15 dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
              >
                {dict.projects.meta.visit}
                <ArrowUpRight size={15} className="rtl:-scale-x-100" />
              </a>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
