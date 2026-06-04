"use client";

import Link from "next/link";
import { Download } from "lucide-react";

import { ComparisonTimeSeriesChart } from "@/components/charts/labor-pulse-charts";
import { cn } from "@/lib/utils/cn";
import type { MetricSegmentBreakdownData, SegmentSeriesViewModel } from "@/server/segment-data";

const dimensionLabels = {
  industry: "Industry",
  gender: "Gender",
  state: "State",
  age: "Age"
} as const;

function interpretationCopy(data: MetricSegmentBreakdownData) {
  if (data.dimension === "industry") {
    return "Use this view to compare where payroll employment is concentrated and how major sectors have moved over time. These are job counts by industry, so they should not be read as unique workers.";
  }

  if (data.dimension === "gender") {
    return "Use this view to compare whether the headline labor signal is moving differently for men and women. The categories match the source data, so this is a public-data lens rather than a complete measure of gender identity.";
  }

  if (data.dimension === "age") {
    return "Use this view to see whether the labor signal is moving differently across broad age bands. Age cuts are especially useful for spotting youth, prime-age, and older-worker patterns.";
  }

  return "Use this view to compare the national unemployment rate with the selected state. State rates can move differently from the national figure because each state has a different industry mix and labor-force base.";
}

function rankedChartSeries(series: SegmentSeriesViewModel[]) {
  return [...series]
    .filter((item) => item.available && item.currentValue !== null && item.observations.length > 1)
    .sort((a, b) => (b.currentValue ?? Number.NEGATIVE_INFINITY) - (a.currentValue ?? Number.NEGATIVE_INFINITY));
}

function visibleChartSeries(data: MetricSegmentBreakdownData) {
  const ranked = rankedChartSeries(data.series);
  return data.series.length > 5 ? ranked.slice(0, 5) : ranked;
}

function coverageCopy(data: MetricSegmentBreakdownData, count: number) {
  if (data.series.length <= 5) {
    return `Showing all ${count} available comparison lines.`;
  }

  return `Showing the top ${Math.min(5, count)} available lines by latest value. The full table below includes every mapped segment.`;
}

function BreakdownsSection({ data }: { data: MetricSegmentBreakdownData }) {
  const chartSeries = visibleChartSeries(data);
  const availableCount = data.series.filter((series) => series.available).length;
  const reportHref = `/api/export/report?seriesId=${data.baseSeriesId}&dimension=${data.dimension}&state=${data.stateAbbreviation}`;
  const units = chartSeries[0]?.units ?? data.series[0]?.units;
  const seasonalNotes = Array.from(
    new Set(
      data.series
        .map((series) => series.seasonalAdjustment)
        .filter((note): note is string => Boolean(note))
    )
  );

  return (
    <section className="border-t border-rule py-6" aria-labelledby={`metric-breakdowns-${data.dimension}`}>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">{dimensionLabels[data.dimension]} breakdown</p>
          <h3 id={`metric-breakdowns-${data.dimension}`} className="mt-2 font-serif text-[26px] font-semibold leading-tight tracking-[-0.01em]">
            Compare this metric by {dimensionLabels[data.dimension].toLowerCase()}
          </h3>
          <p className="mt-2 font-serif text-[16px] leading-[1.45] text-ink">{interpretationCopy(data)}</p>
          <p className="mt-2 font-sans text-xs leading-[1.45] text-sub">{coverageCopy(data, availableCount)}</p>
          {seasonalNotes.length > 0 ? <p className="mt-2 font-sans text-xs leading-[1.45] text-sub">Seasonal adjustment note: {seasonalNotes.join(", ")}.</p> : null}
        </div>
        <a
          href={reportHref}
          className="inline-flex items-center gap-2 border border-rule px-3 py-2 font-sans text-xs font-semibold text-navy hover:bg-[var(--lp-navy-tint)]"
        >
          <Download className="h-4 w-4" />
          Export this view
        </a>
      </div>

      <div className="mt-5">
        {chartSeries.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">10-year comparison history</p>
              <p className="mt-1 font-sans text-xs text-sub">
                Source: FRED series listed in the table below. Lines use one shared y axis, so levels can be compared directly.
              </p>
            </div>
            <ComparisonTimeSeriesChart
              series={chartSeries.map((series) => ({
                id: series.seriesId,
                label: series.segmentLabel,
                data: series.observations
              }))}
              label={`${dimensionLabels[data.dimension]} comparison history`}
              units={units}
            />
          </>
        ) : (
          <div className="flex min-h-[260px] items-center border-y border-hair font-sans text-sm text-sub">
            This breakdown is mapped to public source series, but no usable observations are available right now.
          </div>
        )}
      </div>

      <div className="mt-6 overflow-x-auto border-l border-t border-rule">
        <table className="min-w-full border-collapse font-sans text-sm">
          <thead>
            <tr className="bg-[var(--lp-navy-tint)] text-left text-[10px] uppercase tracking-[0.12em] text-sub">
              <th className="border-b border-r border-rule px-3 py-3">Segment</th>
              <th className="border-b border-r border-rule px-3 py-3">Current</th>
              <th className="border-b border-r border-rule px-3 py-3">As of</th>
              <th className="border-b border-r border-rule px-3 py-3">Source</th>
              <th className="border-b border-r border-rule px-3 py-3">What to know</th>
            </tr>
          </thead>
          <tbody>
            {data.series.map((series) => (
              <tr key={`${series.seriesId}-${series.segmentLabel}`} className={cn(!series.available && "text-sub")}>
                <td className="border-b border-r border-rule px-3 py-3">
                  <span className="block font-semibold text-ink">{series.segmentLabel}</span>
                  <span className="mt-1 block text-[11px] text-sub">{series.metricLabel}</span>
                </td>
                <td className="border-b border-r border-rule px-3 py-3 font-semibold">{series.currentValueFormatted}</td>
                <td className="border-b border-r border-rule px-3 py-3">{series.currentDate ?? "not available"}</td>
                <td className="border-b border-r border-rule px-3 py-3">
                  <a className="font-semibold text-navy hover:underline" href={series.sourceUrl}>
                    {series.sourceLabel} {series.seriesId}
                  </a>
                </td>
                <td className="border-b border-r border-rule px-3 py-3">{series.available ? series.caveat : series.unavailableReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function MetricBreakdownsPanel({ data }: { data: MetricSegmentBreakdownData[] }) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-rule py-5" aria-labelledby="metric-breakdowns-heading">
      <div className="max-w-3xl">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Breakdowns</p>
        <h2 id="metric-breakdowns-heading" className="mt-2 font-serif text-[30px] font-semibold leading-tight tracking-[-0.01em]">
          Compare this metric across available public data cuts
        </h2>
        <p className="mt-2 font-serif text-[16px] leading-[1.45] text-ink">
          These sections only appear when Labor Pulse has a verified source series for the selected metric. Unsupported cuts are left out instead of estimated.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {data.map((breakdown) => (
          <Link key={breakdown.dimension} href={`#metric-breakdowns-${breakdown.dimension}`} className="border border-rule px-3 py-2 font-sans text-xs font-semibold text-navy hover:bg-[var(--lp-navy-tint)]">
            {dimensionLabels[breakdown.dimension]}
          </Link>
        ))}
      </div>
      {data.map((breakdown) => (
        <BreakdownsSection key={breakdown.dimension} data={breakdown} />
      ))}
    </section>
  );
}
