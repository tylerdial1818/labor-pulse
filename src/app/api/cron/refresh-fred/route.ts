import { NextResponse } from "next/server";

import { refreshFredIndicators } from "@/lib/fred/ingest";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret) {
    return false;
  }

  return authorization === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await refreshFredIndicators();
    const status = summary.status === "failed" ? 500 : 200;

    return NextResponse.json(summary, { status });
  } catch (error) {
    console.error("FRED cron refresh failed before series attempts", {
      message: error instanceof Error ? error.message : "Unknown cron refresh error."
    });

    return NextResponse.json(
      {
        source: "FRED",
        status: "failed",
        message: "FRED refresh failed before series attempts."
      },
      { status: 500 }
    );
  }
}
