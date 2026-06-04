import { TopBar } from "@/components/layout/top-bar";
import { FeaturedAnalysisCard } from "@/components/dashboard/featured-analysis-card";
import { DashboardContent } from "@/features/dashboard/dashboard-content";
import { getCurrentHeadlineRates } from "@/lib/underemployment/calculate";
import { getDashboardData } from "@/server/dashboard-data";

export async function DashboardShell() {
  const [data, underemploymentHeadline] = await Promise.all([getDashboardData(), getCurrentHeadlineRates()]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 pb-12 sm:px-6 lg:px-8">
        <FeaturedAnalysisCard recentRate={underemploymentHeadline.recentGrads} asOfDate={underemploymentHeadline.asOfDate} />
        <DashboardContent data={data} />
      </main>
    </div>
  );
}
