import { TopBar } from "@/components/layout/top-bar";
import { HomeQuestions } from "@/components/dashboard/home-questions";
import { DashboardContent } from "@/features/dashboard/dashboard-content";
import { FeaturedAnalysis } from "@/features/dashboard/featured-analysis";
import { HomeMasthead } from "@/features/dashboard/home-masthead";
import { buildMeasureBars, formatMonthYear } from "@/lib/home/measure-comparison";
import { getCurrentHeadlineRates } from "@/lib/underemployment/calculate";
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
  const [data, headline] = await Promise.all([getDashboardData(), getCurrentHeadlineRates()]);
  const indicators = data.categories.flatMap((category) => category.indicators);
  const indicatorCount = indicators.length;
  const unemployment = indicators.find((indicator) => indicator.id === "UNRATE");
  const u6 = indicators.find((indicator) => indicator.id === "U6RATE");
  const tightness = data.composites?.find((composite) => composite.id === "labor_tightness");
  const rightNow = answerJobMarketNow(unemployment, tightness);
  const measureBars = buildMeasureBars([
    {
      id: "recent-grads",
      label: "Recent graduates, underemployed",
      value: headline.recentGrads,
      asOf: formatMonthYear(headline.asOfDate),
      sourceLabel: "Federal Reserve Bank of New York",
      emphasized: true
    },
    {
      id: "U6RATE",
      label: "U-6 underemployment",
      value: u6?.currentValue ?? null,
      asOf: u6?.currentDate ?? null,
      sourceLabel: u6?.sourceLabel ?? "BLS via FRED"
    },
    {
      id: "UNRATE",
      label: "Unemployment rate",
      value: unemployment?.currentValue ?? null,
      asOf: unemployment?.currentDate ?? null,
      sourceLabel: unemployment?.sourceLabel ?? "BLS via FRED"
    }
  ]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <HomeMasthead indicatorCount={indicatorCount} refreshedLabel={data.refreshedAt ? formatPublicDate(data.refreshedAt) : null} />
      <TopBar variant="home" />
      <main className="mx-auto max-w-[1180px] px-4 pb-12 sm:px-6 lg:px-8">
        <HomeQuestions rightNow={rightNow} />
        <FeaturedAnalysis bars={measureBars} />
        <DashboardContent data={data} />
      </main>
    </div>
  );
}
