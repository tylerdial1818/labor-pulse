import { NextResponse } from "next/server";

import { getIndicatorDetail } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const detail = await getIndicatorDetail(id);

    if (!detail) {
      return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (error) {
    console.error("Indicator detail request failed", {
      seriesId: id,
      message: error instanceof Error ? error.message : "Unknown indicator detail error."
    });

    return NextResponse.json({ error: "Indicator data is unavailable" }, { status: 503 });
  }
}
