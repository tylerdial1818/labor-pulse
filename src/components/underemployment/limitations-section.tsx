import type { ReactNode } from "react";
import { limitationInterpretation, limitationPoints, limitationsIntro } from "@/lib/underemployment/methodology-content";

function AnalyticalInterpretationCallout({ children }: { children: ReactNode }) {
  return (
    <aside className="border border-rule bg-[var(--lp-navy-tint)] px-4 py-4" aria-label="Analytical interpretation">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-navy">Analytical interpretation</p>
      <div className="mt-2 font-serif text-[15.5px] leading-[1.55] text-ink">{children}</div>
    </aside>
  );
}

export function LimitationsSection() {
  return (
    <section id="limitations" className="border-t border-rule py-10" aria-labelledby="limitations-heading">
      <div className="max-w-4xl">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-sub">What this misses</p>
        <h2 id="limitations-heading" className="mt-2 font-serif text-[32px] font-semibold leading-tight text-ink">
          Limits of the framework
        </h2>
        <p className="mt-3 font-serif text-[17px] leading-[1.55] text-ink">{limitationsIntro}</p>
      </div>

      <div className="mt-8 grid gap-4">
        {limitationPoints.map((point, index) => (
          <article key={point.id} id={point.id} className="grid gap-4 border-t border-hair pt-5 md:grid-cols-[72px_1fr]">
            <div className="font-serif text-[28px] font-semibold leading-none text-faint">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <h3 className="font-serif text-[22px] font-semibold leading-tight text-ink">{point.title}</h3>
              <p className="mt-2 font-serif text-[15.5px] leading-[1.6] text-ink">{point.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <AnalyticalInterpretationCallout>{limitationInterpretation}</AnalyticalInterpretationCallout>
      </div>
    </section>
  );
}
