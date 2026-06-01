import { NextResponse } from "next/server";

import { refreshInsights } from "@/lib/insights/refresh";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return true;
  }

  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await refreshInsights();
    const status = summary.status === "failed" ? 500 : 200;
    return NextResponse.json(summary, { status });
  } catch (error) {
    console.error("Insights cron refresh failed before source attempts", {
      message: error instanceof Error ? error.message : "Unknown insights cron refresh error."
    });

    return NextResponse.json(
      {
        source: "insights",
        status: "failed",
        message: "Insights refresh failed before source attempts."
      },
      { status: 500 }
    );
  }
}
