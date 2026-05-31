import { NextResponse } from "next/server";

import { getIndicatorDetail } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

function csvEscape(value: string | number | null) {
  if (value === null) {
    return "";
  }

  const stringValue = String(value);

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const detail = await getIndicatorDetail(id);

    if (!detail) {
      return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
    }

    const retrievedAt = new Date().toISOString();
    const headers = ["series_id", "series_title", "source", "retrieved_at", "observation_date", "geography", "units", "value"];
    const rows = detail.observations.map((observation) => [
      detail.series.id,
      detail.series.title,
      detail.series.source,
      retrievedAt,
      observation.date,
      observation.geography,
      detail.series.units,
      observation.value
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${detail.series.id.toLowerCase()}-observations.csv"`
      }
    });
  } catch (error) {
    console.error("CSV export request failed", {
      seriesId: id,
      message: error instanceof Error ? error.message : "Unknown CSV export error."
    });

    return NextResponse.json({ error: "CSV export is unavailable" }, { status: 503 });
  }
}
