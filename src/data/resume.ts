/**
 * The résumé, in English only.
 *
 * This is the single source for both the on-site preview (`/[lang]/resume`)
 * and the downloadable PDF, which is printed from that same page — so the
 * document a recruiter opens and the page they can link to never drift.
 */
import { profile } from "./profile";
import { SITE_URL } from "@/lib/seo";

export interface ResumeRole {
  company: string;
  /** What the company is, for readers outside Iran. */
  context: string;
  title: string;
  location: string;
  period: string;
  points: string[];
}

export interface ResumeProject {
  name: string;
  summary: string;
  /** Live URL, when the product is publicly reachable. */
  link?: string;
}

/** Last meaningful content change — printed on the PDF so it never looks stale. */
export const RESUME_UPDATED = "October 2026";

export const resume = {
  name: `${profile.firstName} ${profile.lastName}`,
  title: "Senior Frontend Engineer",
  location: `${profile.location.city}, ${profile.location.country}`,
  email: profile.email,
  phone: profile.phone,
  site: SITE_URL,
  github: profile.social.github,
  linkedin: profile.social.linkedin,

  summary:
    "Senior frontend engineer with 6+ years shipping consumer-scale web products to 900K+ users in Iran. I own frontend architecture end to end — Next.js / React platforms, installable PWAs, real-time and AI-streaming interfaces, and the design systems that keep them coherent. Strongest on web performance (LCP p75 5.0s → 1.5s and INP 300ms → 120ms on a 300K-user PWA) and on Persian-first, RTL-correct product UI. I work AI-assisted day to day — Claude Code for spec-driven refactors, test generation and large codemods — and treat it as part of the toolchain, not a novelty.",

  skills: [
    {
      label: "Languages & core",
      items: ["TypeScript", "JavaScript (ES2023)", "HTML", "Modern CSS"],
    },
    {
      label: "Frameworks",
      items: [
        "React 19",
        "Next.js (App Router, RSC, SSR/ISR)",
        "Vite",
        "Web Components",
      ],
    },
    {
      label: "UI & styling",
      items: [
        "Tailwind CSS",
        "Framer Motion",
        "Storybook",
        "Design tokens",
        "RTL & i18n",
      ],
    },
    {
      label: "Data & realtime",
      items: [
        "React Query",
        "SSE token streaming",
        "WebSocket",
        "REST",
        "Optimistic UI",
      ],
    },
    {
      label: "Performance",
      items: [
        "Core Web Vitals",
        "Bundle budgets",
        "Code splitting",
        "RUM",
        "Lighthouse CI",
      ],
    },
    {
      label: "Quality",
      items: [
        "Vitest",
        "Testing Library",
        "Playwright",
        "Visual regression",
        "WCAG 2.1 AA",
      ],
    },
    {
      label: "Platform",
      items: ["Nx monorepo", "CI/CD", "Docker", "Nginx", "Sentry", "Git"],
    },
    {
      label: "AI-assisted engineering",
      items: [
        "Claude Code / agentic coding workflows",
        "Spec-driven development",
        "LLM product patterns (streaming, tool orchestration)",
      ],
    },
  ],

  experience: [
    {
      company: "Hiweb / Selfit",
      context:
        "One of Iran's largest ISP groups and its corporate-welfare platform.",
      title: "Senior Frontend Engineer",
      location: "Tehran",
      period: "2022 — Present",
      points: [
        "Own frontend architecture across six products — an employee PWA, an HR admin panel, an AI assistant, travel search, eSIM commerce and marketing sites — on a shared monorepo and design system.",
        "Cut the main bundle 4 MB → 1 MB and moved the 300K-user PWA from LCP p75 5.0s → 1.5s and INP 300ms → 120ms, then held those budgets through peak load with RUM and Sentry.",
        "Designed the AI assistant's streaming layer, replacing WebSocket with fetch/SSE token streaming: p50 time-to-first-token 1.2s → 0.4s (−67%), chat completion rate +18%, serving ~600K ISP subscribers.",
        "Shipped a framework-agnostic Web Component chatbot embedded across every Selfit product — one build for all apps, cutting integration from days to hours (~70%) and removing duplicate per-app work (~65% less engineering effort).",
        "Drove the migration of SELTrip's travel search from a legacy SPA to the Next.js App Router with RSC, ISR and edge caching: LCP p75 4.8s → 1.6s, INP 320ms → 120ms, CLS 0.18 → 0.04.",
        "Built and maintain the design system: 60+ accessible, RTL-first components with visual-regression gates in CI.",
        "Mentor three frontend engineers — the review standards, performance budgets and release checklists I wrote are what the frontend group now ships against.",
      ],
    },
    {
      company: "Satpay",
      context: "Payments and merchant analytics.",
      title: "Frontend Engineer",
      location: "Tehran",
      period: "2020 — 2022",
      points: [
        "Built real-time analytics dashboards in React and TypeScript for payment operations teams.",
        "Rendered interactive time-series charts over large datasets with server pagination and list virtualization.",
        "~95% on-time sprint delivery, turning ambiguous specs into shipped, measurable features.",
      ],
    },
  ] satisfies ResumeRole[],

  projects: [
    {
      name: "Selfit Web App — corporate-welfare PWA",
      summary:
        "Employee-facing PWA for ~300K users: venue booking, wallets and entitlements. Installable, offline-friendly and fast on low-end Android. Lighthouse 90+ on key journeys.",
    },
    {
      name: "Hiweb AI Assistant",
      summary:
        "24/7 LLM support assistant for ~600K ISP subscribers. End-to-end SSE streaming architecture; −67% time-to-first-token, +6.5% lead→sale on high-intent flows.",
    },
    {
      name: "SELTrip — travel search",
      summary:
        "Large-result travel search rebuilt on the Next.js App Router with RSC, ISR and edge caching. −67% LCP, −63% INP against the legacy SPA, plus an SEO uplift from server metadata and on-demand ISR.",
    },
    {
      name: "Selfit B2B Admin",
      summary:
        "Operational HR panel: virtualized data grids over server pagination, analytics dashboards, exports and role-based access across organization hierarchies.",
    },
    {
      name: "MatinOS — this portfolio",
      summary:
        "A desktop-metaphor portfolio in Next.js 16 and React 19: draggable widget grid, a real in-browser terminal, bilingual fa/en with full RTL, custom theming and a tested component layer.",
      link: SITE_URL,
    },
  ] satisfies ResumeProject[],

  education: {
    degree: "B.Sc. Computer Software Engineering",
    school: "Islamic Azad University",
    period: "2019 — 2023",
  },

  languages: [
    "Persian — native",
    "English — professional working proficiency",
  ],
} as const;
