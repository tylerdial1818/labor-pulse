"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";

import { getGlossaryTerm, groupTermsByTopic, searchGlossary, type GlossaryTerm } from "@/lib/glossary/terms";

function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}

export function GlossaryBrowser() {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => groupTermsByTopic(searchGlossary(query)), [query]);
  const matchCount = groups.reduce((count, group) => count + group.terms.length, 0);

  return (
    <div>
      <label className="block max-w-md">
        <span className="mb-2 block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-sub">Search terms</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. unemployment, wages, AI"
          className="w-full rounded border border-rule bg-paper px-3 py-2.5 font-sans text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
        />
      </label>
      <p className="mt-2 font-sans text-xs text-sub" aria-live="polite">
        {query.trim() ? `${matchCount} matching ${matchCount === 1 ? "term" : "terms"}` : null}
      </p>

      {groups.length > 0 ? (
        <nav aria-label="Glossary topics" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-sans text-[13px] font-medium">
          {groups.map((group) => (
            <a key={group.id} href={`#topic-${group.id}`} className="text-navy hover:underline">
              {group.label}
            </a>
          ))}
        </nav>
      ) : (
        <p className="mt-6 font-serif text-base italic text-sub">No terms match that search.</p>
      )}

      {groups.map((group) => (
        <section key={group.id} id={`topic-${group.id}`} aria-labelledby={`topic-${group.id}-heading`} className="mt-10 scroll-mt-6">
          <h2 id={`topic-${group.id}-heading`} className="border-b border-ink pb-2 font-serif text-2xl font-semibold">
            {group.label}
          </h2>
          <dl>
            {group.terms.map((entry) => (
              <GlossaryEntry key={entry.id} entry={entry} />
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function GlossaryEntry({ entry }: { entry: GlossaryTerm }) {
  const related = (entry.related ?? []).map((id) => getGlossaryTerm(id)).filter((item): item is GlossaryTerm => Boolean(item));

  return (
    <div id={entry.id} className="scroll-mt-6 border-b border-rule py-5 target:bg-[var(--lp-navy-tint)]">
      <dt className="font-serif text-[19px] font-semibold text-ink">{entry.term}</dt>
      <dd className="mt-1 max-w-3xl font-serif text-[16px] leading-[1.55] text-ink">{entry.plain}</dd>
      {entry.technical ? (
        <dd className="mt-2 max-w-3xl border-l-2 border-navy pl-3 font-sans text-[13px] leading-[1.5] text-sub">
          <span className="font-semibold text-ink">For researchers: </span>
          {entry.technical}
        </dd>
      ) : null}
      <dd className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-sans text-[12px] text-sub">
        <span>
          Source:{" "}
          {isExternal(entry.sourceUrl) ? (
            <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy hover:underline">
              {entry.sourceLabel}
            </a>
          ) : (
            <Link href={entry.sourceUrl as Route} className="font-semibold text-navy hover:underline">
              {entry.sourceLabel}
            </Link>
          )}
        </span>
        {entry.indicatorId ? (
          <Link href={`/indicators/${entry.indicatorId}` as Route} className="font-semibold text-navy hover:underline">
            See the latest data
          </Link>
        ) : null}
        {related.length > 0 ? (
          <span>
            Related:{" "}
            {related.map((item, index) => (
              <span key={item.id}>
                {index > 0 ? ", " : null}
                <a href={`#${item.id}`} className="text-navy hover:underline">
                  {item.term}
                </a>
              </span>
            ))}
          </span>
        ) : null}
      </dd>
    </div>
  );
}
