import { getAllMetricSegmentDefinitions } from "@/lib/segments/catalog";
import { getFredIndicators } from "@/server/indicator-catalog";

export type FredRefreshScope = "core" | "segments" | "all";

// Headline indicators feed the dashboard and composites. Segment series feed
// detail-page breakdowns. Splitting them lets the cron persist and recompute
// the headline layer before spending time on the much larger segment set.
export function selectRefreshSeries(scope: FredRefreshScope) {
  const core = getFredIndicators().map((indicator) => ({ id: indicator.id, geography: "US" }));
  const coreIds = new Set(core.map((series) => series.id));
  const segments = getAllMetricSegmentDefinitions()
    .map((segment) => ({ id: segment.seriesId, geography: "US" }))
    .filter((series) => !coreIds.has(series.id));

  const selected = scope === "core" ? core : scope === "segments" ? segments : [...core, ...segments];
  return Array.from(new Map(selected.map((series) => [series.id, series])).values());
}
