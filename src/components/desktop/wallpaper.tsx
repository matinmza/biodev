import { wallpapers } from "@/data/shots.generated";

/**
 * Full-screen desktop wallpaper.
 *
 * Deliberately server-rendered and CSS-only. It used to be a client component
 * that waited for hydration before choosing between the light and dark photo,
 * which hid the image from the browser's preload scanner — Lighthouse flagged
 * it as a late-discovered LCP, and the theme cross-fade that justified the
 * JavaScript cost a framer-motion subtree on the critical path. The theme class
 * is already on `<html>` before the first paint (see `theme-init.ts`), so a
 * pair of CSS rules picks the right photo with nothing to run and nothing to
 * wait for, and only the matching file is ever fetched.
 *
 * With no photo in `public/images`, the gradient classes paint instead: they
 * cost no bytes at all, which is why they stayed the default. The photo skips
 * the `.wallpaper` class, and with it the SVG-noise `::after` dither: that
 * layer exists to break the banding of flat gradients, and a full-screen
 * blended filter is an expensive thing to paint over an image that has grain
 * of its own.
 */
export default function Wallpaper() {
  const { light, dark } = wallpapers;
  const photo = light ?? dark;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-(--desktop-ground)">
      {photo ? (
        <div
          className="wallpaper-photo"
          style={
            {
              "--wallpaper-light": `url(${light ?? dark})`,
              "--wallpaper-dark": `url(${dark ?? light})`,
            } as React.CSSProperties
          }
        />
      ) : (
        <>
          <div className="wallpaper wallpaper-light dark:hidden" />
          <div className="wallpaper wallpaper-dark hidden dark:block" />
        </>
      )}
      {/* Readability layer between wallpaper and glass widgets. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/25" />
    </div>
  );
}
