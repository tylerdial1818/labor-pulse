import { NextResponse } from "next/server";

import { getHistoricalContext, getMajorProfile, getMajorRanking } from "@/lib/underemployment/calculate";
import type { UnderemploymentCohort } from "@/types/underemployment";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const majorId = Number(id);
  const cohort = new URL(request.url).searchParams.get("cohort") === "all_grads" ? "all_grads" : "recent_grads";

  if (!Number.isInteger(majorId)) {
    return NextResponse.json({ error: "Invalid major id" }, { status: 400 });
  }

  const profile = await getMajorProfile(majorId, cohort as UnderemploymentCohort);

  if (!profile) {
    return NextResponse.json({ error: "Major not found" }, { status: 404 });
  }

  const peers = (await getMajorRanking(cohort as UnderemploymentCohort, "underemployment_asc"))
    .filter((major) => major.id !== profile.id)
    .map((major) => ({
      id: major.id,
      name: major.name,
      underemploymentRate: major.current.underemploymentRate,
      difference: Math.abs(major.current.underemploymentRate - profile.current.underemploymentRate)
    }))
    .sort((a, b) => a.difference - b.difference)
    .slice(0, 5);

  return NextResponse.json({
    profile,
    historicalContext: await getHistoricalContext(majorId, cohort as UnderemploymentCohort),
    similarMajors: peers
  });
}
