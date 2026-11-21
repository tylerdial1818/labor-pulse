import { SHORT_ANSWER } from "@/lib/ai-impact/content";

import { formatSourceDate } from "./format";

export function ShortAnswer() {
  return (
    <section aria-labelledby="short-answer-heading" className="border-l-4 border-navy bg-[var(--lp-navy-tint)] px-5 py-5">
      <h2 id="short-answer-heading" className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">
        The short answer
      </h2>
      <p className="mt-2 max-w-3xl font-serif text-[20px] leading-[1.45] text-ink">{SHORT_ANSWER.sentences.join(" ")}</p>
      <p className="mt-3 font-sans text-[11px] text-sub">Reviewed {formatSourceDate(SHORT_ANSWER.reviewed)} against the studies and data below.</p>
    </section>
  );
}
