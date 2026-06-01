"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import { CompositesStrip } from "@/components/dashboard/composites-strip";
import { IndicatorSparkline, type PulseChartPoint } from "@/components/charts/labor-pulse-charts";
import { cn } from "@/lib/utils/cn";
import type { LaborDashboardData } from "@/server/labor-types";

type CategoryId = "lagging" | "leading" | "tech_impact";
type Frequency = "weekly" | "monthly" | "quarterly" | "ad_hoc";
type ArrowDirection = "up" | "down" | "flat" | "none";
type Tone = "up" | "down" | "info" | "muted";

type IndicatorCardViewModel = {
  id: string;
  title: string;
  category: CategoryId;
  source: string;
  sourceUrl?: string;
  plainLanguage: string;
  whyItMatters: string;
  interpretation: string;
  sourceLabel: string;
  sourceDetail: string;
  frequency: Frequency;
  currentValue: number | null;
  currentValueFormatted: string;
  unitLabel: string;
  currentDate: string | null;
  delta: {
    formatted: string;
    periodLabel: string;
    arrowDirection: ArrowDirection;
    tone: Tone;
  };
  sparkline: PulseChartPoint[];
  lastUpdated: string | null;
  isProxy: boolean;
  methodologyNote?: string;
  isStale: boolean;
  description?: string;
};

const methodologyNote =
  "Professional and Business Services and Information Sector employment are proxies for AI labor market impact, not direct measurements. They reflect employment in sectors most exposed to AI tools. The Anthropic Economic Index measures Claude usage specifically, not all AI tools. Use these indicators as directional signals, not definitive evidence.";

export function DashboardContent({ data }: { data: LaborDashboardData }) {
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>("lagging");
  const activeCategory = useMemo(
    () => data.categories.find((category) => category.id === activeCategoryId) ?? data.categories[0],
    [activeCategoryId, data.categories]
  );

  return (
    <>
      <PageHeader />
      <CompositesStrip composites={data.composites ?? []} />
      <section aria-labelledby="dashboard-tabs">
        <h2 id="dashboard-tabs" className="sr-only">
          Indicator groups
        </h2>
        <div className="max-[620px]:hidden">
          <div role="tablist" aria-label="Labor market indicator groups" className="flex gap-1 border-b border-rule">
            {data.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={category.id === activeCategoryId}
                className={cn(
                  "mb-[-1px] inline-flex items-center gap-[9px] border-b-2 border-transparent px-[18px] py-3 font-sans text-[14.5px] font-medium leading-none text-sub transition-colors hover:text-ink",
                  category.id === activeCategoryId && "border-navy font-bold text-ink"
                )}
                onClick={() => setActiveCategoryId(category.id)}
              >
                <TabShape id={category.id} active={category.id === activeCategoryId} />
                <span>{category.label}</span>
                <span
                  className={cn(
                    "rounded-badge px-[7px] py-[3px] text-[11px] font-semibold text-faint",
                    category.id === activeCategoryId && "bg-[var(--lp-navy-tint)] text-navy"
                  )}
                >
                  {category.indicators.length}
                </span>
              </button>
            ))}
          </div>
        </div>
        <label className="hidden max-[620px]:block">
          <span className="mb-2 block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-sub">Indicator group</span>
          <select
            value={activeCategoryId}
            onChange={(event) => setActiveCategoryId(event.target.value as CategoryId)}
            className="w-full rounded border border-rule bg-paper px-3 py-3 font-sans text-sm font-semibold text-ink"
          >
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label} ({category.indicators.length})
              </option>
            ))}
          </select>
        </label>
        <p className="mb-[22px] mt-[14px] font-serif text-[14.5px] italic leading-[1.4] text-sub">{activeCategory.blurb}</p>
        {activeCategory.id === "tech_impact" ? <MethodologyNote /> : null}
        <IndicatorGrid indicators={activeCategory.indicators} />
      </section>
    </>
  );
}

