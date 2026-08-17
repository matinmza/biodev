"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

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
      openProject(result.id);
    }
  }, [input, openProject]);

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

  return (
    <WidgetShell variant="terminal">
      <div dir="ltr" className="flex h-full flex-col font-mono text-[13px]">
        {/* Terminal chrome */}
        <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" aria-hidden />
          <span className="mx-auto pe-14 text-xs text-zinc-500">
            matin@os — zsh
          </span>
        </div>

        {/* Scrollback + prompt. Clicking anywhere focuses the input. */}
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
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
              className="min-w-0 flex-1 bg-transparent text-zinc-100 caret-accent-cyan outline-none placeholder:text-zinc-600"
              placeholder="help"
            />
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
