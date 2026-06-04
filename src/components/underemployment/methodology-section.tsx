import type { ReactNode } from "react";
import { methodologyInterpretation, methodologyIntro, methodologySubsections } from "@/lib/underemployment/methodology-content";

function AnalyticalInterpretationCallout({ children }: { children: ReactNode }) {
  return (
    <aside className="border border-rule bg-[var(--lp-navy-tint)] px-4 py-4" aria-label="Analytical interpretation">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-navy">Analytical interpretation</p>
      <div className="mt-2 font-serif text-[15.5px] leading-[1.55] text-ink">{children}</div>
    </aside>
  );
}

export function MethodologySection() {
  return (
    <section id="methodology" className="border-t border-rule py-10" aria-labelledby="methodology-heading">
      <div className="max-w-4xl">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-sub">Methodology and transparency</p>
        <h2 id="methodology-heading" className="mt-2 font-serif text-[32px] font-semibold leading-tight text-ink">
          How the measure works
        </h2>
        <p className="mt-3 font-serif text-[17px] leading-[1.55] text-ink">{methodologyIntro}</p>
      </div>

      <div className="mt-8 grid gap-7">
        {methodologySubsections.map((subsection, index) => (
          <article key={subsection.id} id={subsection.id} className="border-t border-hair pt-6">
            <div className="grid gap-4 md:grid-cols-[72px_1fr]">
              <div className="font-serif text-[28px] font-semibold leading-none text-faint">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3 className="font-serif text-[24px] font-semibold leading-tight text-ink">{subsection.title}</h3>
                <p className="mt-2 font-serif text-[16px] italic leading-[1.45] text-sub">{subsection.summary}</p>
                <div className="mt-4 grid gap-3">
                  {subsection.body.map((paragraph) => (
                    <p key={paragraph} className="font-serif text-[15.5px] leading-[1.6] text-ink">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2" aria-label={`References for ${subsection.title}`}>
                  {subsection.references.map((reference) => (
                    <a
                      key={reference.href}
                      href={reference.href}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-rule px-2.5 py-1.5 font-sans text-[11px] font-semibold text-navy hover:bg-[var(--lp-navy-tint)]"
                    >
                      {reference.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <AnalyticalInterpretationCallout>{methodologyInterpretation}</AnalyticalInterpretationCallout>
      </div>
    </section>
  );
}
