import { describe, expect, it } from "vitest";

import {
  answerDegreePayoff,
  answerFindingAJob,
  answerGraduateUnderemployment,
  answerHours,
  answerJobMarketNow,
  answerLayoffs,
  answerMajors,
  answerPaychecks,
  answerRecessionRisk,
  answerUnderemploymentWithExperience,
  answerUnemploymentMeasures,
  describeChange,
  valueWithUnit,
  type CompositeSnapshot,
  type IndicatorSnapshot
} from "@/lib/questions/answers";
import { INDICATOR_EXPLANATIONS } from "@/lib/indicators/explanations";
import { COMPOSITE_DEFINITIONS } from "@/lib/composites/calculate";
import { TOPICS, questionHref, relatedQuestions } from "@/lib/questions/topics";

function indicator(overrides: Partial<IndicatorSnapshot> & Pick<IndicatorSnapshot, "id">): IndicatorSnapshot {
  return {
    currentValue: 4.3,
    currentValueFormatted: "4.3",
    unitLabel: "%",
    currentDate: "Apr 2026",
    delta: { value: 0.2, formatted: "+0.2 pp", periodLabel: "vs. year ago" },
    ...overrides
  };
}

function composite(id: string, value: number, label: string): CompositeSnapshot {
  return { id, currentValue: value, asOfDate: "2026-04-01", interpretation: { label } };
}

describe("value and change phrasing", () => {
  it("formats values with their units", () => {
    expect(valueWithUnit(indicator({ id: "UNRATE" }))).toBe("4.3%");
    expect(valueWithUnit(indicator({ id: "CES0500000003", currentValueFormatted: "$36.30", unitLabel: "/hr" }))).toBe("$36.30/hr");
    expect(valueWithUnit(indicator({ id: "ICSA", currentValueFormatted: "220", unitLabel: "K" }))).toBe("220K");
    expect(valueWithUnit(indicator({ id: "AWHAETP", currentValueFormatted: "34.2", unitLabel: "hrs" }))).toBe("34.2 hours");
  });

  it("describes rises, falls, flat values and missing comparisons", () => {
    expect(describeChange(indicator({ id: "UNRATE" }))).toBe("up 0.2 pp from a year earlier");
    expect(describeChange(indicator({ id: "ICSA", delta: { value: -12000, formatted: "-12K", periodLabel: "vs. 4 weeks ago" } }))).toBe(
      "down 12K from four weeks earlier"
    );
    expect(describeChange(indicator({ id: "AWHAETP", delta: { value: 0, formatted: "flat", periodLabel: "vs. year ago" } }))).toBe(
      "unchanged from a year earlier"
    );
    expect(describeChange(indicator({ id: "X", delta: { value: null, formatted: "not available", periodLabel: "vs. year ago" } }))).toBeNull();
  });
});

describe("jobs answers", () => {
  it("combines unemployment with the tightness reading", () => {
    const answer = answerJobMarketNow(indicator({ id: "UNRATE" }), composite("labor_tightness", 0.1, "Balanced"));
    expect(answer?.text).toBe(
      'The unemployment rate is 4.3%, up 0.2 pp from a year earlier. Our labor market tightness measure reads "Balanced": neither job seekers nor employers have a clear edge.'
    );
    expect(answer?.asOf).toBe("Apr 2026");
  });

  it("returns null without an unemployment value", () => {
    expect(answerJobMarketNow(undefined, undefined)).toBeNull();
    expect(answerJobMarketNow(indicator({ id: "UNRATE", currentValue: null }), undefined)).toBeNull();
  });

  it("follows the Sahm Rule interpretation bands", () => {
    expect(answerRecessionRisk(composite("sahm_rule", 0.62, "Recession signal"))?.text).toMatch(/^A warning is flashing\. The Sahm Rule reading is 0\.62/);
    expect(answerRecessionRisk(composite("sahm_rule", 0.27, "Caution"))?.text).toMatch(/^No recession signal so far\. The Sahm Rule reading is 0\.27, below the 0\.50/);
    expect(answerRecessionRisk(composite("sahm_rule", -0.1, "Normal"))?.text).toMatch(/^No recession signal\. The Sahm Rule reading is -0\.10/);
    expect(answerRecessionRisk(undefined)).toBeNull();
  });

  it("builds finding-a-job and layoffs answers from whatever inputs exist", () => {
    const openings = indicator({ id: "JTSJOL", currentValueFormatted: "7.2", unitLabel: "M", delta: { value: -1000, formatted: "-1.0M", periodLabel: "vs. year ago" } });
    expect(answerFindingAJob(openings, undefined, composite("labor_tightness", 0.8, "Tight"))?.text).toBe(
      'Employers list 7.2M job openings, down 1.0M from a year earlier. Overall the market reads "Tight": employers are competing for workers, so jobs are relatively easy to find.'
    );
    expect(answerFindingAJob(undefined, undefined, undefined)).toBeNull();
    expect(answerLayoffs(undefined, undefined, composite("labor_stress", 0.9, "Elevated stress"))?.text).toBe(
      'Our stress measure reads "Elevated stress": signs of layoffs and cut hours are running higher than usual.'
    );
    expect(answerLayoffs(undefined, undefined, undefined)).toBeNull();
  });

  it("compares the headline rate with U-6 only when both exist", () => {
    const u6 = indicator({ id: "U6RATE", currentValue: 7.9, currentValueFormatted: "7.9" });
    expect(answerUnemploymentMeasures(indicator({ id: "UNRATE" }), u6)?.text).toContain("is 4.3%. U-6");
    expect(answerUnemploymentMeasures(indicator({ id: "UNRATE" }), undefined)).toBeNull();
  });
});

