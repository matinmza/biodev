import { Mail, MapPin, Phone } from "lucide-react";
import { RESUME_UPDATED, resume } from "@/data/resume";
import { SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** Strip the scheme so links read as plain text on paper. */
const bare = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 border-b border-zinc-300 pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
      {children}
    </h2>
  );
}

/**
 * The résumé itself — one component, three consumers: the `/[lang]/resume`
 * page, the in-OS preview window, and the printed PDF. Always LTR, always
 * light: it is a document, not a themed surface.
 */
export default function ResumeDocument({ className }: { className?: string }) {
  return (
    <article
      dir="ltr"
      className={cn(
        "resume-sheet bg-white px-9 py-10 font-sf-pro text-zinc-800",
        className
      )}
    >
      {/* ---------- Header ---------- */}
      <header className="border-b-2 border-zinc-900 pb-4">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-zinc-900">
          {resume.name}
        </h1>
        {/* Plain type, not gradient text — this document gets printed. */}
        <p className="mt-0.5 text-[15px] font-semibold tracking-wide text-zinc-600">
          {resume.title}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-600">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} /> {resume.location}
          </span>
          <a
            href={`tel:${resume.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1"
          >
            <Phone size={12} /> {resume.phone}
          </a>
          <a href={`mailto:${resume.email}`} className="inline-flex items-center gap-1">
            <Mail size={12} /> {resume.email}
          </a>
        </div>

        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-medium text-zinc-700">
          <a href={resume.site}>{bare(resume.site)}</a>
          <a href={resume.github}>{bare(resume.github)}</a>
          <a href={resume.linkedin}>{bare(resume.linkedin)}</a>
        </div>
      </header>

      {/* ---------- Summary ---------- */}
      <section className="mt-5">
        <SectionTitle>Summary</SectionTitle>
        <p className="text-[12.5px] leading-[1.65] text-zinc-700">{resume.summary}</p>
      </section>

      {/* ---------- Skills ---------- */}
      <section className="mt-5">
        <SectionTitle>Core skills</SectionTitle>
        <dl className="space-y-1">
          {resume.skills.map((group) => (
            <div
              key={group.label}
              className="flex flex-col gap-x-2 break-inside-avoid text-[12px] leading-[1.6] sm:flex-row"
            >
              <dt className="shrink-0 font-semibold text-zinc-900 sm:w-[150px]">
                {group.label}
              </dt>
              <dd className="text-zinc-700">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Experience ---------- */}
      <section className="mt-5">
        <SectionTitle>Experience</SectionTitle>
        <div className="space-y-4">
          {resume.experience.map((role) => (
            <div key={role.company} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-[14px] font-bold text-zinc-900">
                  {role.company}
                  <span className="font-semibold text-zinc-600"> — {role.title}</span>
                </h3>
                <span className="text-[11.5px] font-medium tabular-nums text-zinc-500">
                  {role.location} · {role.period}
                </span>
              </div>
              <p className="mt-0.5 text-[11.5px] italic text-zinc-500">{role.context}</p>
              <ul className="mt-1.5 space-y-1">
                {role.points.map((point) => (
                  <li
                    key={point}
                    className="relative break-inside-avoid pl-3.5 text-[12px] leading-[1.6] text-zinc-700 before:absolute before:left-0 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-zinc-400"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Projects ---------- */}
      <section className="mt-5">
        <SectionTitle>Selected projects</SectionTitle>
        <ul className="space-y-1.5">
          {resume.projects.map((project) => (
            <li
              key={project.name}
              className="break-inside-avoid text-[12px] leading-[1.6]"
            >
              <span className="font-semibold text-zinc-900">{project.name}</span>
              <span className="text-zinc-700"> — {project.summary}</span>
              {project.link && (
                <a href={project.link} className="ml-1 font-medium text-zinc-600 underline">
                  {bare(project.link)}
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Education & languages ---------- */}
      <section className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <SectionTitle>Education</SectionTitle>
          <p className="text-[12px] leading-[1.6] text-zinc-700">
            <span className="font-semibold text-zinc-900">{resume.education.degree}</span>
            <br />
            {resume.education.school} · {resume.education.period}
          </p>
        </div>
        <div>
          <SectionTitle>Languages</SectionTitle>
          <ul className="text-[12px] leading-[1.6] text-zinc-700">
            {resume.languages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="mt-6 border-t border-zinc-200 pt-2 text-[10.5px] text-zinc-400">
        Updated {RESUME_UPDATED} · Latest version always at {bare(SITE_URL)}/en/resume
      </footer>
    </article>
  );
}
