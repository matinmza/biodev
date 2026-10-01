"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { ProjectShot } from "@/data/projects";
import { useI18n } from "@/i18n/i18n-provider";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

/**
 * How wide a row should be relative to its height. 2.4 puts two desktop
 * frames or four phone frames on a line, which is how a case study is laid
 * out by hand.
 */
const ROW_RATIO = 2.4;

/**
 * Aspect ratio used for layout, clamped: the collage is built out of the
 * captures' real proportions, but one freak image must not be able to flatten
 * a whole row to a ribbon.
 */
const ratioOf = ({ width, height }: ProjectShot) =>
  Math.min(Math.max(width / height, 0.5), 2.2);

export interface Tile {
  shot: ProjectShot;
  /** Position in the original list, so the lightbox opens the right frame. */
  index: number;
  ratio: number;
}

export interface Row {
  tiles: Tile[];
  /** Sum of the tiles' ratios — the row's own aspect ratio. */
  ratio: number;
}

/**
 * Justified rows: fill a line until it is wide enough, then start the next.
 * Tile widths are `ratio / row.ratio`, so every row fills the width exactly
 * and every frame keeps its own proportions — no fixed grid to fight, and any
 * number of captures at any size lays out.
 *
 * A final short row is not stretched: it keeps the height of a full row and
 * ends early, the way a designer would leave the last print where it falls.
 */
export function rows(shots: ProjectShot[], target = ROW_RATIO): Row[] {
  const out: Row[] = [];
  let tiles: Tile[] = [];
  let ratio = 0;

  shots.forEach((shot, index) => {
    const tileRatio = ratioOf(shot);
    tiles.push({ shot, index, ratio: tileRatio });
    ratio += tileRatio;
    if (ratio >= target) {
      out.push({ tiles, ratio });
      tiles = [];
      ratio = 0;
    }
  });

  if (tiles.length) out.push({ tiles, ratio: Math.max(ratio, target) });
  return out;
}

/**
 * Fixed tilts and vertical offsets, cycled by index. Deterministic on purpose:
 * a random tilt would change on every render and on every rebuild.
 */
const TILT = ["-1.6deg", "1.2deg", "-0.8deg", "1.7deg", "-1.1deg"];
const LIFT = ["9px", "-7px", "5px", "-9px", "7px"];

export default function ShotGallery({
  shots,
  title,
}: {
  shots: ProjectShot[];
  title: string;
}) {
  const { dict } = useI18n();
  const mounted = useMounted();
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const laid = rows(shots);
  // A single frame tilted and overlapping nothing just looks crooked.
  const collage = shots.length > 1;
  const isOpen = open !== null;

  const step = useCallback(
    (delta: number) =>
      setOpen((current) =>
        current === null ? null : (current + delta + shots.length) % shots.length
      ),
    [shots.length]
  );

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  // Keyboard handling for the lightbox: navigation, dismissal, and a Tab loop
  // so focus cannot wander into the project window behind the overlay.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Capture phase and stopImmediatePropagation: the project window also
        // closes on Escape, and one key press must not dismiss both.
        event.stopImmediatePropagation();
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight") return step(1);
      if (event.key === "ArrowLeft") return step(-1);
      if (event.key !== "Tab") return;

      const stops = dialog.current?.querySelectorAll<HTMLElement>("button");
      if (!stops?.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const inside = dialog.current?.contains(document.activeElement);
      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [isOpen, step, close]);

  // Move focus in once, on open — not on every arrow press.
  useEffect(() => {
    if (!isOpen) return;
    dialog.current?.querySelector<HTMLElement>("button")?.focus();
  }, [isOpen]);

  const active = open === null ? null : shots[open];

  return (
    <div dir="ltr">
      {/* `isolate` keeps the tiles' stacking order inside the collage. */}
      <div className="isolate px-2 py-3">
        {laid.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex w-full items-stretch"
            style={{
              aspectRatio: row.ratio,
              // Rows tuck into the one above so the corners overlap instead of
              // sitting in a tidy grid.
              marginTop: rowIndex === 0 ? undefined : "-1.4%",
            }}
          >
            {row.tiles.map((tile) => {
              const cycle = tile.index % TILT.length;
              return (
                <button
                  key={tile.shot.src}
                  type="button"
                  onClick={(event) => {
                    // Remembered so closing the lightbox puts focus back on
                    // the print the visitor opened.
                    opener.current = event.currentTarget;
                    setOpen(tile.index);
                  }}
                  aria-label={`${title} — ${dict.projects.meta.screens} ${tile.index + 1}`}
                  style={
                    {
                      width: `${(tile.ratio / row.ratio) * 100}%`,
                      "--tilt": collage ? TILT[cycle] : "0deg",
                      "--lift": collage ? LIFT[cycle] : "0px",
                      "--z": row.tiles.length - row.tiles.indexOf(tile),
                    } as CSSProperties
                  }
                  className={cn(
                    "group relative h-full shrink-0 overflow-hidden rounded-xl outline-none",
                    // The white edge is what makes an overlap read as one print
                    // lying on another rather than as a rendering glitch.
                    "ring-2 ring-white shadow-[0_8px_24px_-8px_rgb(0_0_0/0.45)] dark:ring-zinc-900",
                    "z-[var(--z)] translate-y-[var(--lift)] rotate-[var(--tilt)]",
                    "transition-[transform,box-shadow] duration-300 ease-out",
                    // Hover straightens the print and lifts it clear of the pile.
                    "hover:z-50 hover:-translate-y-1 hover:rotate-0 hover:scale-[1.04] hover:shadow-2xl",
                    "focus-visible:z-50 focus-visible:rotate-0 focus-visible:ring-4 focus-visible:ring-accent-cyan"
                  )}
                >
                  <Image
                    src={tile.shot.src}
                    alt={`${title} — ${dict.projects.meta.screens} ${tile.index + 1}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 45vw, 380px"
                    // Top-anchored: a screenshot's first screen is the part
                    // worth seeing in a thumbnail.
                    className="object-cover object-top"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-zinc-900 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                    <Maximize2 size={13} />
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Portaled to <body>: the project window is a transformed, scrollable
          panel, and a `fixed` child of a transformed ancestor is positioned
          against that panel instead of the viewport — the overlay would be
          sized to the card and then clipped by its overflow. */}
      {mounted &&
        active &&
        createPortal(
          <div
            ref={dialog}
            dir="ltr"
            className="fixed inset-0 z-[120] flex flex-col bg-black/85 backdrop-blur-md"
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
                onClick={close}
                aria-label={dict.a11y.close}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-5"
              // Click the backdrop to dismiss; the image itself stops the event.
              onClick={close}
            >
              <Image
                key={active.src}
                src={active.src}
                alt={`${title} — ${dict.projects.meta.screens}`}
                width={active.width}
                height={active.height}
                sizes="90vw"
                onClick={(event) => event.stopPropagation()}
                // `h-auto w-auto` with both maxima: a flex item's automatic
                // minimum size is the image's intrinsic width, which would
                // otherwise overflow a phone.
                className="h-auto max-h-full w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />

              {shots.length > 1 && (
                <>
                  <GalleryNav side="left" label={dict.a11y.prev} onClick={() => step(-1)} />
                  <GalleryNav side="right" label={dict.a11y.next} onClick={() => step(1)} />
                </>
              )}
            </div>
          </div>,
          document.body
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
