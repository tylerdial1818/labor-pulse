import { NextResponse } from "next/server";

import { getInsightFeed } from "@/lib/insights/queries";
import type { InsightCategory, InsightSort } from "@/lib/insights/types";

export const dynamic = "force-dynamic";

function parseLimit(value: string | null) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tags = url.searchParams
    .getAll("tags")
    .flatMap((value) => value.split(","))
    .map((tag) => tag.trim())
    .filter(Boolean);

  const response = await getInsightFeed({
    category: (url.searchParams.get("category") ?? undefined) as InsightCategory | undefined,
    tags,
    since: url.searchParams.get("since") ?? undefined,
    limit: parseLimit(url.searchParams.get("limit")),
    sort: (url.searchParams.get("sort") ?? undefined) as InsightSort | undefined
  });

  return NextResponse.json(response);
}
