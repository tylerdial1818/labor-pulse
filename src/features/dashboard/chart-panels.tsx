"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RevenuePoint, SegmentPerformance } from "@/types/analytics";

const RevenueChart = dynamic(() => import("@/components/charts/revenue-chart").then((mod) => mod.RevenueChart), {
  ssr: false,
  loading: () => <ChartSkeleton title="Revenue trajectory" />
});

const SegmentChart = dynamic(() => import("@/components/charts/segment-chart").then((mod) => mod.SegmentChart), {
  ssr: false,
  loading: () => <ChartSkeleton title="Segment performance" />
});

export function ChartPanels({
  revenueSeries,
  segmentPerformance
}: {
  revenueSeries: RevenuePoint[];
  segmentPerformance: SegmentPerformance[];
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <RevenueChart data={revenueSeries} />
      <SegmentChart data={segmentPerformance} />
    </section>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <Card className="min-h-[360px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 animate-pulse rounded-md bg-muted" />
      </CardContent>
    </Card>
  );
}
