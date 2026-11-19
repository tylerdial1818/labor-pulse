import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron/auth";
import { recomputeComposites } from "@/lib/db/queries";
import { refreshFredIndicators } from "@/lib/fred/ingest";

export const dynamic = "force-dynamic";
// The segment refresh covers a few hundred FRED series. Allow the full
// function window so it can finish after the headline layer is saved.
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Headline indicators, then composites, so the dashboard is current even
    //    if the larger segment refresh later runs out of time.
    const core = await refreshFredIndicators({ scope: "core" });
    const compositeObservations = core.status === "failed" ? [] : await recomputeComposites();

    // 2. Breakdown series for indicator detail pages.
    const segments = await refreshFredIndicators({ scope: "segments" });

    const status = core.status === "failed" ? 500 : 200;

    return NextResponse.json(
      {
        source: "FRED",
        status: core.status === "success" && segments.status === "success" ? "success" : core.status === "failed" ? "failed" : "partial",
        startedAt: core.startedAt,
        completedAt: segments.completedAt,
        core: { status: core.status, attempts: core.attempts.length },
        segments: { status: segments.status, attempts: segments.attempts.length },
        compositesRecomputed: compositeObservations.length,
        attempts: [...core.attempts, ...segments.attempts].filter((attempt) => attempt.status !== "success")
      },
      { status }
    );
  } catch (error) {
    console.error("FRED cron refresh failed", {
      message: error instanceof Error ? error.message : "Unknown cron refresh error."
    });

    return NextResponse.json(
      {
        source: "FRED",
        status: "failed",
        message: "FRED refresh failed."
      },
      { status: 500 }
    );
  }
}
