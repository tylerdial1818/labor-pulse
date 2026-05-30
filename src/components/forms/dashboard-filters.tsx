"use client";

import type { DashboardFilters } from "@/types/analytics";

const periods: DashboardFilters["period"][] = ["30d", "90d", "12m"];
const segments: DashboardFilters["segment"][] = ["All", "Enterprise", "Mid-market", "SMB"];
const regions: DashboardFilters["region"][] = ["All", "North America", "EMEA", "APAC", "LATAM"];

type DashboardFiltersPanelProps = {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
};

export function DashboardFiltersPanel({ filters, onFiltersChange }: DashboardFiltersPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-panel p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold">Analysis filters</p>
        <p className="mt-1 text-sm text-muted-foreground">Segment, region, and reporting period controls.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <select
          aria-label="Segment"
          className="h-10 rounded-md border border-border bg-panel px-3 text-sm"
          value={filters.segment}
          onChange={(event) => onFiltersChange({ ...filters, segment: event.target.value as DashboardFilters["segment"] })}
        >
          {segments.map((segment) => (
            <option key={segment}>{segment}</option>
          ))}
        </select>
        <select
          aria-label="Region"
          className="h-10 rounded-md border border-border bg-panel px-3 text-sm"
          value={filters.region}
          onChange={(event) => onFiltersChange({ ...filters, region: event.target.value as DashboardFilters["region"] })}
        >
          {regions.map((region) => (
            <option key={region}>{region}</option>
          ))}
        </select>
        <div className="inline-flex h-10 rounded-md border border-border bg-muted p-1" role="group" aria-label="Reporting period">
          {periods.map((period) => (
            <button
              key={period}
              type="button"
              aria-pressed={filters.period === period}
              className="rounded px-3 text-sm font-semibold text-muted-foreground data-[active=true]:bg-panel data-[active=true]:text-foreground"
              data-active={filters.period === period}
              onClick={() => onFiltersChange({ ...filters, period })}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
