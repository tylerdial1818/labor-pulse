// Featured AI-and-labor research, curated in the labor-pulse-research repo.
//
// `ai_impact/featured.json` in that repo is the editorial list. A weekly
// GitHub Action there collects candidate papers from open feeds, a monthly
// curation pass picks the best ones, and merging that PR is the editorial
// review. The site reads the file from the repo's main branch with an hourly
// cache, so a merged update appears without a deploy (same pattern as
// src/lib/research/notes.ts).

import { z } from "zod";

import { RESEARCH_REPO } from "@/lib/research/notes";

const FEATURED_REF = process.env.RESEARCH_NOTES_REF ?? "main";
export const FEATURED_URL = `https://raw.githubusercontent.com/${RESEARCH_REPO}/${FEATURED_REF}/ai_impact/featured.json`;
export const FEATURED_REVALIDATE_SECONDS = 3600;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const featuredItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  authors: z.string().min(1),
  publisher: z.string().min(1),
  published: isoDate,
  url: z.string().url(),
  kind: z.enum(["study", "tracker", "report", "survey"]),
  data_access: z.enum(["public", "restricted"]),
  summary: z.string().min(1),
  featured_on: isoDate,
  featured_until: isoDate,
  tags: z.array(z.string()).default([])
});

const featuredFileSchema = z.object({
  schema_version: z.literal(1),
  updated: isoDate,
  items: z.array(featuredItemSchema)
});

export type FeaturedItem = z.infer<typeof featuredItemSchema>;

export type FeaturedResearch = {
  updated: string | null;
  /** Currently featured, newest publication first. */
  active: FeaturedItem[];
  /** Items whose feature window has ended, kept as a permanent library. */
  library: FeaturedItem[];
  available: boolean;
};

const EMPTY: FeaturedResearch = { updated: null, active: [], library: [], available: false };

/** Split a featured.json payload into active and library items as of `today` (YYYY-MM-DD). */
export function splitFeatured(payload: unknown, today: string): FeaturedResearch {
  const parsed = featuredFileSchema.safeParse(payload);
  if (!parsed.success) return EMPTY;

  const byNewest = [...parsed.data.items].sort((a, b) => b.published.localeCompare(a.published));
  return {
    updated: parsed.data.updated,
    active: byNewest.filter((item) => item.featured_on <= today && item.featured_until >= today),
    library: byNewest.filter((item) => item.featured_until < today),
    available: true
  };
}

export async function getFeaturedResearch(
  fetcher: (url: string) => Promise<Response> = (url) => fetch(url, { next: { revalidate: FEATURED_REVALIDATE_SECONDS } }),
  today = new Date().toISOString().slice(0, 10)
): Promise<FeaturedResearch> {
  try {
    const response = await fetcher(FEATURED_URL);
    if (!response.ok) return EMPTY;
    return splitFeatured(await response.json(), today);
  } catch {
    return EMPTY;
  }
}
