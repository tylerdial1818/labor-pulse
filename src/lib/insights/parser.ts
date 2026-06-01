import "server-only";

import type { InsightSource, RawInsight } from "@/lib/insights/types";

const MAX_TEXT_LENGTH = 5000;

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(html: string) {
  return normalizeWhitespace(
    decodeEntities(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
        .replace(/<[^>]+>/g, " ")
    )
  );
}

function extractTitle(html: string, fallback: string) {
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const title = ogTitle ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return normalizeWhitespace(decodeEntities(title ?? fallback));
}

function extractDescription(html: string) {
  const description =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1];

  return description ? normalizeWhitespace(decodeEntities(description)) : null;
}

function extractPublishedAt(html: string) {
  const datetime =
    html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+name=["']date["'][^>]+content=["']([^"']+)["']/i)?.[1];

  if (!datetime) return null;

  const parsed = new Date(datetime);
  if (Number.isNaN(parsed.getTime())) return datetime.slice(0, 10);
  return parsed.toISOString().slice(0, 10);
}

function buildInsightId(source: InsightSource, title: string, publishedAt: string | null) {
  const slug = `${title}-${publishedAt ?? "undated"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);

  return `${source.id}-${slug || "latest"}`;
}

export function parseInsightHtml(source: InsightSource, html: string, fetchedAt = new Date().toISOString()): RawInsight {
  const title = extractTitle(html, source.name);
  const description = extractDescription(html);
  const text = stripHtml(html);
  const contentText = normalizeWhitespace([description, text].filter(Boolean).join(" ")).slice(0, MAX_TEXT_LENGTH);
  const publishedAt = extractPublishedAt(html);

  return {
    id: buildInsightId(source, title, publishedAt),
    sourceId: source.id,
    sourceName: source.name,
    category: source.category,
    title,
    url: source.url,
    publishedAt,
    fetchedAt,
    tags: source.tags,
    contentText,
    rawSnippet: contentText.slice(0, 700)
  };
}

export async function fetchRawInsight(source: InsightSource): Promise<RawInsight> {
  if (!source.fetchUrl) {
    throw new Error(`${source.name} is configured for manual review only.`);
  }

  const response = await fetch(source.fetchUrl, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "LaborPulse/1.0 qualitative insights monitor"
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`${source.name} returned HTTP ${response.status}.`);
  }

  const html = await response.text();
  return parseInsightHtml(source, html);
}
