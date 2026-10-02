/**
 * The theme rule, as a blocking inline script.
 *
 * It has to run before the first paint, because the clock — not the OS's
 * `prefers-color-scheme` — decides the theme, and CSS cannot read a clock. A
 * deferred or `async` file would let the page paint light at 22:00 and flip
 * dark a moment later. Keep this in step with `resolve()` in
 * `theme-provider.tsx`; they are the same rule, one before hydration and one
 * after.
 *
 * It also records, and marks, whether this session has already seen the boot
 * splash. Both halves belong here for the same reason as the theme: the splash
 * is server-rendered and dismisses itself in CSS, so only a rule that lands
 * before the first paint can keep it from covering a page the visitor was
 * already shown once this session.
 */
export const THEME_INIT = `(function(){try{
var stored=localStorage.getItem("matinos-theme");
var hour=new Date().getHours();
var night=hour>=19||hour<7;
var dark=stored==="dark"||((!stored||stored==="system")&&night);
var c=document.documentElement.classList;
c.toggle("dark",dark);
c.toggle("light",!dark);
c.toggle("booted",sessionStorage.getItem("matinos-booted")!==null);
sessionStorage.setItem("matinos-booted","1");
}catch(e){}})();`;
