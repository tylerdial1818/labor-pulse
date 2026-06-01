import { INSIGHT_SOURCES } from "@/lib/insights/sources";
import type { InsightSummary } from "@/lib/insights/types";

const SEED_UPDATED_AT = "2026-05-30T08:00:00.000Z";

const seedText: Record<string, Pick<InsightSummary, "title" | "publishedAt" | "summary" | "keyTakeaways">> = {
  bls_employment_situation: {
    title: "Employment Situation qualitative watch",
    publishedAt: "2026-05-02",
    summary:
      "The Employment Situation release is tracked for the balance between payroll growth, unemployment, participation, and wage pressure. The seed note keeps the feed usable until live parsing is configured.",
    keyTakeaways: ["Use this source for official monthly labor market direction.", "Pair headline payroll signals with participation and wage context."]
  },
  bls_jolts: {
    title: "JOLTS labor demand watch",
    publishedAt: "2026-05-06",
    summary:
      "JOLTS is tracked as a slower but useful view into labor demand, churn, and employer caution. The seed note flags openings, quits, and layoffs as the core qualitative signals.",
    keyTakeaways: ["Openings frame employer demand.", "Quits and layoffs help separate worker confidence from employer retrenchment."]
  },
  beige_book: {
    title: "Beige Book regional labor conditions watch",
    publishedAt: "2026-04-23",
    summary:
      "The Beige Book is tracked for regional anecdotes about hiring difficulty, wage pressure, and sector-specific cooling or resilience. Treat it as qualitative context, not a statistical series.",
    keyTakeaways: ["Regional anecdotes can explain divergences in national indicators.", "Use Beige Book language to qualify, not replace, measured data."]
  },
  indeed_hiring_lab: {
    title: "Indeed Hiring Lab posting and hiring context",
    publishedAt: "2026-05-15",
    summary:
      "Indeed Hiring Lab analysis is tracked for timely hiring and job-posting context. It can surface leading signals before official releases, with clear caveats around platform coverage.",
    keyTakeaways: ["Useful for near-term hiring intent context.", "Platform coverage should be described whenever citing this source."]
  },
  brookings_hamilton_project: {
    title: "Hamilton Project labor policy research watch",
    publishedAt: "2026-05-10",
    summary:
      "Hamilton Project research is tracked for policy interpretation around employment, wages, opportunity, and productivity. These notes are best used for framing and literature context.",
    keyTakeaways: ["Use for policy framing rather than high-frequency monitoring.", "Connect research findings back to the deterministic dashboard indicators."]
  },
  nber_labor_studies: {
    title: "NBER Labor Studies research watch",
    publishedAt: "2026-05-12",
    summary:
      "NBER Labor Studies is tracked for academic research that can deepen interpretation of labor supply, wage setting, employment, and technology exposure. Working papers require careful caveating.",
    keyTakeaways: ["Use as research context, not a current conditions measure.", "Avoid presenting working-paper findings as settled consensus."]
  },
  linkedin_manual: {
    title: "LinkedIn workforce reports manual watch",
    publishedAt: "2026-05-01",
    summary:
      "LinkedIn workforce content is tracked manually until an approved public feed or repeatable import is available. The feed preserves the source slot without scraping gated or unstable content.",
    keyTakeaways: ["Manual review protects against brittle scraping.", "Useful for skills and transition context when a public report is approved."]
  }
};

export function buildSeedInsights(): InsightSummary[] {
  return INSIGHT_SOURCES.map((source) => {
    const seed = seedText[source.id];

    return {
      id: `seed-${source.id}`,
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
      title: seed.title,
      url: source.url,
      publishedAt: seed.publishedAt,
      updatedAt: SEED_UPDATED_AT,
      tags: source.tags,
      summary: seed.summary,
      keyTakeaways: seed.keyTakeaways,
      sourceType: source.access === "manual" ? "manual" : "seed"
    };
  });
}
