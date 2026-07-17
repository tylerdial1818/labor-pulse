import { BriefingBuilder } from "@/components/briefings/briefing-builder";
import { TopBar } from "@/components/layout/top-bar";
import { getCompositeSummaries, getDashboardData } from "@/lib/db/queries";
import { getInsightFeed } from "@/lib/insights/queries";
import { readMajorList } from "@/lib/underemployment/queries";

export default async function NewBriefingPage() {
  const [dashboard, composites, insights, underemploymentMajors] = await Promise.all([
    getDashboardData(),
    getCompositeSummaries(),
    getInsightFeed({ limit: 20 }),
    readMajorList()
  ]);
  const indicators = dashboard.categories.flatMap((category) => category.indicators);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Briefing builder</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">New Briefing</h1>
        <p className="mb-8 mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
          Select source-backed indicators, composite signals, and research context. The finished briefing keeps each numeric claim traceable to the selected data.
        </p>
        <BriefingBuilder indicators={indicators} composites={composites} insights={insights.insights} underemploymentMajors={underemploymentMajors} />
      </main>
    </div>
  );
}
