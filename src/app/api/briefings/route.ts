import { NextResponse } from "next/server";

import { generateBriefingMarkdown } from "@/lib/briefings/generate";
import { createBriefing, getCompositeSummaries, getDashboardData, listBriefings } from "@/lib/db/queries";
import { getInsightFeed } from "@/lib/insights/queries";
import type { BriefingInput } from "@/types/v15";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
  return NextResponse.json({ briefings: await listBriefings() });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ errors: ["Request body must be valid JSON."] }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ errors: ["Request body must be an object."] }, { status: 400 });
  }

  const theme = typeof body.theme === "string" ? body.theme.trim() : "";
  const geography = typeof body.geography === "string" ? body.geography.trim() : "US";
  const seriesIds = isStringArray(body.seriesIds) ? body.seriesIds : [];
  const compositeIds = isStringArray(body.compositeIds) ? body.compositeIds : [];
  const insightIds = isStringArray(body.insightIds) ? body.insightIds : [];
  const [dashboard, composites, insightFeed] = await Promise.all([getDashboardData(), getCompositeSummaries(), getInsightFeed({ limit: 100 })]);
  const validSeriesIds = new Set(dashboard.categories.flatMap((category) => category.indicators.map((indicator) => indicator.id)));
  const validCompositeIds = new Set<string>(composites.map((composite) => composite.id));
  const validInsightIds = new Set(insightFeed.insights.map((insight) => String(insight.id)));
  const errors: string[] = [];

  if (theme.length < 3 || theme.length > 120) errors.push("Theme must be between 3 and 120 characters.");
  if (!/^[A-Za-z0-9 ,.-]{2,40}$/.test(geography)) errors.push("Geography contains unsupported characters.");
  if (seriesIds.length < 1 || seriesIds.length > 8) errors.push("Select between 1 and 8 indicators.");
  if (compositeIds.length > 6) errors.push("Select 6 or fewer composites.");
  if (insightIds.length > 10) errors.push("Select 10 or fewer insights.");

  const unknownSeries = seriesIds.filter((id) => !validSeriesIds.has(id));
  const unknownComposites = compositeIds.filter((id) => !validCompositeIds.has(id));
  const unknownInsights = insightIds.filter((id) => !validInsightIds.has(id));

  if (unknownSeries.length > 0) errors.push(`Unknown indicators: ${unknownSeries.join(", ")}.`);
  if (unknownComposites.length > 0) errors.push(`Unknown composites: ${unknownComposites.join(", ")}.`);
  if (unknownInsights.length > 0) errors.push(`Unknown insights: ${unknownInsights.join(", ")}.`);

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const input: BriefingInput = {
    theme,
    seriesIds,
    compositeIds,
    insightIds,
    geography
  };
  const generated = await generateBriefingMarkdown(input);
  const briefing = await createBriefing(input, generated.content, generated.model);

  return NextResponse.json({ briefing });
}
