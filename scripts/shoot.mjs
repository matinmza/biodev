#!/usr/bin/env node
/**
 * Headless-browser capture with no new dependency: it drives whatever Chrome
 * or Edge is installed, over the DevTools protocol (Node 22 ships WebSocket).
 *
 *   node scripts/shoot.mjs resume          → public/matin-zarifamin.pdf
 *   node scripts/shoot.mjs shots [id]      → public/images/shots/<id>/<n>.png
 *
 * `resume` needs the site running (`npm run dev`, or `npm run build && npm start`);
 * override the origin with BASE_URL=http://localhost:3001.
 *
 * Driving the protocol rather than the one-shot `--screenshot` flag buys the
 * two things a portfolio needs: a page captured at full height, and the chance
 * to dismiss a splash or intro step before the shutter.
 */
import { spawn, execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const PORT = Number(process.env.CDP_PORT ?? 9333);

const PHONE = { width: 430, height: 932, mobile: true };
const DESKTOP = { width: 1440, height: 900, mobile: false };
// The chat products render a narrow centred panel; a full desktop frame would
// be mostly empty margin.
const CHAT = { width: 560, height: 920, mobile: false };

/** How many frames each project should end up with, when the site has them. */
const WANTED = 5;

/**
 * Same-origin paths linked from the current page, in document order. Harvested
 * rather than hard-coded: ten sites with hand-written route lists would go
 * stale the first time one of them shipped a redesign.
 */
const HARVEST_PATHS = `(() => {
  const seen = new Set();
  const out = [];
  for (const anchor of document.querySelectorAll("a[href]")) {
    let url;
    try { url = new URL(anchor.getAttribute("href"), location.href); } catch { continue; }
    if (url.origin !== location.origin) continue;
    const path = url.pathname.replace(/\\/+$/, "") || "/";
    if (path === "/" || seen.has(path)) continue;
    if (/\\.[a-z0-9]{2,4}$/i.test(path)) continue;
    seen.add(path);
    out.push(path);
  }
  return out;
})()`;

/**
 * Scrolls down by most of a screen and reports whether the page actually
 * moved, so a short page stops producing identical frames.
 */
const SCROLL_ONE_SCREEN = `(() => {
  const before = window.scrollY;
  window.scrollTo({ top: before + window.innerHeight * 0.88, behavior: "instant" });
  return window.scrollY > before + 40;
})()`;

/** Enough rendered text to believe the route is a real page and not a 404. */
const PAGE_LOOKS_REAL = `(() => {
  const text = (document.body?.innerText ?? "").replace(/\\s+/g, " ").trim();
  return { length: text.length, path: location.pathname.replace(/\\/+$/, "") || "/" };
})()`;

/**
 * Clicks the first visible element whose text matches, then reports whether it
 * found one. Injected into the page, so it must stay self-contained.
 */
/**
 * Types a question into the first visible text field and submits it. React
 * ignores a plain `value =`, so the native setter is called directly and the
 * input event dispatched by hand.
 */
const askChat = (question) => `(() => {
  const field = [...document.querySelectorAll('textarea, input[type="text"], input:not([type])')]
    .find((el) => el.offsetParent !== null);
  if (!field) return false;
  const proto = field instanceof HTMLTextAreaElement
    ? HTMLTextAreaElement.prototype
    : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(field, ${JSON.stringify(question)});
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.focus();
  const form = field.closest("form");
  if (form?.requestSubmit) { form.requestSubmit(); return true; }
  field.dispatchEvent(new KeyboardEvent("keydown", {
    key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true,
  }));
  return true;
})()`;

const clickText = (...texts) => `(() => {
  const want = ${JSON.stringify(texts)};
  const hit = [...document.querySelectorAll('button, a, [role="button"]')]
    .filter((el) => el.offsetParent !== null)
    .find((el) => want.includes(el.textContent?.trim()));
  if (hit) { hit.click(); return true; }
  return false;
})()`;

/**
 * Live products to capture. `url` empty means "address not public yet" — the
 * script skips it rather than guessing and shipping someone else's site.
 *
 * `steps` are extra captures taken after interacting with the page, which is
 * how the chat products get past their intro screen into the actual UI.
 */
/**
 * The chat products are a single screen with no routes to crawl, so their
 * extra frames come from using them: past the intro, then one answered
 * question, then a second. Both are ordinary public demo bots.
 */
const CHAT_STEPS = [
  { label: "chat", run: clickText("شروع", "شروع گفتگو"), settle: 5000 },
  { label: "answer", run: askChat("سلام، چه خدماتی دارید؟"), settle: 11000 },
  { label: "answer 2", run: askChat("تعرفه اینترنت خانگی چقدره؟"), settle: 11000 },
];

const SHOT_TARGETS = [
  {
    id: "hiweb-ai",
    url: "http://chatbot.hiweb.ir",
    viewport: CHAT,
    steps: CHAT_STEPS,
  },
  {
    id: "parsonline-ai",
    url: "https://chatbot.parsonline.com",
    viewport: CHAT,
    steps: CHAT_STEPS,
  },
  { id: "selfit-coach", url: "https://selfitapp.com", viewport: DESKTOP },
  { id: "selfit-app", url: "https://app.selfit.ir", viewport: PHONE, also: ["/login"] },
  { id: "selfit-landing", url: "https://selfit.ir", viewport: DESKTOP },
  { id: "selfit-provider", url: "https://provider.selfit.ir", viewport: DESKTOP },
  { id: "seltrip", url: "https://seltrip.agtan.ir", viewport: DESKTOP },
  { id: "rose-menu", url: "https://rose-menu-beta.vercel.app", viewport: PHONE },
  { id: "almas-dental", url: "https://almasdentalclinic.ir", viewport: DESKTOP },
  { id: "farda-insurance", url: "https://www.fardains.ir", viewport: DESKTOP },
  // No public address.
  { id: "selfit-b2b", url: "", viewport: DESKTOP },
  { id: "esim", url: "", viewport: PHONE },
  { id: "prodoc", url: "", viewport: DESKTOP },
];

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const BROWSER = CANDIDATES.find((path) => existsSync(path));
if (!BROWSER) {
  throw new Error(
    `No Chrome or Edge found. Set CHROME_PATH.\nLooked in:\n  ${CANDIDATES.join("\n  ")}`
  );
}

const PROFILE = join(ROOT, ".cache", "shoot-profile");
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const BASE_FLAGS = [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--hide-scrollbars",
  // One target still serves an expired certificate; without this the capture
  // would be of Chrome's interstitial instead of the site.
  "--ignore-certificate-errors",
  `--user-data-dir=${PROFILE}`,
];

// ---------------------------------------------------------------- CDP client

/** Minimal DevTools client: send a command, await its reply, await events. */
class Session {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.waiters = [];
    socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve: done, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else done(message.result);
        return;
      }
      this.waiters = this.waiters.filter((waiter) => {
        if (waiter.method !== message.method) return true;
        waiter.resolve(message.params);
        return false;
      });
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((done, reject) => this.pending.set(id, { resolve: done, reject }));
  }

  /** Resolves on the next matching event, or after `timeout` regardless. */
  once(method, timeout) {
    return new Promise((done) => {
      const waiter = { method, resolve: done };
      this.waiters.push(waiter);
      setTimeout(() => {
        this.waiters = this.waiters.filter((entry) => entry !== waiter);
        done(null);
      }, timeout);
    });
  }
}

