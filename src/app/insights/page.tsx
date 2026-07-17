import type { Metadata } from "next";

import { TopBar } from "@/components/layout/top-bar";
import { InsightFeed } from "@/components/insights/insight-feed";
import { InsightFilters } from "@/components/insights/insight-filters";
import { getInsightFeed } from "@/lib/insights/queries";
import type { InsightCategory, InsightSort } from "@/lib/insights/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research Monitor",
  description: "A curated view of recurring labor market releases, research programs, and source updates."
};

type InsightsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function readTags(searchParams: Record<string, string | string[] | undefined>) {
  const value = searchParams.tags;
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.flatMap((item) => item.split(",")).map((tag) => tag.trim()).filter(Boolean);
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const params = (await searchParams) ?? {};
  const data = await getInsightFeed({
    category: readParam(params, "category") as InsightCategory | undefined,
    tags: readTags(params),
    since: readParam(params, "since"),
    limit: readParam(params, "limit") ? Number(readParam(params, "limit")) : undefined,
    sort: readParam(params, "sort") as InsightSort | undefined
  });

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Recurring research sources</p>
            <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">Research Monitor</h1>
            <p className="mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
              A curated view of the official releases, research programs, and labor market sources that help explain what the indicators alone cannot.
            </p>
          </div>
          <p className="text-sm text-sub">{data.count} matching sources and updates</p>
        </div>
        <InsightFilters filters={data.filters} />
        <div className="mt-6">
          <InsightFeed insights={data.insights} />
        </div>
      </main>
    </div>
  );
}
