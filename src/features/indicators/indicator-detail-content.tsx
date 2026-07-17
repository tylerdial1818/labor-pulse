"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import { HistoricalContext } from "@/components/indicators/historical-context";
import { MetricBreakdownsPanel } from "@/components/indicators/metric-breakdowns-panel";
import { PageCitation } from "@/components/research/page-citation";
import { TimeSeriesChart } from "@/components/charts/labor-pulse-charts";
import { cn } from "@/lib/utils/cn";
import { normalizePublicCopy } from "@/lib/utils/public-copy";
import type { DefinitionResponse, IndicatorDetailResponse } from "@/server/labor-types";
import type { MetricSegmentBreakdownData } from "@/server/segment-data";

type WindowOption = "1Y" | "5Y" | "10Y" | "MAX";

const windowOptions: WindowOption[] = ["1Y", "5Y", "10Y", "MAX"];

function cutoffForWindow(option: WindowOption, latestDate: string | null) {
  if (!latestDate || option === "MAX") {
    return null;
  }

  const years = option === "1Y" ? 1 : option === "5Y" ? 5 : 10;
  const cutoff = new Date(`${latestDate}T00:00:00.000Z`);
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - years);
  return cutoff.toISOString().slice(0, 10);
}

export function IndicatorDetailContent({
  detail,
  definition,
  breakdowns
}: {
  detail: IndicatorDetailResponse;
  definition: DefinitionResponse;
  breakdowns: MetricSegmentBreakdownData[];
}) {
  const [windowOption, setWindowOption] = useState<WindowOption>("10Y");
  const latestDate = detail.observations.at(-1)?.date ?? null;
  const chartData = useMemo(() => {
    const cutoff = cutoffForWindow(windowOption, latestDate);
    return cutoff ? detail.observations.filter((observation) => observation.date >= cutoff) : detail.observations;
  }, [detail.observations, latestDate, windowOption]);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 border-y border-rule py-5 lg:grid-cols-[1.2fr_0.8fr]" aria-label="Metric explanation and source">
        <div>
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">What this number means</p>
          <p className="mt-2 font-serif text-[18px] leading-[1.45] text-ink">{detail.series.plainLanguage}</p>
          <p className="mt-3 font-sans text-sm leading-[1.5] text-sub">{detail.series.whyItMatters}</p>
          <p className="mt-3 border-l-2 border-navy pl-3 font-sans text-sm leading-[1.45] text-ink">{detail.series.interpretation}</p>
        </div>
        <aside className="border-l border-rule pl-6 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-5">
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Source of this number</p>
          <dl className="mt-3 space-y-3 font-sans text-sm">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sub">Source</dt>
              <dd>
                <a className="font-semibold text-navy hover:underline" href={detail.series.sourceUrl}>
                  {detail.series.sourceLabel}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sub">Series detail</dt>
              <dd className="text-ink">{detail.series.sourceDetail}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sub">Latest observation</dt>
              <dd className="text-ink">{latestDate ?? "not available"}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="border-y border-rule py-5" aria-label="Indicator history">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Time series</p>
            <p className="mt-1 font-sans text-xs text-sub">
              {detail.series.source} · {detail.series.frequency.replace("_", " ")} · {detail.series.units}
            </p>
          </div>
          <div className="flex items-center gap-2" aria-label="Time window">
            {windowOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWindowOption(option)}
                className={cn(
                  "border-b-2 border-transparent px-2 py-1 font-sans text-xs font-semibold text-sub",
                  option === windowOption && "border-navy text-navy"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <TimeSeriesChart data={chartData} label={`${detail.series.shortTitle} history`} units={detail.series.units} />
      </section>

      <HistoricalContext context={detail.context ?? null} />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Definition</h2>
          <p className="mt-3 font-serif text-[16px] leading-[1.55] text-ink">{normalizePublicCopy(definition.content)}</p>
          <p className="mt-3 font-sans text-xs text-sub">
            Use this definition with the source notes and methodology shown on this page.
          </p>
        </div>
        <aside className="border-l border-rule pl-6 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-5">
          <h2 className="font-serif text-2xl font-semibold">Source</h2>
          <dl className="mt-3 space-y-3 font-sans text-sm">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sub">Original source</dt>
              <dd>
                <a className="font-semibold text-navy hover:underline" href={detail.series.sourceUrl}>
                  {detail.series.sourceLabel}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sub">What source publishes</dt>
              <dd className="text-ink">{detail.series.sourceDetail}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sub">Last refreshed</dt>
              <dd className="text-ink">{detail.refreshedAt ?? "not available"}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sub">Geography</dt>
              <dd className="text-ink">US national data</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`/api/export/csv/${detail.series.id}`}
              className="inline-flex items-center gap-2 border border-rule px-3 py-2 font-sans text-xs font-semibold text-navy hover:bg-[var(--lp-navy-tint)]"
            >
              <Download className="h-4 w-4" />
              Download data
            </a>
            <a
              href={`/api/export/png/${detail.series.id}`}
              className="inline-flex items-center gap-2 border border-rule px-3 py-2 font-sans text-xs font-semibold text-navy hover:bg-[var(--lp-navy-tint)]"
            >
              <Download className="h-4 w-4" />
              Download chart
            </a>
          </div>
        </aside>
      </section>

      {detail.series.methodologyNote ? (
        <section className="border border-rule bg-[var(--lp-navy-tint)] px-5 py-4" aria-label="Methodology note">
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Methodology note</p>
          <p className="mt-2 max-w-4xl font-serif text-[15px] leading-[1.5] text-ink">{detail.series.methodologyNote}</p>
        </section>
      ) : null}

      <MetricBreakdownsPanel data={breakdowns} />

      <PageCitation
        title={detail.series.title}
        path={`/indicators/${detail.series.id}`}
        source={detail.series.sourceLabel}
      />
    </div>
  );
}
