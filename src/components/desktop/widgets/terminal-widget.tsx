"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { X } from "lucide-react";
import { useI18n } from "@/i18n/i18n-provider";
import {
  runCommand,
  TERMINAL_BANNER,
  TERMINAL_PROMPT,
} from "@/lib/terminal";
import { useWindows } from "../window-context";
import WidgetShell from "../widget-shell";

interface TerminalLine {
  kind: "input" | "output" | "comment";
  text: string;
}

const MAX_LINES = 300;

/** Below Tailwind's `sm`, the widget is too small to type in comfortably. */
const COMPACT_QUERY = "(max-width: 639px)";

/**
 * The signature widget: a working shell. Visitors can type `help`,
 * list projects, and even open project windows from the command line.
 */
export default function TerminalWidget() {
  const { dict } = useI18n();
  const { openProject } = useWindows();

  const [lines, setLines] = useState<TerminalLine[]>(() => [
    ...TERMINAL_BANNER.map((text): TerminalLine => ({ kind: "output", text })),
    { kind: "comment", text: `# ${dict.terminal.hint}` },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // On phones the terminal opens full screen instead of typing inside a small
  // widget. History lives here, so it survives opening and closing.
  const [fullscreen, setFullscreen] = useState(false);
  const [viewport, setViewport] = useState<{ top: number; height: number }>();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, fullscreen]);

  /**
   * Focus the prompt, going full screen first on a phone. `flushSync` mounts
   * the full-screen input inside the tap itself — iOS only raises the keyboard
   * for a focus() made during a user gesture.
   */
  const focusPrompt = () => {
    if (!fullscreen && window.matchMedia(COMPACT_QUERY).matches) {
      flushSync(() => setFullscreen(true));
    }
    inputRef.current?.focus();
  };

  const closeFullscreen = useCallback(() => {
    setFullscreen(false);
    setViewport(undefined);
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen();
    };
    window.addEventListener("keydown", onKeyDown);

    // iOS keeps the layout viewport full height under the keyboard; pin the
    // terminal to the visible part so the prompt is never hidden behind it.
    const vv = window.visualViewport;
    const sync = () =>
      vv && setViewport({ top: vv.offsetTop, height: vv.height });
    sync();
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
    };
  }, [fullscreen, closeFullscreen]);

  const submit = useCallback(() => {
    const command = input;
    setInput("");
    setHistoryIndex(-1);
    if (command.trim()) {
      setHistory((h) => [...h, command]);
    }

    const echoed: TerminalLine = { kind: "input", text: command };
    const result = runCommand(command);

    if (result.type === "clear") {
      setLines([]);
      return;
    }

    const output: TerminalLine[] = result.lines.map((text) => ({
      kind: "output",
      text,
    }));
    setLines((prev) => [...prev, echoed, ...output].slice(-MAX_LINES));

    if (result.type === "open-url") {
      window.open(result.url, "_blank", "noopener,noreferrer");
    } else if (result.type === "open-project") {
      closeFullscreen();
      openProject(result.id);
    }
  }, [input, openProject, closeFullscreen]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next =
        historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    }
  };

  const terminal = (
    <div dir="ltr" className="flex h-full flex-col font-mono text-[13px]">
      {/* Terminal chrome */}
      <div className="relative flex shrink-0 items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" aria-hidden />
        <span className="mx-auto pe-14 text-xs text-zinc-500">
          matin@os — zsh
        </span>
        {fullscreen && (
          <button
            type="button"
            onClick={closeFullscreen}
            aria-label={dict.a11y.close}
            className="absolute end-2 top-1 grid h-9 w-9 place-items-center rounded-full text-zinc-400 active:bg-white/10"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Scrollback + prompt. Clicking anywhere focuses the input. */}
      <div
        ref={scrollRef}
        onClick={focusPrompt}
        className="scrollbar-ios flex-1 cursor-text overflow-y-auto p-4 leading-6"
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {line.kind === "input" ? (
              <>
                <span className="text-emerald-400">{TERMINAL_PROMPT}</span>{" "}
                <span className="text-zinc-100">{line.text}</span>
              </>
            ) : line.kind === "comment" ? (
              <span className="text-zinc-500">{line.text}</span>
            ) : (
              <span className="text-zinc-300">{line.text}</span>
            )}
          </div>
        ))}

        <div className="flex items-center gap-2">
          <span className="shrink-0 text-emerald-400">{TERMINAL_PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label={dict.terminal.widgetTitle}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            // The blinking caret already shows focus; the global focus ring
            // (unlayered, so a utility can't override it) boxed the prompt.
            style={{ outline: "none" }}
            // 16px on phones: iOS zooms into any input smaller than that.
            className="min-w-0 flex-1 bg-transparent text-base text-zinc-100 caret-accent-cyan outline-none placeholder:text-zinc-600 sm:text-[13px]"
            placeholder="help"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <WidgetShell variant="terminal">{!fullscreen && terminal}</WidgetShell>
      {/* Portalled: the grid positions widgets with transforms, which would
          trap a `position: fixed` child inside the widget. */}
      {fullscreen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={dict.terminal.widgetTitle}
            style={viewport}
            className="fixed inset-x-0 top-0 z-[90] h-dvh bg-[#0d1117] pt-[env(safe-area-inset-top)]"
          >
            {terminal}
          </div>,
          document.body
        )}
    </>
  );
}
