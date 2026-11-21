import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

import type { ShortAnswer } from "@/lib/questions/answers";

export type DeeperLink = { href: string; label: string };

export type QuestionCardProps = {
  id: string;
  question: string;
  /** Rule-generated answer from live data; null shows an "unavailable" note. Omit for navigational questions. */
  answer?: ShortAnswer | null;
  /** Fixed lead text for questions answered by a page rather than a single number. */
  lead?: ReactNode;
  chart?: ReactNode;
  whyItMatters: ReactNode;
  howToRead?: ReactNode;
  deeper: DeeperLink[];
  methods?: ReactNode;
};

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

/**
 * One question, answered in layers: the short answer and chart for everyone,
 * then why it matters, how to read it, deeper links, and collapsed methods for
 * readers who want the technical detail.
 */
export function QuestionCard({ id, question, answer, lead, chart, whyItMatters, howToRead, deeper, methods }: QuestionCardProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-6 border-t border-rule py-9">
      <h2 id={`${id}-heading`} className="max-w-3xl font-serif text-[30px] font-semibold leading-tight tracking-[-0.01em] text-ink">
        {question}
      </h2>

      {answer !== undefined ? (
        <div className="mt-4 max-w-3xl border-l-[3px] border-navy pl-4">
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Short answer</p>
          {answer ? (
            <>
              <p className="mt-1 font-serif text-[20px] leading-[1.45] text-ink">{answer.text}</p>
              {answer.asOf ? <p className="mt-1 font-sans text-[11.5px] text-sub">Latest data: {answer.asOf}</p> : null}
            </>
          ) : (
            <p className="mt-1 font-serif text-[18px] italic leading-[1.45] text-sub">The latest data for this question is not available right now.</p>
          )}
        </div>
      ) : null}
      {lead ? <div className="mt-4 max-w-3xl font-serif text-[20px] leading-[1.45] text-ink">{lead}</div> : null}

      {chart ? <div className="mt-6">{chart}</div> : null}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Why it matters</h3>
          <div className="mt-2 font-serif text-[16px] leading-[1.55] text-ink">{whyItMatters}</div>
        </div>
        {howToRead ? (
          <div>
            <h3 className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">How to read it</h3>
            <div className="mt-2 font-serif text-[16px] leading-[1.55] text-ink">{howToRead}</div>
          </div>
        ) : null}
      </div>

      {deeper.length > 0 ? (
        <nav aria-label={`Go deeper: ${question}`} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[13px]">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-sub">Go deeper</span>
          {deeper.map((link) =>
            isExternal(link.href) ? (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy hover:underline">
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href as Route} className="font-semibold text-navy hover:underline">
                {link.label}
              </Link>
            )
          )}
        </nav>
      ) : null}

      {methods ? (
        <details className="mt-5 max-w-3xl border border-rule px-4 py-3 font-sans text-[13px] leading-[1.5] text-sub">
          <summary className="cursor-pointer font-semibold text-ink">Methods and caveats</summary>
          <div className="mt-2 space-y-2">{methods}</div>
        </details>
      ) : null}
    </section>
  );
}

export function TopicHeader({ eyebrow, title, lede, questions }: { eyebrow: string; title: string; lede: string; questions: Array<{ id: string; question: string }> }) {
  return (
    <header className="pb-6">
      <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">{title}</h1>
      <p className="mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">{lede}</p>
      <nav aria-label="Questions on this page" className="mt-6">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-sub">Questions on this page</p>
        <ol className="mt-2 grid gap-x-8 gap-y-1.5 font-sans text-[14px] md:grid-cols-2">
          {questions.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-navy hover:underline">
                {item.question}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
