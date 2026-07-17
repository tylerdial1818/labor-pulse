import { INSIGHT_SOURCES } from "@/lib/insights/sources";
import type { InsightSourceId, InsightSummary } from "@/lib/insights/types";

const SEED_UPDATED_AT = "2026-05-30T08:00:00.000Z";

const sourceProfiles: Record<string, Pick<InsightSummary, "title" | "publishedAt" | "summary" | "keyTakeaways">> = {
  bls_employment_situation: {
    title: "BLS Employment Situation",
    publishedAt: null,
    summary:
      "The Employment Situation is the main monthly release for payroll employment, unemployment, labor force participation, and earnings. Labor Pulse uses it to anchor the dashboard's current conditions measures.",
    keyTakeaways: ["Read payroll growth alongside unemployment and participation.", "Expect earlier monthly estimates to be revised as BLS receives more complete reports."]
  },
  bls_jolts: {
    title: "BLS Job Openings and Labor Turnover Survey",
    publishedAt: null,
    summary:
      "JOLTS provides a monthly view of job openings, hiring, quits, and layoffs. Labor Pulse uses it to examine labor demand and the balance between worker confidence and employer caution.",
    keyTakeaways: ["Openings provide context on employer demand.", "Quits and layoffs help distinguish worker movement from employer retrenchment."]
  },
  beige_book: {
    title: "Federal Reserve Beige Book",
    publishedAt: null,
    summary:
      "The Beige Book gathers reports on business conditions across Federal Reserve districts. Its labor market sections add regional context on hiring, staffing, and wage pressure.",
    keyTakeaways: ["Regional reports can help explain differences within national trends.", "Use the Beige Book as context rather than as a statistical series."]
  },
  indeed_hiring_lab: {
    title: "Indeed Hiring Lab",
    publishedAt: null,
    summary:
      "Indeed Hiring Lab publishes research on job postings, hiring demand, wages, and work arrangements. Its platform data can provide timely context before official releases become available.",
    keyTakeaways: ["Use posting trends as evidence of employer interest, not completed hiring.", "Describe the limits of platform coverage when citing this research."]
  },
  brookings_hamilton_project: {
    title: "The Hamilton Project",
    publishedAt: null,
    summary:
      "The Hamilton Project publishes policy research on employment, wages, economic opportunity, and productivity. Labor Pulse follows this work for policy framing and literature context.",
    keyTakeaways: ["Use this source for policy analysis rather than current conditions monitoring.", "Connect research findings to the relevant source indicators before drawing conclusions."]
  },
  nber_labor_studies: {
    title: "NBER Labor Studies",
    publishedAt: null,
    summary:
      "The NBER Labor Studies program covers employment, labor supply, wage setting, and related policy questions. Its working papers can deepen interpretation of the public indicators tracked here.",
    keyTakeaways: ["Use working papers as research evidence rather than current conditions measures.", "Check publication status before describing a finding as settled evidence."]
  },
  linkedin_manual: {
    title: "LinkedIn Economic Graph",
    publishedAt: null,
    summary:
      "LinkedIn Economic Graph reports cover skills, hiring, and job transitions within the platform's professional network. Labor Pulse reviews public reports when they offer useful context for workforce research.",
    keyTakeaways: ["Treat platform findings as a view of LinkedIn members rather than the full labor force.", "Cite the specific public report used in an analysis."]
  }
};

export function getSourceProfileCopy(sourceId: InsightSourceId) {
  return sourceProfiles[sourceId];
}

export function buildSeedInsights(): InsightSummary[] {
  return INSIGHT_SOURCES.map((source) => {
    const profile = sourceProfiles[source.id];

    return {
      id: `seed-${source.id}`,
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
      title: profile.title,
      url: source.url,
      publishedAt: profile.publishedAt,
      updatedAt: SEED_UPDATED_AT,
      tags: source.tags,
      summary: profile.summary,
      keyTakeaways: profile.keyTakeaways,
      sourceType: source.access === "manual" ? "manual" : "seed"
    };
  });
}
