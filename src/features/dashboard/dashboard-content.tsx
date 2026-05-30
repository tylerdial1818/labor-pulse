"use client";

import { useMemo, useState } from "react";
import { DashboardFiltersPanel } from "@/components/forms/dashboard-filters";
import { EmptyState } from "@/components/states/empty-state";
import { KpiCard } from "@/components/ui/kpi-card";
import { AccountsTable } from "@/features/dashboard/accounts-table";
import { ChartPanels } from "@/features/dashboard/chart-panels";
import { revenueGrowth, sumRevenue, targetAttainment, weightedWinRate } from "@/lib/analytics/metrics";
import { filterAccounts, filterRevenueByPeriod, filterSegmentPerformance } from "@/lib/data-processing/dashboard-filters";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type { DashboardData, DashboardFilters } from "@/types/analytics";

const initialFilters: DashboardFilters = {
  segment: "All",
  region: "All",
  period: "12m"
};

export function DashboardContent({ data }: { data: DashboardData }) {
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);

  const filtered = useMemo(() => {
    const revenueSeries = filterRevenueByPeriod(data.revenueSeries, filters.period);
    const segmentPerformance = filterSegmentPerformance(data.segmentPerformance, filters);
    const accounts = filterAccounts(data.accounts, filters);

    return {
      revenueSeries,
      segmentPerformance,
      accounts,
      kpis: {
        revenue: sumRevenue(revenueSeries),
        growth: revenueGrowth(revenueSeries),
        attainment: targetAttainment(revenueSeries),
        weightedWinRate: weightedWinRate(segmentPerformance)
      }
    };
  }, [data, filters]);

  return (
    <>
      <DashboardFiltersPanel filters={filters} onFiltersChange={setFilters} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Key performance indicators">
        <KpiCard label="Revenue" value={formatCurrency(filtered.kpis.revenue)} delta="+18.5%" trend="up" description="Recognized revenue in the selected period." />
        <KpiCard label="Growth" value={formatPercent(filtered.kpis.growth)} delta="+4.2 pts" trend="up" description="Revenue growth from first to latest selected period." />
        <KpiCard label="Target attainment" value={formatPercent(filtered.kpis.attainment)} delta="+7.1%" trend="up" description="Actual revenue divided by selected-period target." />
        <KpiCard label="Weighted win rate" value={formatPercent(filtered.kpis.weightedWinRate)} delta="-1.8 pts" trend="down" description="Pipeline-weighted conversion for selected segment." />
      </section>
      <ChartPanels revenueSeries={filtered.revenueSeries} segmentPerformance={filtered.segmentPerformance} />
      {filtered.accounts.length > 0 ? (
        <AccountsTable rows={filtered.accounts} />
      ) : (
        <EmptyState title="No accounts match the selected filters" description="Try widening the segment, region, or reporting period to restore the account table." />
      )}
      <p className="text-xs text-muted-foreground">Last refreshed {new Date(data.updatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
    </>
  );
}