async function launch() {
  rmSync(PROFILE, { recursive: true, force: true });
  const child = spawn(
    BROWSER,
    [...BASE_FLAGS, `--remote-debugging-port=${PORT}`, "about:blank"],
    { stdio: "ignore" }
  );

  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      if ((await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok) return child;
    } catch {
      // Not listening yet.
    }
    await sleep(500);
  }
  child.kill();
  throw new Error("Browser never opened its debugging port.");
}

async function openTab() {
  const response = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, {
    method: "PUT",
  });
  const tab = await response.json();
  const socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((done, fail) => {
    socket.addEventListener("open", done, { once: true });
    socket.addEventListener("error", fail, { once: true });
  });
  return { id: tab.id, session: new Session(socket), socket };
}

async function closeTab(tab) {
  tab.socket.close();
  await fetch(`http://127.0.0.1:${PORT}/json/close/${tab.id}`).catch(() => {});
}

/** Navigate, emulate the device, and let the page settle. */
async function visit(session, url, viewport, settle = 6000) {
  await session.send("Page.enable");
  await session.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.mobile ? 2 : 1,
    mobile: viewport.mobile,
  });
  await session.send("Page.navigate", { url });
  await session.once("Page.loadEventFired", 45_000);
  await sleep(settle);
}

