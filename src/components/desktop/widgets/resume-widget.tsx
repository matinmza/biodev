"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Eye, FileText } from "lucide-react";
import Modal from "@/components/shared/modal";
import ResumeDocument from "@/components/resume/resume-document";
import { useI18n } from "@/i18n/i18n-provider";
import { RESUME_PDF } from "@/lib/seo";
import WidgetShell from "../widget-shell";

/** Résumé widget: preview the document in-OS, or take the PDF away. */
export default function ResumeWidget() {
  const { dict } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const text = dict.resume;

  return (
    <>
      <WidgetShell
        title={text.widgetTitle}
        contentClassName="flex flex-col gap-3 px-5 pb-5 pt-2"
      >
        <div className="flex items-start gap-3">
          <span className="soft-btn flex h-11 w-11 shrink-0 items-center justify-center rounded-[24%] bg-gradient-to-b from-[#64748B] to-[#1E293B]">
            <FileText size={20} className="text-white" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-snug text-zinc-900 dark:text-white">
              {text.headline}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
              {text.updated}
            </p>
          </div>
        </div>

        {/* Fills the card without a dead gap, and says what the PDF holds. */}
        <p className="text-xs leading-5 text-zinc-700 dark:text-zinc-300">
          {text.contains}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
          >
            <Eye size={14} />
            {text.preview}
          </button>

          <a
            href={RESUME_PDF}
            download
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-black/5 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            <Download size={14} />
            {text.download}
          </a>
        </div>
      </WidgetShell>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        widthClassName="max-w-3xl"
      >
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl dark:border-white/10">
          {/* Window chrome, mirroring the project windows. */}
          <div
            dir="ltr"
            className="flex items-center gap-2 border-b border-black/10 bg-zinc-100 px-4 py-3"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={dict.a11y.close}
              className="h-3 w-3 rounded-full bg-[#FF5F57] transition-transform hover:scale-110"
            />
            <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" aria-hidden />
            <span className="h-3 w-3 rounded-full bg-[#28C840]" aria-hidden />
            <span className="mx-auto font-mono text-xs text-zinc-500">resume.pdf</span>
            <a
              href={RESUME_PDF}
              download
              className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              <Download size={12} />
              {text.download}
            </a>
          </div>

          <div className="scrollbar-ios max-h-[72vh] overflow-y-auto bg-zinc-200 p-3 sm:p-5">
            <ResumeDocument className="mx-auto max-w-[760px] rounded-lg shadow-md" />
          </div>

          <div className="border-t border-black/10 px-4 py-2.5 text-center">
            <Link
              href="/en/resume"
              className="text-xs font-medium text-zinc-600 underline hover:text-zinc-900"
            >
              {text.openPage}
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
