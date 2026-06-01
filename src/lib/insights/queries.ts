import "server-only";

import { INSIGHT_SOURCES } from "@/lib/insights/sources";
import { readInsightStore } from "@/lib/insights/store";
import type { InsightCategory, InsightFeedResponse, InsightQuery, InsightSort } from "@/lib/insights/types";

const categories = new Set<InsightCategory>(["official_data", "central_bank", "hiring_lab", "research", "manual"]);
const sorts = new Set<InsightSort>(["newest", "oldest", "source"]);

export function normalizeInsightQuery(input: InsightQuery): Required<Pick<InsightQuery, "tags" | "sort">> & {
  category: InsightCategory | null;
  since: string | null;
  limit: number;
} {
  const limit = Math.min(Math.max(input.limit ?? 25, 1), 100);
  const tags = Array.from(new Set((input.tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean)));
  const since = input.since && !Number.isNaN(new Date(input.since).getTime()) ? input.since.slice(0, 10) : null;
  const sort = input.sort && sorts.has(input.sort) ? input.sort : "newest";
  const category = input.category && categories.has(input.category) ? input.category : null;

  return { category, tags, since, limit, sort };
}

export async function getInsightFeed(query: InsightQuery = {}): Promise<InsightFeedResponse> {
  const filters = normalizeInsightQuery(query);
  const store = await readInsightStore();
  const sinceTime = filters.since ? new Date(`${filters.since}T00:00:00.000Z`).getTime() : null;

  let insights = store.insights.filter((insight) => {
    if (filters.category && insight.category !== filters.category) return false;

    if (filters.tags.length > 0) {
      const insightTags = new Set(insight.tags.map((tag) => tag.toLowerCase()));
      if (!filters.tags.every((tag) => insightTags.has(tag))) return false;
    }

    if (sinceTime !== null) {
      const candidateDate = insight.publishedAt ?? insight.updatedAt;
      if (new Date(candidateDate).getTime() < sinceTime) return false;
    }

    return true;
  });

  insights = insights.sort((a, b) => {
    if (filters.sort === "source") {
      return a.sourceName.localeCompare(b.sourceName) || b.updatedAt.localeCompare(a.updatedAt);
    }

    const comparison = (a.publishedAt ?? a.updatedAt).localeCompare(b.publishedAt ?? b.updatedAt);
    return filters.sort === "oldest" ? comparison : -comparison;
  });

  return {
    insights: insights.slice(0, filters.limit),
    count: insights.length,
    generatedAt: new Date().toISOString(),
    filters
  };
}

export function getInsightFilterOptions() {
  const tags = Array.from(new Set(INSIGHT_SOURCES.flatMap((source) => source.tags))).sort();
  return {
    categories: Array.from(categories),
    tags,
    sources: INSIGHT_SOURCES
  };
}
