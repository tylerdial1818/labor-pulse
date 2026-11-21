"use client";

import Link from "next/link";
import type { Route } from "next";
import { useId, useState, type FocusEvent, type ReactNode } from "react";

import { getGlossaryTerm, glossaryHref } from "@/lib/glossary/terms";

/**
 * Inline glossary term: a dotted-underlined word that shows its plain-language
 * definition on hover, keyboard focus, or tap. Definitions come from the shared
 * glossary so the wording matches /glossary everywhere.
 *
 * Usage: <Term id="u-6">U-6</Term>, or <Term id="u-6" /> to print the term name.
 */
export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const entry = getGlossaryTerm(id);
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  if (!entry) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[glossary] Unknown term id "${id}"`);
    }
    return <>{children}</>;
  }

  function handleBlur(event: FocusEvent<HTMLSpanElement>) {
    // Keep the tooltip open while focus moves to its own "Full definition" link.
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  }

  return (
    <span
      className="relative inline"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen((current) => !current)}
        className="cursor-help border-b border-dotted border-current p-0 text-inherit [font:inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
      >
        {children ?? entry.term}
      </button>
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          // Top padding (not margin) keeps the pointer inside the hover area on the way to the link.
          className="absolute left-0 top-full z-30 block w-72 max-w-[calc(100vw-2rem)] pt-2 text-left font-sans text-[13px] font-normal not-italic normal-case leading-[1.45] tracking-normal text-ink"
        >
          <span className="block border border-rule bg-paper p-3 shadow-[0_6px_18px_rgba(28,24,21,0.12)]">
            <span className="block font-semibold">{entry.term}</span>
            <span className="mt-1 block">{entry.plain}</span>
            <Link href={glossaryHref(entry.id) as Route} className="mt-2 inline-block font-semibold text-navy underline underline-offset-2">
              Full definition
            </Link>
          </span>
        </span>
      ) : null}
    </span>
  );
}
