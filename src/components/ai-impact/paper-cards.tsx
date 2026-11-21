import { AI_CHAIN } from "@/lib/ai-impact/content";
import type { LandmarkPaper } from "@/lib/ai-impact/papers";

export function PaperCards({ papers }: { papers: LandmarkPaper[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {papers.map((paper) => {
        const step = AI_CHAIN.find((item) => item.id === paper.chainStep);
        return (
          <article key={paper.id} id={`paper-${paper.id}`} className="scroll-mt-24 border border-rule p-5">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-navy">
              {step ? `Step: ${step.label}` : null}
            </p>
            <h3 className="mt-2 font-serif text-[22px] font-semibold leading-tight text-ink">{paper.claim}</h3>
            <p className="mt-1 font-sans text-xs text-sub">
              <a href={paper.url} className="font-semibold text-navy hover:underline">
                {paper.title}
              </a>{" "}
              · {paper.authors} · {paper.venue}
            </p>
            <p className="mt-3 font-serif text-[15px] leading-[1.55] text-ink">{paper.explainer}</p>
            <details className="mt-3 border-t border-hair pt-3">
              <summary className="cursor-pointer font-sans text-xs font-bold uppercase tracking-[0.1em] text-sub">Assumptions and what would challenge it</summary>
              <ul className="mt-2 list-disc pl-5 font-sans text-sm leading-[1.5] text-ink">
                {paper.assumptions.map((assumption) => (
                  <li key={assumption}>{assumption}</li>
                ))}
              </ul>
              <p className="mt-2 font-sans text-sm leading-[1.5] text-ink">
                <span className="font-semibold">Would challenge it: </span>
                {paper.wouldChallengeIt}
              </p>
            </details>
          </article>
        );
      })}
    </div>
  );
}
