import { NextResponse } from "next/server";

import { getCompositeSummaries, getDashboardData } from "@/lib/db/queries";
import { assessFreshness, type FreshnessFrequency, type FreshnessInput } from "@/lib/freshness/assess";
import { getInsightFeed } from "@/lib/insights/queries";
import { readHeadlineTrend } from "@/lib/underemployment/queries";

export const dynamic = "force-dynamic";

// Composites inherit the slowest input's release schedule.
const COMPOSITE_FREQUENCY: Record<string, FreshnessFrequency> = {
  sahm_rule: "monthly",
  labor_tightness: "monthly",
  labor_stress: "monthly"
};

function latest(dates: Array<string | null | undefined>) {
  return dates.filter((date): date is string => Boolean(date)).sort().at(-1) ?? null;
}

// Public, read-only report. A scheduled GitHub Action calls it and fails when
// anything is stale, which emails the repository owner.
export async function GET() {
  const [dashboard, composites, insights, underemployment] = await Promise.all([
    getDashboardData(),
    getCompositeSummaries(),
    getInsightFeed({ limit: 50 }),
    readHeadlineTrend()
  ]);

  const inputs: FreshnessInput[] = [
    ...dashboard.categories.flatMap((category) =>
      category.indicators
        .filter((indicator) => indicator.frequency === "weekly" || indicator.frequency === "monthly")
        .map((indicator) => ({
          id: indicator.id,
          label: indicator.title,
          frequency: indicator.frequency as FreshnessFrequency,
          // currentDate is display formatted ("Oct 2026"), so read the ISO date
          // of the latest stored observation from the sparkline instead.
          latestDate: latest(indicator.sparkline.filter((point) => point.value !== null).map((point) => point.date))
        }))
    ),
    ...composites.map((composite) => ({
      id: composite.id,
      label: composite.name,
      frequency: COMPOSITE_FREQUENCY[composite.id] ?? "monthly",
      latestDate: composite.asOfDate
    })),
    {
      id: "research_monitor",
      label: "Research Monitor refresh",
      frequency: "daily",
      latestDate: latest(insights.insights.map((insight) => insight.updatedAt))
    },
    {
      id: "underemployment",
      label: "NY Fed recent graduate underemployment",
      frequency: "quarterly",
      latestDate: latest(underemployment.map((row) => row.date))
    }
  ];

  const report = assessFreshness(inputs);
  return NextResponse.json(report, { status: report.ok ? 200 : 503 });
}
