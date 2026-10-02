import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import BoltLogo from "./bolt-logo";

/**
 * OS-style boot splash, shown once per browser session.
 *
 * Server-rendered and animated entirely in CSS (see `globals.css`). It used to
 * be a client component whose framer-motion timeline started only once React
 * had hydrated, which made an opaque panel sit over a page that was otherwise
 * ready to read — and tied how long it sat there to how long the JavaScript
 * took. As CSS it starts with the first paint and clears itself in under a
 * second with nothing running, which is what Speed Index actually measures.
 *
 * A visitor who has already booted this session never sees it: the pre-paint
 * script in `theme-init.ts` marks the session and `:root.booted .boot-screen`
 * is `display: none` from the first frame. Nothing here reads storage during
 * render, because that is what makes the server and client disagree.
 */
export default async function BootScreen({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  return (
    <div
      className="boot-screen fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[#0a0b10]"
      aria-label={dict.boot.loading}
      role="status"
    >
      <div className="boot-mark flex flex-col items-center gap-3">
        <BoltLogo className="h-16 w-16 drop-shadow-[0_0_24px_rgba(0,204,255,0.5)]" />
        <div className="font-sf-pro text-2xl font-semibold tracking-tight text-white">
          {dict.menu.os}
        </div>
        <div className="text-sm text-white/50">{dict.boot.tagline}</div>
      </div>

      <div className="h-1 w-48 overflow-hidden rounded-full bg-white/15">
        <div className="boot-bar h-full w-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet" />
      </div>
    </div>
  );
}