/**
 * One screen, exactly the emulated viewport. Framing every capture to the
 * device rather than to the page's own height is what makes the gallery read
 * as one set: a 900px desktop frame next to a 7000px full-page ribbon never
 * will, however the layout crops it.
 */
async function capture(session, file) {
  const { data } = await session.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  writeFileSync(file, Buffer.from(data, "base64"));
  return statSync(file).size;
}

// -------------------------------------------------------------------- tasks

/** Run an expression in the page and return its value. */
async function evaluate(session, expression) {
  const { result } = await session.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result?.value;
}

const normalize = (path) => path.replace(/\/+$/, "") || "/";

/**
 * Up to WANTED frames of one product: the entry screen, whatever the intro
 * steps unlock, then other pages the site links to, and finally further
 * screens of the entry page if the site is a single long landing.
 */
async function captureTarget(target) {
  const dir = join(ROOT, "public", "images", "shots", target.id);
  mkdirSync(dir, { recursive: true });
  // Clear the frames, keep the folder and its .gitkeep: the empty folders are
  // the contract that says "drop images here".
  for (const name of readdirSync(dir)) {
    if (name !== ".gitkeep") rmSync(join(dir, name), { force: true });
  }

  const origin = target.url.replace(/\/$/, "");
  // Byte size stands in for "same frame again": identical renders of a short
  // page, or of a route that quietly redirected home, weigh exactly the same.
  const seen = new Set();
  let index = 0;

  const take = async (session, label) => {
    const file = join(dir, `${index + 1}.png`);
    const size = await capture(session, file);
    if (seen.has(size)) {
      rmSync(file, { force: true });
      return false;
    }
    seen.add(size);
    index++;
    console.log(`  ${target.id} ${label} → ${index}.png (${Math.round(size / 1024)} KB)`);
    return true;
  };

  const entry = await openTab();
  let live = false;
  let linked = [];

  try {
    await visit(entry.session, `${origin}/`, target.viewport);
    await take(entry.session, "/");
    live = true;

    for (const step of target.steps ?? []) {
      if (!(await evaluate(entry.session, step.run))) {
        console.warn(`  ${target.id}: step "${step.label}" found nothing to click`);
        continue;
      }
      await sleep(step.settle ?? 3000);
      await take(entry.session, step.label);
    }

    linked = (await evaluate(entry.session, HARVEST_PATHS)) ?? [];
  } catch (error) {
    console.warn(`  ${target.id}/ failed: ${error.message}`);
  }

  for (const path of new Set([...(target.also ?? []), ...linked].map(normalize))) {
    if (index >= WANTED) break;
    const tab = await openTab();
    try {
      await visit(tab.session, origin + path, target.viewport, 4000);
      const page = await evaluate(tab.session, PAGE_LOOKS_REAL);
      // A redirect or a near-empty body means the link was not a page worth
      // showing — an error screen in a portfolio is worse than one fewer shot.
      if (!page || page.length < 220 || page.path !== path) continue;
      await take(tab.session, path);
    } catch (error) {
      console.warn(`  ${target.id}${path} failed: ${error.message}`);
    } finally {
      await closeTab(tab);
    }
  }

  try {
    for (let screen = 2; live && index < WANTED && screen <= 7; screen++) {
      if (!(await evaluate(entry.session, SCROLL_ONE_SCREEN))) break;
      await sleep(900);
      await take(entry.session, `screen ${screen}`);
    }
  } catch (error) {
    console.warn(`  ${target.id} scroll pass failed: ${error.message}`);
  } finally {
    await closeTab(entry);
  }

  if (index < WANTED) {
    console.warn(`  ${target.id}: ${index} frame(s) — the site had no more to show`);
  }
}

async function captureShots(only) {
  const picked = only ? SHOT_TARGETS.filter((t) => t.id === only) : SHOT_TARGETS;
  const ready = picked.filter((target) => target.url);
  const skipped = picked.filter((target) => !target.url).map((target) => target.id);
  if (skipped.length) console.log(`Skipping (no public URL): ${skipped.join(", ")}`);
  if (!ready.length) return;

  const browser = await launch();
  try {
    for (const target of ready) await captureTarget(target);
  } finally {
    browser.kill();
  }

  execFileSync(process.execPath, [join(ROOT, "scripts", "index-shots.mjs")], {
    stdio: "inherit",
  });
}

