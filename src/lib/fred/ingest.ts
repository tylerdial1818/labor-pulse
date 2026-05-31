import "server-only";

import type { DbClient } from "@/lib/db/client";
import { createDbClient } from "@/lib/db/client";
import { markSeriesRefreshed, seedCatalog, upsertObservation, writeRefreshLog } from "@/lib/db/queries";
import { createFredClient } from "@/lib/fred/client";
import type { FredClient } from "@/lib/fred/client";
import { getFredIndicators } from "@/server/indicator-catalog";
import type { FredRefreshSummary, RefreshAttemptSummary, RefreshStatus } from "@/server/labor-types";

function summarizeStatus(attempts: RefreshAttemptSummary[]): RefreshStatus {
  if (attempts.every((attempt) => attempt.status === "success")) {
    return "success";
  }

  if (attempts.some((attempt) => attempt.status === "success")) {
    return "partial";
  }

  return "failed";
}

export async function refreshFredIndicators(input: { db?: DbClient; fred?: FredClient } = {}): Promise<FredRefreshSummary> {
  const startedAt = new Date().toISOString();
  const db = input.db ?? createDbClient();
  const fred = input.fred ?? createFredClient();
  const attempts: RefreshAttemptSummary[] = [];

  await seedCatalog(db);

  for (const indicator of getFredIndicators()) {
    const attemptStartedAt = new Date().toISOString();

    try {
      const observations = await fred.getObservations(indicator.id);

      for (const observation of observations) {
        await upsertObservation(
          {
            seriesId: indicator.id,
            geography: "US",
            date: observation.date,
            value: observation.value
          },
          db
        );
      }

      await markSeriesRefreshed(indicator.id, db);

      const completedAt = new Date().toISOString();

      await writeRefreshLog(
        {
          source: "FRED",
          seriesId: indicator.id,
          status: "success",
          message: null,
          startedAt: attemptStartedAt,
          completedAt
        },
        db
      );

      attempts.push({
        seriesId: indicator.id,
        status: "success",
        observationsFetched: observations.length,
        observationsUpserted: observations.length,
        message: null
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown FRED refresh error.";
      const completedAt = new Date().toISOString();

      console.error("FRED refresh failed", { seriesId: indicator.id, message });

      try {
        await writeRefreshLog(
          {
            source: "FRED",
            seriesId: indicator.id,
            status: "failed",
            message,
            startedAt: attemptStartedAt,
            completedAt
          },
          db
        );
      } catch (logError) {
        console.error("Failed to write FRED refresh log", {
          seriesId: indicator.id,
          message: logError instanceof Error ? logError.message : "Unknown refresh log error."
        });
      }

      attempts.push({
        seriesId: indicator.id,
        status: "failed",
        observationsFetched: 0,
        observationsUpserted: 0,
        message
      });
    }
  }

  const completedAt = new Date().toISOString();

  return {
    source: "FRED",
    status: summarizeStatus(attempts),
    startedAt,
    completedAt,
    attempts
  };
}