describe("wages answers", () => {
  it("states nominal pay growth and hours", () => {
    const pay = indicator({ id: "CES0500000003", currentValueFormatted: "$36.30", unitLabel: "/hr", delta: { value: 1.3, formatted: "+3.8%", periodLabel: "vs. year ago" } });
    expect(answerPaychecks(pay)?.text).toBe(
      "Average hourly pay for private-sector workers is $36.30/hr, up 3.8% from a year earlier. That is before adjusting for inflation."
    );
    const hours = indicator({ id: "AWHAETP", currentValueFormatted: "34.2", unitLabel: "hrs", delta: { value: -0.1, formatted: "-0.1 hrs", periodLabel: "vs. year ago" } });
    expect(answerHours(hours)?.text).toBe("The average private-sector workweek is 34.2 hours, down 0.1 hours from a year earlier.");
  });
});

describe("education answers", () => {
  const majors = [
    { name: "Nursing", underemploymentRate: 10.2, wagePremium: 15000 },
    { name: "Criminal Justice", underemploymentRate: 72.4, wagePremium: 4000 },
    { name: "Economics", underemploymentRate: 30.1, wagePremium: 22000 }
  ];

  it("states the recent graduate rate", () => {
    expect(answerGraduateUnderemployment(41.5, "2026-03-31")?.text).toBe(
      "41.5% of employed recent college graduates work in jobs that do not typically require a degree."
    );
    expect(answerGraduateUnderemployment(null, null)).toBeNull();
  });

  it("only claims fading when all graduates are lower than recent graduates", () => {
    expect(answerUnderemploymentWithExperience(41.5, 33.4, null)?.text).toMatch(/^Partly\./);
    expect(answerUnderemploymentWithExperience(30, 33.4, null)?.text).toMatch(/^Not clearly\./);
  });

  it("names the lowest and highest majors", () => {
    expect(answerMajors(majors, null)?.text).toBe(
      "It varies widely. Among the 3 majors tracked, recent graduates in Nursing are the least likely to be underemployed (10.2%) and those in Criminal Justice the most likely (72.4%)."
    );
    expect(answerMajors(majors.slice(0, 1), null)).toBeNull();
  });

  it("counts positive premiums and reports the range only when all are positive", () => {
    expect(answerDegreePayoff(majors, null)?.text).toBe(
      "In all 3 majors tracked, graduates working in college-level jobs earn more than graduates of the same major in jobs that do not need a degree. The gap in median annual pay ranges from $4,000 to $22,000."
    );
    const mixed = [...majors, { name: "Other", underemploymentRate: 50, wagePremium: -500 }];
    expect(answerDegreePayoff(mixed, null)?.text).toBe(
      "In 3 of 4 majors tracked, graduates working in college-level jobs earn more than graduates of the same major in jobs that do not need a degree."
    );
    expect(answerDegreePayoff([], null)).toBeNull();
  });
});

describe("topics", () => {
  it("has unique question ids within each topic and featured questions for the home page", () => {
    for (const topic of TOPICS) {
      const ids = topic.questions.map((item) => item.id);
      expect(new Set(ids).size, topic.id).toBe(ids.length);
      expect(topic.questions.some((item) => item.featured), topic.id).toBe(true);
    }
  });

  it("links to question anchors except on hubs that do not anchor them yet", () => {
    const jobs = TOPICS.find((topic) => topic.id === "jobs")!;
    const ai = TOPICS.find((topic) => topic.id === "ai")!;
    expect(questionHref(jobs, "recession")).toBe("/jobs#recession");
    expect(questionHref(ai, "exposure")).toBe("/ai-impact#exposure");
    expect(questionHref({ ...ai, anchoredQuestions: false }, "exposure")).toBe("/ai-impact");
  });
});

describe("related questions", () => {
  it("links every indicator and composite to at least one existing question", () => {
    const ids = [...Object.keys(INDICATOR_EXPLANATIONS), ...COMPOSITE_DEFINITIONS.map((definition) => definition.id)];
    for (const id of ids) expect(relatedQuestions(id).length, id).toBeGreaterThan(0);
  });

  it("returns hrefs to the topic hub anchors", () => {
    expect(relatedQuestions("sahm_rule").map((item) => item.href)).toEqual(["/jobs#recession"]);
    expect(relatedQuestions("UNKNOWN")).toEqual([]);
  });
});
