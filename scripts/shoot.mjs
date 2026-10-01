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
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
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

/**
 * Clicks the first visible element whose text matches, then reports whether it
 * found one. Injected into the page, so it must stay self-contained.
 */
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
const SHOT_TARGETS = [
  {
    id: "hiweb-ai",
    url: "http://chatbot.hiweb.ir",
    viewport: CHAT,
    steps: [{ label: "chat", run: clickText("شروع", "شروع گفتگو"), settle: 5000 }],
  },
  {
    id: "parsonline-ai",
    url: "https://chatbot.parsonline.com",
    viewport: CHAT,
    steps: [{ label: "chat", run: clickText("شروع", "شروع گفتگو"), settle: 5000 }],
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

/** Full-height PNG, capped so a very long page stays a readable thumbnail. */
async function capture(session, file, viewport) {
  const { cssContentSize } = await session.send("Page.getLayoutMetrics");
  const height = Math.min(
    Math.max(Math.ceil(cssContentSize?.height ?? viewport.height), viewport.height),
    viewport.height * 4
  );
  const { data } = await session.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: viewport.width, height, scale: 1 },
  });
  writeFileSync(file, Buffer.from(data, "base64"));
  return statSync(file).size;
}

// -------------------------------------------------------------------- tasks

async function captureShots(only) {
  const picked = only ? SHOT_TARGETS.filter((t) => t.id === only) : SHOT_TARGETS;
  const ready = picked.filter((target) => target.url);
  const skipped = picked.filter((target) => !target.url).map((target) => target.id);
  if (skipped.length) console.log(`Skipping (no public URL): ${skipped.join(", ")}`);
  if (!ready.length) return;

  const browser = await launch();
  try {
    for (const target of ready) {
      const dir = join(ROOT, "public", "images", "shots", target.id);
      rmSync(dir, { recursive: true, force: true });
      mkdirSync(dir, { recursive: true });

      const origin = target.url.replace(/\/$/, "");
      let index = 0;

      for (const path of ["/", ...(target.also ?? [])]) {
        const tab = await openTab();
        try {
          await visit(tab.session, origin + path, target.viewport);
          const size = await capture(
            tab.session,
            join(dir, `${++index}.png`),
            target.viewport
          );
          console.log(`  ${target.id}${path} → ${index}.png (${Math.round(size / 1024)} KB)`);

          // Interaction steps only make sense on the entry page.
          if (path !== "/") continue;
          for (const step of target.steps ?? []) {
            const { result } = await tab.session.send("Runtime.evaluate", {
              expression: step.run,
              returnByValue: true,
            });
            if (!result?.value) {
              console.warn(`  ${target.id}: step "${step.label}" found nothing to click`);
              continue;
            }
            await sleep(step.settle ?? 3000);
            const stepSize = await capture(
              tab.session,
              join(dir, `${++index}.png`),
              target.viewport
            );
            console.log(
              `  ${target.id} ${step.label} → ${index}.png (${Math.round(stepSize / 1024)} KB)`
            );
          }
        } catch (error) {
          console.warn(`  ${target.id}${path} failed: ${error.message}`);
        } finally {
          await closeTab(tab);
        }
      }
    }
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
      marginTop: 0.43,
      marginBottom: 0.43,
      marginLeft: 0.47,
      marginRight: 0.47,
      printBackground: true,
    });
    writeFileSync(out, Buffer.from(data, "base64"));
    await closeTab(tab);
  } finally {
    browser.kill();
  }
  console.log(`\n✓ ${out} (${Math.round(statSync(out).size / 1024)} KB) from ${url}`);
}

const [task, only] = process.argv.slice(2);
if (task === "resume") await buildResumePdf();
else if (task === "shots") await captureShots(only);
else {
  console.error("usage: node scripts/shoot.mjs <resume|shots> [target-id]");
  process.exit(1);
}
