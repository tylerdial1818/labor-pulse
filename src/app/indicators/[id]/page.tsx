import { notFound } from "next/navigation";

import { TopBar } from "@/components/layout/top-bar";
import { IndicatorDetailContent } from "@/features/indicators/indicator-detail-content";
import { getIndicatorDetail } from "@/lib/db/queries";
import { getOrCreateDefinition } from "@/lib/llm/definitions";
import { getMetricSegmentBreakdownsData } from "@/server/segment-data";

export default async function IndicatorDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ breakdown?: string; state?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const detail = await getIndicatorDetail(id);

  if (!detail) {
    notFound();
  }

  const definition = await getOrCreateDefinition(detail.series);
  const breakdowns = await getMetricSegmentBreakdownsData({ seriesId: id, state: query.state });

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Indicator detail</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">{detail.series.shortTitle}</h1>
        <p className="mb-8 mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
          {detail.series.title} · {detail.series.source} · Data through {detail.observations.at(-1)?.date ?? "not available"}
        </p>
        <IndicatorDetailContent detail={detail} definition={definition} breakdowns={breakdowns} />
      </main>
    </div>
  );
}
