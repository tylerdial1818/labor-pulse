import { TopBar } from "@/components/layout/top-bar";
import { getAiExposureScores, getDashboardData } from "@/lib/db/queries";
import { getInsightFeed } from "@/lib/insights/queries";
import { normalizePublicCopy } from "@/lib/utils/public-copy";

export default async function AiImpactPage() {
  const [dashboard, exposureScores, insights] = await Promise.all([
    getDashboardData(),
    getAiExposureScores(),
    getInsightFeed({ tags: ["ai"], limit: 5 })
  ]);
  const techIndicators = dashboard.categories.find((category) => category.id === "tech_impact")?.indicators ?? [];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Focused view</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">AI Impact Tracker</h1>
        <p className="mb-8 mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
          AI labor signals are directional context, not direct displacement measurement. This page keeps official employment proxies, Claude usage signals, and occupation exposure scores visibly separate.
        </p>

        <section className="grid border-l border-t border-rule md:grid-cols-3" aria-label="Tech and AI indicators">
          {techIndicators.map((indicator) => (
            <article key={indicator.id} className="border-b border-r border-rule px-5 py-5">
              <h2 className="font-serif text-lg font-semibold leading-tight">{indicator.title}</h2>
              <p className="mt-4 font-serif text-4xl font-semibold leading-none">
                {indicator.currentValueFormatted} <span className="text-lg text-sub">{indicator.unitLabel}</span>
              </p>
              <p className="mt-2 font-sans text-xs leading-[1.35] text-sub">{indicator.plainLanguage}</p>
              <p className="mt-2 font-sans text-xs text-sub">{indicator.delta.formatted} {indicator.delta.periodLabel}</p>
              <p className="mt-3 border-t border-hair pt-3 font-sans text-[10px] uppercase tracking-[0.08em] text-sub">
                Source: <span className="font-bold normal-case tracking-normal text-navy">{indicator.sourceLabel}</span> · As of {indicator.currentDate ?? "not available"}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 border-y border-rule py-5">
          <h2 className="font-serif text-2xl font-semibold">AI Exposure by Occupation</h2>
          <p className="mt-2 max-w-4xl font-sans text-sm leading-[1.5] text-sub">
            Source: Eloundou, Manning, Mishkin, and Rock, “GPTs are GPTs,” using the original OpenAI occupation-level data. Scores show
            potential task exposure to LLMs, not observed adoption, layoffs, automation, or job loss.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-rule text-left text-[10px] uppercase tracking-[0.14em] text-sub">
                  <th className="py-2 pr-4">Occupation</th>
                  <th className="py-2 pr-4">SOC</th>
                  <th className="py-2 pr-4">Exposure score</th>
                  <th className="py-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {exposureScores.map((score) => (
                  <tr key={score.occupationSocCode} className="border-b border-hair">
                    <td className="py-3 pr-4 font-semibold">{score.occupationTitle}</td>
                    <td className="py-3 pr-4 text-sub">{score.occupationSocCode}</td>
                    <td className="py-3 pr-4">{score.exposureScore.toFixed(2)}</td>
                    <td className="py-3 capitalize">{score.exposureCategory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl font-semibold">AI-Tagged Insights</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {insights.insights.map((insight) => (
              <article key={insight.id} className="border border-rule px-4 py-4">
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-sub">{insight.sourceName}</p>
                <h3 className="mt-2 font-serif text-lg font-semibold leading-tight">{insight.title}</h3>
                <p className="mt-2 font-serif text-sm leading-[1.5] text-ink">{normalizePublicCopy(insight.summary)}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
