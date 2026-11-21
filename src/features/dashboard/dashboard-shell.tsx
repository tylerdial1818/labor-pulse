import { TopBar } from "@/components/layout/top-bar";
import { HomeQuestions } from "@/components/dashboard/home-questions";
import { DashboardContent } from "@/features/dashboard/dashboard-content";
import { answerJobMarketNow } from "@/lib/questions/answers";
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
  const data = await getDashboardData();
  const indicatorCount = data.categories.reduce((count, category) => count + category.indicators.length, 0);
  const unemployment = data.categories.flatMap((category) => category.indicators).find((indicator) => indicator.id === "UNRATE");
  const tightness = data.composites?.find((composite) => composite.id === "labor_tightness");
  const rightNow = answerJobMarketNow(unemployment, tightness);

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
            Clear answers to questions about jobs, wages, education, and AI, built from official data. Labor Pulse is a continuously maintained public research service: every number links to its source, and the full indicator dashboard and methods are here for researchers.
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
        <HomeQuestions rightNow={rightNow} />
        <DashboardContent data={data} />
      </main>
    </div>
  );
}
