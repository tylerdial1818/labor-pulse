export type InsightCategory = "official_data" | "central_bank" | "hiring_lab" | "research" | "manual";

export type InsightSourceId =
  | "bls_employment_situation"
  | "bls_jolts"
  | "beige_book"
  | "indeed_hiring_lab"
  | "brookings_hamilton_project"
  | "nber_labor_studies"
  | "linkedin_manual";

export type InsightSource = {
  id: InsightSourceId;
  name: string;
  category: InsightCategory;
  url: string;
  fetchUrl?: string;
  tags: string[];
  cadence: string;
  access: "public_html" | "manual";
  description: string;
};

export type RawInsight = {
  id: string;
  sourceId: InsightSourceId;
  sourceName: string;
  category: InsightCategory;
  title: string;
  url: string;
  publishedAt: string | null;
  fetchedAt: string;
  tags: string[];
  contentText: string;
  rawSnippet: string;
};

export type InsightSummary = {
  id: string;
  sourceId: InsightSourceId;
  sourceName: string;
  category: InsightCategory;
  title: string;
  url: string;
  publishedAt: string | null;
  updatedAt: string;
  tags: string[];
  summary: string;
  keyTakeaways: string[];
  sourceType: "live" | "seed" | "manual";
};

export type InsightRefreshStatus = "success" | "partial" | "failed" | "skipped";

export type InsightRefreshResult = {
  sourceId: InsightSourceId;
  sourceName: string;
  status: InsightRefreshStatus;
  message: string;
  fetchedAt: string;
  summaryId: string | null;
};

export type InsightSort = "newest" | "oldest" | "source";

export type InsightQuery = {
  category?: InsightCategory;
  tags?: string[];
  since?: string;
  limit?: number;
  sort?: InsightSort;
};

export type InsightFeedResponse = {
  insights: InsightSummary[];
  count: number;
  generatedAt: string;
  filters: Required<Pick<InsightQuery, "tags" | "sort">> & {
    category: InsightCategory | null;
    since: string | null;
    limit: number;
  };
};
