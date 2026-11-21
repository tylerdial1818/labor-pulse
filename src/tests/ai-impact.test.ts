import { describe, expect, it } from "vitest";

import { formatSourceDate } from "@/components/ai-impact/format";
import { AI_CHAIN, EVIDENCE_NO_EFFECT, EVIDENCE_SLOWDOWN } from "@/lib/ai-impact/content";
import { exposureDistribution, filterExposureScores } from "@/lib/ai-impact/exposure";
import { splitFeatured } from "@/lib/ai-impact/featured";
import { LANDMARK_PAPERS, SCORECARD } from "@/lib/ai-impact/papers";
import { AI_SIGNALS, quarterLabel, summarizeSignal } from "@/lib/ai-impact/signals";
import { getGlossaryTerm } from "@/lib/glossary/terms";
import type { AiExposureScore } from "@/types/v15";

const signal = (id: string) => {
  const found = AI_SIGNALS.find((item) => item.id === id);
  if (!found) throw new Error(id);
  return found;
};

describe("AI Impact signals", () => {
  it("labels quarters from FRED's first-of-quarter dates", () => {
    expect(quarterLabel("2026-07-01")).toBe("Q3 2026");
    expect(quarterLabel("2026-01-01")).toBe("Q1 2026");
  });

  it("reads percent series as levels and compares with four quarters earlier", () => {
    const observations = ["2025-04-01", "2025-07-01", "2025-10-01", "2026-01-01", "2026-04-01", "2026-07-01"].map((date, index) => ({
      date,
      value: [35, 37.36, 40.65, 42.84, 45.2, 40.55][index] ?? null
    }));
    const summary = summarizeSignal(signal("genai_work"), observations);
    expect(summary.headline).toBe(40.55);
    expect(summary.yearAgoHeadline).toBe(37.36);
    expect(summary.periodLabel).toBe("Q3 2026");
  });

  it("reads index series as four-quarter growth and drops missing values", () => {
    const observations = [
      { date: "2025-01-01", value: 100 },
      { date: "2025-04-01", value: 101 },
      { date: "2025-07-01", value: null },
      { date: "2025-10-01", value: 102 },
      { date: "2026-01-01", value: 103 },
      { date: "2026-04-01", value: 104 },
      { date: "2026-07-01", value: 106.05 }
    ];
    const summary = summarizeSignal(signal("productivity"), observations);
    // Missing Q3 2025 is dropped, so four observations back from Q3 2026 is Q2 2025 (101).
    expect(summary.headline).toBeCloseTo(5, 6);
    expect(summary.latest?.date).toBe("2026-07-01");
  });

  it("reports an empty series as unavailable", () => {
    const summary = summarizeSignal(signal("labor_share"), []);
    expect(summary.available).toBe(false);
    expect(summary.headline).toBeNull();
  });
});

describe("AI Impact exposure lookup", () => {
  const scores: AiExposureScore[] = [
    { occupationSocCode: "15-1252.00", occupationTitle: "Software Developers", exposureScore: 0.82, exposureCategory: "high" },
    { occupationSocCode: "13-2011.00", occupationTitle: "Accountants and Auditors", exposureScore: 0.6, exposureCategory: "moderate" },
    { occupationSocCode: "29-1141.00", occupationTitle: "Registered Nurses", exposureScore: 0.29, exposureCategory: "low" }
  ];

  it("matches titles case-insensitively and SOC codes by prefix", () => {
    expect(filterExposureScores(scores, "NURSE").map((s) => s.occupationTitle)).toEqual(["Registered Nurses"]);
    expect(filterExposureScores(scores, "13-").map((s) => s.occupationTitle)).toEqual(["Accountants and Auditors"]);
    expect(filterExposureScores(scores, "  ")).toHaveLength(3);
  });

  it("counts occupations in each band", () => {
    expect(exposureDistribution(scores)).toEqual({ total: 3, high: 1, moderate: 1, low: 1 });
  });
});

describe("AI Impact featured research", () => {
  const item = (id: string, published: string, featuredOn: string, featuredUntil: string) => ({
    id,
    title: id,
    authors: "A",
    publisher: "P",
    published,
    url: `https://example.org/${id}`,
    kind: "study",
    data_access: "public",
    summary: "S",
    featured_on: featuredOn,
    featured_until: featuredUntil,
    tags: []
  });

  it("splits active picks from the library and sorts newest first", () => {
    const result = splitFeatured(
      {
        schema_version: 1,
        updated: "2026-11-21",
        items: [item("old", "2026-01-01", "2026-02-01", "2026-05-01"), item("a", "2026-08-01", "2026-11-21", "2027-02-19"), item("b", "2026-10-01", "2026-11-21", "2027-02-19")]
      },
      "2026-11-21"
    );
    expect(result.active.map((i) => i.id)).toEqual(["b", "a"]);
    expect(result.library.map((i) => i.id)).toEqual(["old"]);
    expect(result.available).toBe(true);
  });

  it("treats an invalid file as unavailable instead of throwing", () => {
    expect(splitFeatured({ schema_version: 2 }, "2026-11-21").available).toBe(false);
  });
});

describe("AI Impact content integrity", () => {
  it("ties every scorecard row to a landmark paper and every paper to a chain step", () => {
    const paperIds = new Set(LANDMARK_PAPERS.map((paper) => paper.id));
    const steps = new Set(AI_CHAIN.map((step) => step.id));
    for (const row of SCORECARD) {
      expect(paperIds.has(row.paperId)).toBe(true);
      expect(Boolean(row.signalId) || Boolean(row.evidence)).toBe(true);
    }
    for (const paper of LANDMARK_PAPERS) expect(steps.has(paper.chainStep)).toBe(true);
  });

  it("gives every study a dated, linked source", () => {
    for (const study of [...EVIDENCE_SLOWDOWN, ...EVIDENCE_NO_EFFECT]) {
      expect(study.url).toMatch(/^https:\/\//);
      expect(study.date).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
    }
  });

  it("uses glossary terms that exist", () => {
    for (const id of ["ai-exposure", "observed-exposure", "augmentation-vs-automation", "early-career-worker", "job-finding-rate", "total-factor-productivity", "labor-share", "difference-in-differences"]) {
      expect(getGlossaryTerm(id), id).toBeDefined();
    }
  });

  it("formats day and month-only source dates", () => {
    expect(formatSourceDate("2026-08-12")).toBe("Aug 12, 2026");
    expect(formatSourceDate("2026-05")).toBe("May 2026");
  });
});
