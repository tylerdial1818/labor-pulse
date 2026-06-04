import "server-only";

import type { DbClient } from "@/lib/db/client";
import { applyFredRefresh } from "@/lib/db/queries";
import type { FredRefreshResult } from "@/lib/db/queries";
import { createFredClient } from "@/lib/fred/client";
import type { FredClient } from "@/lib/fred/client";
import { getAllMetricSegmentDefinitions } from "@/lib/segments/catalog";
import { getFredIndicators } from "@/server/indicator-catalog";
import type { FredRefreshSummary, RefreshAttemptSummary, RefreshStatus } from "@/server/labor-types";

// v1.6 requires at least 10 years of visible history for every metric. Pull one
// extra year so year-ago comparisons and composite windows remain available at
// the beginning of the displayed period.
const HISTORY_YEARS = 11;

function observationStartDate(): string {
  const start = new Date();
  start.setUTCFullYear(start.getUTCFullYear() - HISTORY_YEARS);
  return start.toISOString().slice(0, 10);
}

function summarizeStatus(attempts: RefreshAttemptSummary[]): RefreshStatus {
  if (attempts.length === 0) {
    return "failed";
  }

  if (attempts.every((attempt) => attempt.status === "success")) {
    return "success";
  }

  if (attempts.some((attempt) => attempt.status === "success")) {
    return "partial";
  }

  return "failed";
}

export async function refreshFredIndicators(input: { db?: DbClient; fred?: FredClient } = {}): Promise<FredRefreshSummary> {
  void input.db;
  const startedAt = new Date().toISOString();
  const fred = input.fred ?? createFredClient();
  const observationStart = observationStartDate();

  // Fetch series sequentially to stay within FRED's burst rate limit (the
  // client retries transient 429/5xx with backoff). Payloads are small, so the
  // whole refresh still finishes in a few seconds.
  const results: Array<FredRefreshResult & { observationsFetched: number }> = [];

  const refreshSeries = [
    ...getFredIndicators().map((indicator) => ({ id: indicator.id, geography: "US" })),
    ...getAllMetricSegmentDefinitions().map((segment) => ({ id: segment.seriesId, geography: "US" }))
  ];
  const uniqueRefreshSeries = Array.from(new Map(refreshSeries.map((series) => [series.id, series])).values());

  for (const indicator of uniqueRefreshSeries) {
    const attemptStartedAt = new Date().toISOString();

    try {
      const fetched = await fred.getObservations(indicator.id, { observationStart });
      const observations = fetched.map((observation) => ({
        seriesId: indicator.id,
        geography: indicator.geography,
        date: observation.date,
        value: observation.value
      }));

      results.push({
        seriesId: indicator.id,
        observations,
        status: "success",
        message: null,
        startedAt: attemptStartedAt,
        completedAt: new Date().toISOString(),
        observationsFetched: observations.length
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown FRED refresh error.";
      console.error("FRED refresh failed", { seriesId: indicator.id, message });

      results.push({
        seriesId: indicator.id,
        observations: null,
        status: "failed",
        message,
        startedAt: attemptStartedAt,
        completedAt: new Date().toISOString(),
        observationsFetched: 0
      });
    }
  }

  // Persist all series, observations, and log entries in a single write.
  await applyFredRefresh(
    results.map((result) => ({
      seriesId: result.seriesId,
      observations: result.observations,
      status: result.status,
      message: result.message,
      startedAt: result.startedAt,
      completedAt: result.completedAt
    })),
    new Date().toISOString()
  );

  const attempts: RefreshAttemptSummary[] = results.map((result) => ({
    seriesId: result.seriesId,
    status: result.status,
    observationsFetched: result.observationsFetched,
    observationsUpserted: result.observations ? result.observations.length : 0,
    message: result.message
  }));

  return {
    source: "FRED",
    status: summarizeStatus(attempts),
    startedAt,
    completedAt: new Date().toISOString(),
    attempts
  };
}
