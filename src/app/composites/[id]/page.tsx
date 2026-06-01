import { notFound } from "next/navigation";

import { TimeSeriesChart } from "@/components/charts/labor-pulse-charts";
import { TopBar } from "@/components/layout/top-bar";
import { getCompositeDetail } from "@/lib/db/queries";

const interpretationGuidance: Record<string, string> = {
  sahm_rule:
    "Read this as an early warning light for recession risk. A small positive value means unemployment has moved up from its recent low. Values near the signal range deserve attention because they suggest the labor market may be weakening in a broad way. One month alone should not drive the conclusion. Look for whether the line keeps rising and whether other stress measures are moving in the same direction.",
  labor_tightness:
    "Read this as a summary of how much leverage workers have relative to employers. Higher values point to a tighter market with more openings, more quitting, or stronger wage pressure. Lower values point to a cooler market where employers have less pressure to compete for workers. The most useful signal is the direction over several months, not one exact point estimate.",
  labor_stress:
    "Read this as a pressure gauge for labor-market strain. Higher values mean claims, layoffs, or reduced hours are pointing toward more stress. Lower values mean the labor market looks steadier. A move up is most concerning when it lasts for several weeks or months and appears alongside weaker hiring or rising unemployment."
};

export default async function CompositeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getCompositeDetail(id);

  if (!detail) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Composite detail</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">{detail.definition.name}</h1>
        <p className="mb-8 mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">{detail.definition.description}</p>

        {detail.current ? (
          <section className="mb-8 grid gap-4 border-y border-rule py-5 md:grid-cols-[240px_1fr]">
            <div>
              <p className="font-serif text-[42px] font-semibold leading-none text-ink">{detail.current.value.toFixed(2)}</p>
              <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.12em] text-sub">As of {detail.current.date}</p>
            </div>
            <div>
              <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">{detail.current.interpretation.label}</p>
              <p className="mt-2 max-w-3xl font-serif text-[15px] leading-[1.5] text-ink">{detail.definition.methodologyNote}</p>
              <p className="mt-3 max-w-3xl font-sans text-sm leading-[1.45] text-sub">
                Source: calculated by Labor Pulse from official input series shown below. The composite is an index-style summary, not a direct
                government-published statistic.
              </p>
            </div>
          </section>
        ) : null}

        <section className="mb-8 border border-rule bg-[var(--lp-navy-tint)] px-5 py-4" aria-labelledby="how-to-read-composite">
          <p id="how-to-read-composite" className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">
            How to read this metric
          </p>
          <p className="mt-2 max-w-4xl font-serif text-[16px] leading-[1.55] text-ink">
            {interpretationGuidance[detail.definition.id] ?? "Read this composite as a directional summary. Focus on the trend, the current label, and the source indicators behind it. One point is less important than a sustained move."}
          </p>
        </section>

        <section className="border-y border-rule py-5">
          <div className="mb-4">
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Composite history</p>
            <p className="mt-1 font-sans text-xs text-sub">
              Source: calculated by Labor Pulse from {detail.definition.inputSeries.join(", ")}
            </p>
          </div>
          <TimeSeriesChart data={detail.observations} label={`${detail.definition.name} history`} units="index value" />
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl font-semibold">Input series</h2>
          <p className="mt-2 max-w-3xl font-sans text-sm leading-[1.45] text-sub">
            These are the source indicators used to calculate the composite. Open each one to see its original publisher, latest observation,
            and plain-English explanation.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {detail.definition.inputSeries.map((seriesId) => (
              <a key={seriesId} href={`/indicators/${seriesId}`} className="border border-rule px-3 py-2 font-sans text-xs font-semibold text-navy hover:bg-[var(--lp-navy-tint)]">
                {seriesId}
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
