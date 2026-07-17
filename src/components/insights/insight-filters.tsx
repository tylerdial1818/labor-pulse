import { getInsightFilterOptions } from "@/lib/insights/queries";
import type { InsightFeedResponse } from "@/lib/insights/types";

type InsightFiltersProps = {
  filters: InsightFeedResponse["filters"];
};

function buildHref(next: Record<string, string | null>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(next)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `/insights?${query}` : "/insights";
}

export function InsightFilters({ filters }: InsightFiltersProps) {
  const options = getInsightFilterOptions();
  const current = {
    category: filters.category,
    tags: filters.tags.join(","),
    since: filters.since,
    sort: filters.sort === "newest" ? null : filters.sort,
    limit: filters.limit === 25 ? null : String(filters.limit)
  };

  return (
    <aside className="border-y border-rule py-4" aria-label="Research monitor filters">
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={buildHref({ ...current, category: null })}
          className="border border-rule px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-navy"
        >
          All
        </a>
        {options.categories.map((category) => (
          <a
            key={category}
            href={buildHref({ ...current, category })}
            className="border border-rule px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-sub"
          >
            {category === "manual" ? "curated sources" : category.replace(/_/g, " ")}
          </a>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-sub">
        <span className="font-semibold uppercase tracking-[0.12em]">Topics</span>
        {options.tags.slice(0, 12).map((tag) => (
          <a
            key={tag}
            href={buildHref({ ...current, tags: tag })}
            className="border border-rule bg-[var(--lp-navy-tint)] px-2.5 py-1 font-semibold text-navy transition-colors hover:border-navy hover:bg-paper"
          >
            {tag.replace(/_/g, " ")}
          </a>
        ))}
      </div>
    </aside>
  );
}
