/**
 * Project registry for the dock. Textual content lives in the i18n
 * dictionaries under `projects.items[id]` — this file holds everything
 * language-independent: identity, visuals, stack and metadata.
 */
export const PROJECT_IDS = [
  "hiweb-ai",
  "selfit-coach",
  "selfit-app",
  "selfit-b2b",
  "seltrip",
  "esim",
  "farda-insurance",
  "prodoc",
] as const;

export type ProjectId = (typeof PROJECT_IDS)[number];

export interface Project {
  id: ProjectId;
  /** Which dictionary role label applies: `projects.roles[role]` */
  role: "lead" | "engineer";
  /** Display period, latin digits — localized rendering handles digits. */
  period: string;
  /** App-icon gradient, top → bottom. */
  gradient: [string, string];
  stack: string[];
  link?: string;
}

export const projects: readonly Project[] = [
  {
    id: "hiweb-ai",
    role: "lead",
    period: "2023 — 2025",
    gradient: ["#00CCFF", "#8866FF"],
    stack: ["Next.js", "TypeScript", "SSE Streaming", "OpenAI", "Tailwind"],
  },
  {
    id: "selfit-coach",
    role: "lead",
    period: "2024 — 2025",
    gradient: ["#FF7A59", "#FF3D81"],
    stack: ["Web Components", "TypeScript", "LLM Workflows", "Vite"],
  },
  {
    id: "selfit-app",
    role: "lead",
    period: "2022 — Present",
    gradient: ["#34D399", "#0EA5E9"],
    stack: ["Next.js", "PWA", "React Query", "Sentry", "RUM"],
  },
  {
    id: "selfit-b2b",
    role: "lead",
    period: "2022 — Present",
    gradient: ["#6366F1", "#A855F7"],
    stack: ["React", "TypeScript", "ECharts", "Virtualization", "RBAC"],
  },
  {
    id: "seltrip",
    role: "lead",
    period: "2023 — 2024",
    gradient: ["#F59E0B", "#EF4444"],
    stack: ["Next.js App Router", "RSC", "ISR", "Edge Caching"],
  },
  {
    id: "esim",
    role: "lead",
    period: "2024",
    gradient: ["#22D3EE", "#3B82F6"],
    stack: ["Next.js", "TypeScript", "Design System", "Payments"],
  },
  {
    id: "farda-insurance",
    role: "engineer",
    period: "2021 — 2022",
    gradient: ["#10B981", "#047857"],
    stack: ["React", "TypeScript", "Multi-step Forms", "Payments"],
  },
  {
    id: "prodoc",
    role: "lead",
    period: "2024",
    gradient: ["#94A3B8", "#475569"],
    stack: ["Next.js", "SSG", "SEO", "Motion"],
  },
] as const;

export const getProject = (id: ProjectId): Project =>
  projects.find((p) => p.id === id)!;
