"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { ProjectShot } from "@/data/projects";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

/**
 * Shape class derived from the capture itself, so the grid adapts to whatever
 * sits in `public/images/shots/` without anyone tagging the files.
 */
type Kind = "wide" | "phone" | "square";

const kindOf = ({ width, height }: ProjectShot): Kind => {
  const ratio = width / height;
  if (ratio > 1.25) return "wide";
  if (ratio < 0.8) return "phone";
  return "square";
};

/** Static strings only — Tailwind has to see these class names to emit them. */
const SPAN = {
  hero: "col-span-6 md:col-span-12",
  half: "col-span-6",
  phone: "col-span-3",
} as const;

const FRAME = {
  // Tall captures are cropped in the grid and shown whole in the lightbox, so
  // a long landing page reads as a tidy card instead of a thin ribbon.
  wide: "aspect-[16/10]",
  phone: "aspect-[9/16]",
  square: "aspect-[4/3]",
} as const;

interface Tile {
  shot: ProjectShot;
  kind: Kind;
  span: keyof typeof SPAN;
}

/**
 * Lays the captures out from their own proportions: phones sit four-up, a lone
 * landscape capture becomes the hero, and an odd one out is promoted so no row
 * ends with a gap.
 */
function plan(shots: ProjectShot[]): Tile[] {
  const kinds = shots.map(kindOf);
  const landscape = kinds.filter((kind) => kind !== "phone");
  const heroAt = kinds.findIndex((kind) => kind !== "phone");

  return shots.map((shot, index) => {
    const kind = kinds[index];
    if (kind === "phone") return { shot, kind, span: "phone" };
    const hero = landscape.length % 2 === 1 && index === heroAt;
    return { shot, kind, span: hero ? "hero" : "half" };
  });
}

export default function ShotGallery({
  shots,
  title,
}: {
  shots: ProjectShot[];
  title: string;
}) {
  const { dict } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const tiles = plan(shots);

  const step = useCallback(
    (delta: number) =>
      setOpen((current) =>
        current === null ? null : (current + delta + shots.length) % shots.length
      ),
    [shots.length]
  );

  // Arrow keys in the lightbox. Escape is the parent modal's job, and this
  // listener stops once the lightbox closes.
  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const active = open === null ? null : shots[open];

  return (
    <div dir="ltr">
      <div className="grid grid-cols-6 gap-2.5 md:grid-cols-12 md:gap-3">
        {tiles.map(({ shot, kind, span }, index) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => setOpen(index)}
            aria-label={`${title} — ${dict.projects.meta.screens} ${index + 1}`}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-black/10 bg-zinc-100 shadow-sm outline-none transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-accent-cyan dark:border-white/10 dark:bg-zinc-800",
              SPAN[span],
              FRAME[kind]
            )}
          >
            <Image
              src={shot.src}
              alt={`${title} — ${dict.projects.meta.screens} ${index + 1}`}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 420px"
              // Top-anchored: a screenshot's first screen is the part worth
              // seeing in a thumbnail.
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-zinc-900 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
              <Maximize2 size={13} />
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="font-mono text-xs tabular-nums text-white/70">
              {open! + 1} / {shots.length}
            </span>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={dict.a11y.close}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-5"
            // Click the backdrop to dismiss; the image itself stops the event.
            onClick={() => setOpen(null)}
          >
            <Image
              key={active.src}
              src={active.src}
              alt={`${title} — ${dict.projects.meta.screens}`}
              width={active.width}
              height={active.height}
              sizes="90vw"
              onClick={(event) => event.stopPropagation()}
              className="max-h-full w-auto rounded-xl object-contain shadow-2xl"
            />

            {shots.length > 1 && (
              <>
                <GalleryNav side="left" label={dict.a11y.prev} onClick={() => step(-1)} />
                <GalleryNav side="right" label={dict.a11y.next} onClick={() => step(1)} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryNav({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        // 44px target, the minimum that stays comfortable on a phone.
        "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30",
        side === "left" ? "left-3" : "right-3"
      )}
    >
      <Icon size={20} />
    </button>
  );
}
