import "server-only";

import { fetchRawInsight } from "@/lib/insights/parser";
import { INSIGHT_SOURCES } from "@/lib/insights/sources";
import { upsertInsightSummaries } from "@/lib/insights/store";
import { summarizeRawInsight } from "@/lib/insights/summarizer";
import type { InsightRefreshResult, InsightSummary } from "@/lib/insights/types";

export type RefreshInsightsSummary = {
  source: "insights";
  status: "success" | "partial" | "failed";
  refreshedAt: string;
  results: InsightRefreshResult[];
  summaries: number;
};

export async function refreshInsights(): Promise<RefreshInsightsSummary> {
  const refreshedAt = new Date().toISOString();
  const results: InsightRefreshResult[] = [];
  const summaries: InsightSummary[] = [];

  for (const source of INSIGHT_SOURCES) {
    if (source.access === "manual") {
      results.push({
        sourceId: source.id,
        sourceName: source.name,
        status: "skipped",
        message: "Manual source; no automated fetch configured.",
        fetchedAt: refreshedAt,
        summaryId: null
      });
      continue;
    }

    try {
      const raw = await fetchRawInsight(source);
      const summary = await summarizeRawInsight(raw);
      summaries.push(summary);
      results.push({
        sourceId: source.id,
        sourceName: source.name,
        status: "success",
        message: "Fetched and summarized latest public source page.",
        fetchedAt: summary.updatedAt,
        summaryId: summary.id
      });
    } catch (error) {
      results.push({
        sourceId: source.id,
        sourceName: source.name,
        status: "failed",
        message: error instanceof Error ? error.message : "Unknown insights refresh error.",
        fetchedAt: refreshedAt,
        summaryId: null
      });
    }
  }

  if (summaries.length > 0 || results.length > 0) {
    await upsertInsightSummaries(summaries, results);
  }

  const failures = results.filter((result) => result.status === "failed").length;
  const successes = results.filter((result) => result.status === "success").length;

  return {
    source: "insights",
    status: failures === 0 ? "success" : successes > 0 ? "partial" : "failed",
    refreshedAt,
    results,
    summaries: summaries.length
  };
}
