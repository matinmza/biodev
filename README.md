# MatinOS — Portfolio of Matin Zarifamin

A personal portfolio built as a tiny operating system: a draggable widget
desktop, a macOS-style dock where every shipped project is an app, and a
**real, working terminal** — click it and type `help`.

## Highlights

- **Interactive terminal** — `whoami`, `projects`, `open seltrip`,
  `contact`, `sudo` … the command engine is pure TypeScript
  ([src/lib/terminal.ts](src/lib/terminal.ts)) and fully unit-tested.
- **OS desktop metaphor** — boot splash (once per session), glass menu bar,
  bento widget grid you can rearrange by dragging the grip, and a dock with
  genuine magnification physics.
- **Bilingual** — English & Persian with full RTL, Jalali calendar, and
  Persian digits. Locale routing happens in [src/proxy.ts](src/proxy.ts)
  driven by `Accept-Language`.
- **Light/dark wallpapers**, `prefers-reduced-motion` respected, keyboard
  focus visible, semantic dialog/tooltip roles.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4
· Framer Motion · react-grid-layout · Vitest + Testing Library

## Commands

```bash
npm run dev        # develop on http://localhost:3000
npm run build      # production build
npm start          # serve the build
npm test           # run the vitest suite
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Structure

```
src/
  app/[lang]/        # localized layout + page, SEO metadata, robots/sitemap
  components/
    desktop/         # menu bar, dock, widgets, windows, boot screen
    shared/          # modal, toggles, icons
  data/              # profile facts + project registry (language-free)
  i18n/              # locale config, dictionaries (en/fa), provider
  lib/               # terminal engine, datetime, cn
```

## SEO

Ready to publish: per-locale metadata, canonical + `hreflang` (incl.
`x-default`), OpenGraph & Twitter cards with a generated 1200×630 image,
`schema.org` JSON-LD (Person, WebSite, one CreativeWork per project),
`robots.txt`, `sitemap.xml` with language alternates, web manifest and
apple-touch-icon.

**Before deploying**, set `NEXT_PUBLIC_SITE_URL` to the real domain —
metadata, robots, sitemap and JSON-LD all derive from it.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
```
