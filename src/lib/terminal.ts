import { PROJECT_IDS, projects, type ProjectId } from "@/data/projects";
import { profile, stack } from "@/data/profile";
import { RESUME_PAGE, RESUME_PDF } from "@/lib/seo";
import en from "@/i18n/dictionaries/en.json";

/**
 * The MatinOS terminal command engine. Pure and side-effect free:
 * it maps an input string to a result the UI acts on. The terminal
 * speaks English regardless of site language — like a real shell.
 */
export type TerminalResult =
  | { type: "output"; lines: string[] }
  | { type: "clear" }
  | { type: "open-url"; url: string; lines: string[] }
  | { type: "open-project"; id: ProjectId; lines: string[] };

const out = (...lines: string[]): TerminalResult => ({ type: "output", lines });

const HELP: string[] = [
  "Available commands:",
  "  help          show this help",
  "  whoami        who is matin?",
  "  projects      list shipped projects",
  "  open <id>     open a project window, e.g. `open seltrip`",
  "  skills        tech I work with",
  "  experience    where I've worked",
  "  resume        open my résumé (English, PDF available)",
  "  contact       how to reach me",
  "  github        open my GitHub profile",
  "  linkedin      open my LinkedIn profile",
  "  clear         clear the terminal",
];

const projectList = (): string[] => [
  "Shipped projects — `open <id>` for details:",
  ...projects.map(
    (p) => `  ${p.id.padEnd(16)} ${en.projects.items[p.id].tagline}`
  ),
];

export function runCommand(input: string): TerminalResult {
  const trimmed = input.trim();
  if (!trimmed) return out();

  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd.toLowerCase()) {
    case "help":
    case "?":
      return out(...HELP);

    case "whoami":
      return out(
        "Matin Zarifamin — Senior Frontend Engineer @ Hiweb / Selfit",
        "6+ years building AI-driven products, real-time dashboards",
        "and design systems for 900K+ users. Tehran, Iran.",
        "Owns frontend architecture, mentors three engineers.",
        "Obsessed with Web Vitals. Type `resume` for the full CV."
      );

    case "projects":
    case "ls":
      return out(...projectList());

    case "open": {
      const target = args[0]?.toLowerCase();
      if (!target)
        return out("usage: open <project-id | github | linkedin>");
      if (target === "github")
        return {
          type: "open-url",
          url: profile.social.github,
          lines: [`Opening ${profile.social.github} …`],
        };
      if (target === "linkedin")
        return {
          type: "open-url",
          url: profile.social.linkedin,
          lines: [`Opening ${profile.social.linkedin} …`],
        };
      if ((PROJECT_IDS as readonly string[]).includes(target))
        return {
          type: "open-project",
          id: target as ProjectId,
          lines: [`Opening ${en.projects.items[target as ProjectId].name} …`],
        };
      return out(`open: no such project: ${target}`, "try `projects`");
    }

    case "skills":
    case "stack":
      return out(stack.join(" · "));

    case "experience":
    case "exp":
      return out(
        "2022 — now   Senior Frontend Engineer @ Hiweb / Selfit",
        "             frontend architecture · design system · AI products",
        "2020 — 2022  Frontend Engineer @ Satpay",
        "             real-time analytics dashboards"
      );

    case "resume":
    case "cv":
      return {
        type: "open-url",
        url: RESUME_PAGE,
        lines: [`Opening ${RESUME_PAGE} …`, `PDF: ${RESUME_PDF}`],
      };

    case "contact":
      return out(
        `email     ${profile.email}`,
        `github    ${profile.social.github}`,
        `linkedin  ${profile.social.linkedin}`,
        `location  ${profile.location.city}, ${profile.location.country}`
      );

    case "github":
      return {
        type: "open-url",
        url: profile.social.github,
        lines: [`Opening ${profile.social.github} …`],
      };

    case "linkedin":
      return {
        type: "open-url",
        url: profile.social.linkedin,
        lines: [`Opening ${profile.social.linkedin} …`],
      };

    case "clear":
    case "cls":
      return { type: "clear" };

    case "sudo":
      return out(
        "matin is not in the sudoers file.",
        "This incident will be reported."
      );

    case "echo":
      return out(args.join(" "));

    default:
      return out(`command not found: ${cmd} — try \`help\``);
  }
}

export const TERMINAL_PROMPT = "matin@os ~ %";

export const TERMINAL_BANNER: string[] = [
  "MatinOS Terminal — v1.0.0",
  "Type `help` to see what I can do.",
];
