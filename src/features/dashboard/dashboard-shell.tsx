import { TopBar } from "@/components/layout/top-bar";
import { FeaturedAnalysisCard } from "@/components/dashboard/featured-analysis-card";
import { DashboardContent } from "@/features/dashboard/dashboard-content";
import { getCurrentHeadlineRates } from "@/lib/underemployment/calculate";
import { getDashboardData } from "@/server/dashboard-data";

function formatPublicDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(value));
}

export async function DashboardShell() {
  const [data, underemploymentHeadline] = await Promise.all([getDashboardData(), getCurrentHeadlineRates()]);
  const indicatorCount = data.categories.reduce((count, category) => count + category.indicators.length, 0);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 pb-12 pt-[26px] sm:px-6 lg:px-8">
        <section className="border-b border-rule pb-6" aria-labelledby="service-introduction">
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Public labor market research</p>
          <h1 id="service-introduction" className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">
            U.S. Labor Market Monitor
          </h1>
          <p className="mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
            Labor Pulse is a continuously maintained public research service for understanding change in the U.S. labor market. It brings official indicators, transparent composite measures, and careful analysis into one citable workspace for policy researchers and workforce leaders.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-sub">
            <span>{indicatorCount} core indicators</span>
            <span aria-hidden="true">·</span>
            <span>U.S. national coverage</span>
            <span aria-hidden="true">·</span>
            {data.refreshedAt ? (
              <span>Latest refresh {formatPublicDate(data.refreshedAt)}</span>
            ) : (
              <a className="text-navy hover:underline" href="/sources">
                Refresh status in Data & Methods
              </a>
            )}
          </div>
        </section>
        <FeaturedAnalysisCard recentRate={underemploymentHeadline.recentGrads} asOfDate={underemploymentHeadline.asOfDate} />
        <DashboardContent data={data} />
      </main>
    </div>
  );
}