async function buildResumePdf() {
  const url = `${BASE_URL}/en/resume`;
  for (let attempt = 0; ; attempt++) {
    try {
      if ((await fetch(url, { redirect: "follow" })).ok) break;
    } catch {
      // Not listening yet.
    }
    if (attempt >= 30) throw new Error(`${url} never answered. Start the site first.`);
    await sleep(1000);
  }

  const out = join(ROOT, "public", "matin-zarifamin.pdf");
  const browser = await launch();
  try {
    const tab = await openTab();
    // A4 in inches, stated explicitly so the sheet prints to standard paper
    // regardless of the machine's default (Letter on a US install).
    await visit(tab.session, url, DESKTOP, 4000);
    const { data } = await tab.session.send("Page.printToPDF", {
      paperWidth: 8.27,
      paperHeight: 11.69,
      // ~14mm all round: the sheet has no padding of its own in print, so
      // this is the whole margin a reader sees.
      marginTop: 0.55,
      marginBottom: 0.55,
      marginLeft: 0.55,
      marginRight: 0.55,
      printBackground: true,
    });
    writeFileSync(out, Buffer.from(data, "base64"));
    await closeTab(tab);
  } finally {
    browser.kill();
  }
  console.log(`\n✓ ${out} (${Math.round(statSync(out).size / 1024)} KB) from ${url}`);
}

/** Widest wallpaper worth shipping: a 4K panel at 2x is still covered. */
const WALLPAPER_WIDTH = 2560;
const WALLPAPER_QUALITY = 0.78;

/**
 * Re-encodes whatever wallpaper photo was dropped into public/images down to a
 * sane weight, in the browser's own canvas — a camera-original JPEG is several
 * megabytes, and this one is preloaded as the page's largest element.
 *
 *   node scripts/shoot.mjs wallpapers
 */
async function shrinkWallpapers() {
  const dir = join(ROOT, "public", "images");
  const files = readdirSync(dir).filter((name) =>
    /^wallpaper-(light|dark)\.(jpe?g|png)$/i.test(name)
  );
  if (!files.length) {
    console.log("No public/images/wallpaper-{light,dark}.{jpg,png} to shrink.");
    return;
  }

  const browser = await launch();
  try {
    for (const name of files) {
      const file = join(dir, name);
      const before = statSync(file).size;
      const tab = await openTab();
      try {
        // Served over the protocol as a data URL so the page needs no server.
        const source = `data:image/${name.endsWith(".png") ? "png" : "jpeg"};base64,${readFileSync(file).toString("base64")}`;
        const encoded = await evaluate(
          tab.session,
          `(async () => {
            const image = new Image();
            image.src = ${JSON.stringify(source)};
            await image.decode();
            const scale = Math.min(1, ${WALLPAPER_WIDTH} / image.naturalWidth);
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(image.naturalWidth * scale);
            canvas.height = Math.round(image.naturalHeight * scale);
            const context = canvas.getContext("2d");
            context.imageSmoothingQuality = "high";
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            return {
              data: canvas.toDataURL("image/jpeg", ${WALLPAPER_QUALITY}).split(",")[1],
              width: canvas.width,
              height: canvas.height,
            };
          })()`
        );
        if (!encoded?.data) throw new Error("the browser could not decode it");

        const out = join(dir, name.replace(/\.(jpe?g|png)$/i, ".jpg"));
        writeFileSync(out, Buffer.from(encoded.data, "base64"));
        if (out !== file) rmSync(file, { force: true });
        console.log(
          `  ${name} → ${encoded.width}×${encoded.height}, ` +
            `${Math.round(before / 1024)} KB → ${Math.round(statSync(out).size / 1024)} KB`
        );
      } catch (error) {
        console.warn(`  ${name} failed: ${error.message}`);
      } finally {
        await closeTab(tab);
      }
    }
  } finally {
    browser.kill();
  }

  execFileSync(process.execPath, [join(ROOT, "scripts", "index-shots.mjs")], {
    stdio: "inherit",
  });
}

const [task, only] = process.argv.slice(2);
if (task === "resume") await buildResumePdf();
else if (task === "shots") await captureShots(only);
else if (task === "wallpapers") await shrinkWallpapers();
else {
  console.error("usage: node scripts/shoot.mjs <resume|shots|wallpapers> [target-id]");
  process.exit(1);
}