function PageHeader() {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5 py-[26px]">
      <div>
        <h1 className="whitespace-nowrap font-serif text-[clamp(32px,5vw,40px)] font-bold leading-none tracking-[-0.02em] text-ink">
          Labor Market Dashboard
        </h1>
        <p className="mt-2 font-serif text-base italic leading-[1.4] text-sub">Fifteen indicators across the US labor market - Data through April 2026</p>
      </div>
      <div aria-label="Color legend" className="font-sans">
        <div className="flex flex-wrap items-center gap-4 text-xs text-sub">
          <LegendDot color="var(--lp-up)" label="Improving" />
          <LegendDot color="var(--lp-down)" label="Deteriorating" />
          <LegendDot color="var(--lp-navy)" label="Informational" />
        </div>
        <p className="mt-[6px] max-w-[360px] text-[11.5px] leading-[1.35] text-sub">
          Color shows the change&apos;s direction for the labor market. Arrows show whether the value rose or fell.
        </p>
      </div>
    </header>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-[6px]">
      <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function TabShape({ id, active }: { id: CategoryId; active: boolean }) {
  const color = active ? "var(--lp-navy)" : "var(--lp-faint)";

  if (id === "leading") {
    return <span aria-hidden="true" className="h-0 w-0 border-x-[6px] border-b-[11px] border-x-transparent" style={{ borderBottomColor: color }} />;
  }

  if (id === "tech_impact") {
    return <span aria-hidden="true" className="h-[11px] w-[11px] rotate-45 border" style={{ borderColor: color }} />;
  }

  return <span aria-hidden="true" className="h-[11px] w-[11px] rounded-full border" style={{ borderColor: color }} />;
}

function MethodologyNote() {
  return (
    <div className="mb-[22px] flex gap-4 border border-rule bg-[var(--lp-navy-tint)] px-5 py-4 max-sm:flex-col" role="note" aria-label="Tech and AI methodology note">
      <p className="w-[120px] shrink-0 font-sans text-[10.5px] font-bold uppercase leading-[1.3] tracking-[0.14em] text-navy">Methodology note</p>
      <p className="max-w-[880px] font-serif text-[15px] leading-[1.5] text-ink">{methodologyNote}</p>
    </div>
  );
}

function IndicatorGrid({ indicators }: { indicators: IndicatorCardViewModel[] }) {
  return (
    <div className="grid border-l border-t border-rule sm:grid-cols-2 xl:grid-cols-3">
      {indicators.map((indicator) => (
        <IndicatorCard key={indicator.id} indicator={indicator} />
      ))}
    </div>
  );
}

function IndicatorCard({ indicator }: { indicator: IndicatorCardViewModel }) {
  return (
    <Link
      href={`/indicators/${indicator.id}` as Route}
      className="group flex min-h-[252px] flex-col border-b border-r border-rule bg-paper px-5 py-[18px] transition-colors hover:bg-[var(--lp-navy-tint)] hover:shadow-[inset_0_2px_0_var(--lp-navy)] focus-visible:bg-[var(--lp-navy-tint)] focus-visible:shadow-[inset_0_2px_0_var(--lp-navy)]"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="max-w-[260px] font-serif text-[16.5px] font-semibold leading-[1.2] tracking-[-0.005em] text-ink">{indicator.title}</h3>
        {indicator.isProxy ? (
          <span className="rounded border border-navy px-[6px] py-[3px] font-sans text-[9px] font-bold uppercase leading-none tracking-[0.10em] text-navy">
            Proxy
          </span>
        ) : null}
      </div>
      <div className="mt-5 flex items-baseline gap-1">
        <span className="font-serif text-[38px] font-semibold leading-[0.9] tracking-[-0.01em] text-ink">{indicator.currentValueFormatted}</span>
        <span className="font-serif text-[17px] font-normal text-sub">{indicator.unitLabel}</span>
      </div>
      <p className="mt-[8px] max-w-[320px] font-sans text-[12px] leading-[1.35] text-sub">{indicator.plainLanguage}</p>
      <div className="mt-[10px] flex flex-wrap items-center gap-2 font-sans text-[10px] uppercase leading-none tracking-[0.08em] text-sub">
        <span>Source</span>
        <span className="font-bold normal-case tracking-normal text-navy">{indicator.sourceLabel}</span>
        <span>As of {indicator.currentDate ?? "not available"}</span>
      </div>
      <div className="mt-auto flex items-end justify-between gap-4 pt-[14px]">
        <div className="flex min-w-0 items-center gap-[6px]">
          <DeltaArrow direction={indicator.delta.arrowDirection} tone={indicator.delta.tone} />
          <span className={cn("font-sans text-[12.5px] font-bold leading-none", toneText(indicator.delta.tone))}>{indicator.delta.formatted}</span>
          <span className="truncate font-sans text-[12.5px] leading-none text-sub">{indicator.delta.periodLabel}</span>
        </div>
        <IndicatorSparkline data={indicator.sparkline} tone={indicator.delta.tone} unitLabel={indicator.unitLabel} />
      </div>
      <div className="mt-[14px] flex items-center justify-between gap-3 border-t border-hair pt-[10px] font-sans text-[10px] uppercase leading-none tracking-[0.04em] text-sub">
        <span>
          Updated {indicator.lastUpdated ?? "not available"}
          {indicator.isStale ? <span className="ml-1 text-down">stale</span> : null}
        </span>
        <span className="flex items-center gap-2 text-right">
          <span>{indicator.frequency.replace("_", " ")}</span>
          <span className="font-semibold normal-case tracking-normal text-navy">View -&gt;</span>
        </span>
      </div>
      <p className="mt-2 font-sans text-[11px] leading-[1.35] text-sub">{indicator.interpretation}</p>
    </Link>
  );
}

function DeltaArrow({ direction, tone }: { direction: ArrowDirection; tone: Tone }) {
  if (direction === "none" || direction === "flat") {
    return <span aria-hidden="true" className="h-[2px] w-[9px] bg-sub" />;
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" className={cn("h-[9px] w-[9px]", direction === "down" && "rotate-180")}>
      <path d="M5 1L9 8H1Z" fill={`var(--lp-${tone === "down" ? "down" : tone === "up" ? "up" : "navy"})`} />
    </svg>
  );
}

function toneText(tone: Tone) {
  if (tone === "up") return "text-up";
  if (tone === "down") return "text-down";
  if (tone === "info") return "text-navy";
  return "text-sub";
}
