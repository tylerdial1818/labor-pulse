import { NextResponse } from "next/server";

import { COMPOSITE_DEFINITIONS } from "@/lib/composites/calculate";
import { getReportExport } from "@/lib/db/queries";
import { INDICATOR_CATALOG } from "@/server/indicator-catalog";
import { getMetricSegmentBreakdownData, type MetricSegmentBreakdownData } from "@/server/segment-data";
import type { ReportExportResponse, SegmentDimension } from "@/server/labor-types";

export const dynamic = "force-dynamic";

const segmentDimensions = new Set<SegmentDimension>(["industry", "gender", "state", "age"]);

function csvEscape(value: string | number | null) {
  if (value === null) return "";
  const stringValue = String(value);
  return /[",\n]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue;
}

function listParam(url: URL, keys: string[]) {
  const values = keys.flatMap((key) => url.searchParams.getAll(key)).flatMap((value) => value.split(","));
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function breakdownParams(url: URL): SegmentDimension[] {
  const values = [...listParam(url, ["breakdowns"]), ...listParam(url, ["dimension"])];
  return Array.from(new Set(values.filter((value): value is SegmentDimension => segmentDimensions.has(value as SegmentDimension))));
}

function reportToCsv(report: ReportExportResponse, liveBreakdowns: MetricSegmentBreakdownData[]) {
  const retrievedAt = report.generatedAt;
  const headers = [
    "record_type",
    "dimension",
    "segment",
    "metric_id",
    "metric_label",
    "source",
    "source_url",
    "retrieved_at",
    "observation_date",
    "geography",
    "units",
    "value",
    "availability",
    "caveat"
  ];
  const rows: Array<Array<string | number | null>> = [];

  for (const indicator of report.indicators) {
    for (const observation of indicator.observations) {
      rows.push([
        "indicator",
        "national",
        "United States",
        indicator.id,
        indicator.title,
        indicator.source,
        indicator.sourceUrl,
        retrievedAt,
        observation.date,
        observation.geography,
        indicator.units,
        observation.value,
        "available",
        indicator.caveat ?? "Values may be revised by source publishers."
      ]);
    }
  }

  for (const composite of report.composites) {
    for (const observation of composite.observations) {
      rows.push([
        "composite",
        "national",
        "United States",
        composite.id,
        composite.name,
        composite.source,
        null,
        retrievedAt,
        observation.date,
        observation.geography,
        composite.units,
        observation.value,
        "available",
        composite.methodologyNote
      ]);
    }
  }

  for (const group of report.breakdowns) {
    for (const segment of group.segments) {
      if (segment.observations.length === 0) {
        rows.push([
          "breakdown",
          segment.dimension,
          segment.label,
          segment.seriesId ?? group.baseSeriesId,
          group.baseSeriesId,
          segment.source,
          segment.sourceUrl,
          retrievedAt,
          null,
          segment.geography ?? "US",
          segment.units,
          null,
          segment.status,
          segment.caveat
        ]);
        continue;
      }

      for (const observation of segment.observations) {
        rows.push([
          "breakdown",
          segment.dimension,
          segment.label,
          segment.seriesId ?? group.baseSeriesId,
          group.baseSeriesId,
          segment.source,
          segment.sourceUrl,
          retrievedAt,
          observation.date,
          observation.geography,
          segment.units,
          observation.value,
          segment.status,
          segment.caveat
        ]);
      }
    }
  }

  for (const breakdown of liveBreakdowns) {
    for (const series of breakdown.series) {
      if (series.observations.length === 0) {
        rows.push([
          "breakdown",
          breakdown.dimension,
          series.segmentLabel,
          breakdown.baseSeriesId,
          series.metricLabel,
          `${series.sourceLabel} ${series.seriesId}`,
          series.sourceUrl,
          retrievedAt,
          null,
          series.dimension === "state" ? series.segmentLabel : "US",
          series.units,
          null,
          series.available ? "available" : "unavailable",
          series.unavailableReason ?? series.caveat
        ]);
        continue;
      }

      for (const observation of series.observations) {
        rows.push([
          "breakdown",
          breakdown.dimension,
          series.segmentLabel,
          breakdown.baseSeriesId,
          series.metricLabel,
          `${series.sourceLabel} ${series.seriesId}`,
          series.sourceUrl,
          retrievedAt,
          observation.date,
          observation.geography,
          series.units,
          observation.value,
          series.available ? "available" : "unavailable",
          series.caveat
        ]);
      }
    }
  }

  for (const item of report.unavailable) {
    rows.push(["unavailable", item.kind, item.id, item.id, item.id, null, null, retrievedAt, null, null, null, null, "unavailable", item.reason]);
  }

  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

async function getLiveMetricBreakdowns(input: {
  seriesIds: string[];
  breakdowns: SegmentDimension[];
  states: string[];
}): Promise<MetricSegmentBreakdownData[]> {
  const dimensions = input.breakdowns.length > 0 ? input.breakdowns : (["industry", "gender", "state", "age"] satisfies SegmentDimension[]);
  const requests = input.seriesIds.flatMap((seriesId) =>
    dimensions.map(async (dimension) => {
      const data = await getMetricSegmentBreakdownData({
        seriesId,
        dimension,
        state: input.states[0] ?? "CA"
      });

      return data && data.dimension === dimension ? data : null;
    })
  );

  return (await Promise.all(requests)).filter((row): row is MetricSegmentBreakdownData => row !== null);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const explicitSeriesIds = listParam(url, ["seriesIds", "seriesId"]);
  const explicitCompositeIds = listParam(url, ["compositeIds", "compositeId"]);
  const seriesIds = explicitSeriesIds.length > 0 ? explicitSeriesIds : INDICATOR_CATALOG.map((indicator) => indicator.id);
  const compositeIds = explicitCompositeIds.length > 0 ? explicitCompositeIds : COMPOSITE_DEFINITIONS.map((composite) => composite.id);
  const breakdowns = breakdownParams(url);
  const states = listParam(url, ["states", "state"]);

  try {
    const report = await getReportExport({ seriesIds, compositeIds, breakdowns: [], states });
    const requestedReport = {
      ...report,
      requested: {
        ...report.requested,
        breakdowns,
        states
      }
    };
    const liveBreakdowns = await getLiveMetricBreakdowns({ seriesIds, breakdowns, states });

    if (url.searchParams.get("format") === "json") {
      return NextResponse.json({ ...requestedReport, liveBreakdowns });
    }

    return new Response(reportToCsv(requestedReport, liveBreakdowns), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="labor-pulse-report-${requestedReport.generatedAt.slice(0, 10)}.csv"`
      }
    });
  } catch (error) {
    console.error("Report export request failed", {
      message: error instanceof Error ? error.message : "Unknown report export error."
    });

    return NextResponse.json({ error: "Report export is unavailable" }, { status: 503 });
  }
}
