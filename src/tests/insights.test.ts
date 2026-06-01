import { describe, expect, it } from "vitest";

import { buildSeedInsights } from "@/lib/insights/seed";
import { INSIGHT_SOURCES } from "@/lib/insights/sources";

describe("insights source registry", () => {
  it("defines the required qualitative insight sources", () => {
    expect(INSIGHT_SOURCES.map((source) => source.id)).toEqual([
      "bls_employment_situation",
      "bls_jolts",
      "beige_book",
      "indeed_hiring_lab",
      "brookings_hamilton_project",
      "nber_labor_studies",
      "linkedin_manual"
    ]);
  });

  it("keeps LinkedIn manual and other sources fetchable by public HTML", () => {
    const linkedin = INSIGHT_SOURCES.find((source) => source.id === "linkedin_manual");
    const automated = INSIGHT_SOURCES.filter((source) => source.id !== "linkedin_manual");

    expect(linkedin).toMatchObject({ access: "manual" });
    expect(automated.every((source) => source.access === "public_html" && Boolean(source.fetchUrl))).toBe(true);
  });
});

describe("insights seed data", () => {
  it("builds deterministic example summaries for every source", () => {
    const seed = buildSeedInsights();

    expect(seed).toHaveLength(INSIGHT_SOURCES.length);
    expect(seed.every((insight) => insight.id.startsWith("seed-"))).toBe(true);
    expect(seed.every((insight) => insight.summary.length > 40)).toBe(true);
    expect(seed.every((insight) => insight.keyTakeaways.length >= 2)).toBe(true);
  });
});
