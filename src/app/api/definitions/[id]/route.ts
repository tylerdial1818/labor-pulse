import { NextResponse } from "next/server";

import { getIndicatorDetail } from "@/lib/db/queries";
import { getOrCreateDefinition } from "@/lib/llm/definitions";
import { getCatalogIndicator } from "@/server/indicator-catalog";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const catalogIndicator = getCatalogIndicator(id);

  if (!catalogIndicator) {
    return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
  }

  try {
    const detail = await getIndicatorDetail(id);
    const definition = await getOrCreateDefinition(detail?.series ?? { ...catalogIndicator, lastRefreshedAt: null });

    return NextResponse.json(definition);
  } catch (error) {
    console.error("Definition request failed", {
      seriesId: id,
      message: error instanceof Error ? error.message : "Unknown definition error."
    });

    return NextResponse.json({
      seriesId: id,
      content: "Definition unavailable. Please refresh to try again.",
      model: null,
      generatedAt: null,
      cached: false
    });
  }
}
