/**
 * Project registry for the dock. Textual content lives in the i18n
 * dictionaries under `projects.items[id]` — this file holds everything
 * language-independent: identity, visuals, stack and metadata.
 */
export const PROJECT_IDS = [
  "hiweb-ai",
  "selfit-coach",
  "selfit-app",
  "selfit-landing",
  "selfit-b2b",
  "selfit-provider",
  "seltrip",
  "parsonline-ai",
  "esim",
  "rose-menu",
  "almas-dental",
  "farda-insurance",
  "prodoc",
] as const;

export type ProjectId = (typeof PROJECT_IDS)[number];

/**
 * A captured screen of the live product. Intrinsic size is stored so the
 * gallery reserves the right box and never shifts layout while loading.
 *
 * Shots are not listed here: `scripts/index-shots.mjs` indexes whatever sits
 * in `public/images/shots/<project id>/` into `shots.generated.ts`, so a file
 * dropped in by hand shows up without editing this file.
 */
export interface ProjectShot {
  src: string;
  width: number;
  height: number;
}

export interface Project {
  id: ProjectId;
  /** Which dictionary role label applies: `projects.roles[role]` */
  role: "senior" | "engineer";
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
    role: "senior",
    period: "2023 — 2026",
    gradient: ["#00CCFF", "#8866FF"],
    stack: ["Next.js", "TypeScript", "SSE Streaming", "OpenAI", "Tailwind"],
    link: "http://chatbot.hiweb.ir",
  },
  {
    id: "selfit-coach",
    role: "senior",
    period: "2024 — 2026",
    gradient: ["#FF7A59", "#FF3D81"],
    stack: ["Web Components", "TypeScript", "LLM Workflows", "Vite"],
    link: "https://selfitapp.com",
  },
  {
    id: "selfit-app",
    role: "senior",
    period: "2022 — Present",
    gradient: ["#34D399", "#0EA5E9"],
    stack: ["Next.js", "PWA", "React Query", "Sentry", "RUM"],
    link: "https://app.selfit.ir",
  },
  {
    id: "selfit-landing",
    role: "senior",
    period: "2023 — 2026",
    gradient: ["#22C55E", "#15803D"],
    stack: ["Next.js", "SSG", "i18n", "Technical SEO", "Tailwind"],
    link: "https://selfit.ir",
  },
  {
    id: "selfit-b2b",
    role: "senior",
    period: "2022 — Present",
    gradient: ["#6366F1", "#A855F7"],
    stack: ["React", "TypeScript", "ECharts", "Virtualization", "RBAC"],
    link: "https://b2b.selfit.ir",
  },
  {
    id: "selfit-provider",
    role: "senior",
    period: "2023 — Present",
    gradient: ["#10B981", "#14B8A6"],
    stack: ["React", "TypeScript", "OTP Auth", "React Query", "Vite"],
    link: "https://provider.selfit.ir",
  },
  {
    id: "seltrip",
    role: "senior",
    period: "2023 — 2024",
    gradient: ["#F59E0B", "#EF4444"],
    stack: ["Next.js App Router", "RSC", "ISR", "Edge Caching"],
    link: "https://seltrip.agtan.ir",
  },
  {
    id: "parsonline-ai",
    role: "senior",
    period: "2025 — 2026",
    gradient: ["#38BDF8", "#2563EB"],
    stack: ["Next.js", "SSE Streaming", "RAG", "TypeScript", "Tailwind"],
    link: "https://chatbot.parsonline.com",
  },
  {
    id: "esim",
    role: "senior",
    period: "2024",
    gradient: ["#22D3EE", "#3B82F6"],
    stack: ["Next.js", "TypeScript", "Design System", "Payments"],
  },
  {
    id: "rose-menu",
    role: "senior",
    period: "2025",
    gradient: ["#F59E0B", "#B45309"],
    stack: ["Next.js", "Framer Motion", "Admin Panel", "Tailwind"],
    link: "https://rose-menu-beta.vercel.app",
  },
  {
    id: "almas-dental",
    role: "senior",
    period: "2025",
    gradient: ["#2563EB", "#0EA5E9"],
    stack: ["Next.js", "SSG", "Technical SEO", "Tailwind"],
    link: "https://almasdentalclinic.ir",
  },
  {
    id: "farda-insurance",
    role: "engineer",
    period: "2021 — 2022",
    gradient: ["#10B981", "#047857"],
    stack: ["React", "TypeScript", "Multi-step Forms", "Payments"],
    link: "https://www.fardains.ir",
  },
  {
    id: "prodoc",
    role: "senior",
    period: "2024",
    gradient: ["#94A3B8", "#475569"],
    stack: ["Next.js", "SSG", "SEO", "Motion"],
  },
] as const;

export const getProject = (id: ProjectId): Project =>
  projects.find((p) => p.id === id)!;
