import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getCommonOnlineMajorsView,
  getCurrentHeadlineRates,
  getHistoricalContext,
  getMajorProfile,
  getMajorRanking,
  getWagePremiumScatter
} from "@/lib/underemployment/calculate";

describe("underemployment analytics", () => {
  it("returns current headline rates from the latest NY Fed seed point", async () => {
    await expect(getCurrentHeadlineRates()).resolves.toEqual({
      recentGrads: 41.5,
      allGrads: 33.4,
      asOfDate: "2026-03-31"
    });
  });

  it("ranks majors and computes wage premium", async () => {
    const ranking = await getMajorRanking("recent_grads", "underemployment_desc", 3);

    expect(ranking).toHaveLength(3);
    expect(ranking[0]?.name).toBe("Performing Arts");
    expect(ranking[0]?.current.underemploymentRate).toBeGreaterThan(ranking[1]?.current.underemploymentRate ?? 0);

    const computerScience = await getMajorProfile(2);
    expect(computerScience?.wagePremium).toBe(35000);
  });

  it("returns common online majors and scatter rows", async () => {
    const commonOnline = await getCommonOnlineMajorsView();
    const scatter = await getWagePremiumScatter();

    expect(commonOnline.some((major) => major.name === "Business Administration")).toBe(true);
    expect(scatter.find((point) => point.majorName === "Nursing")?.category).toBe("Health");
  });

  it("builds historical context for a major", async () => {
    const context = await getHistoricalContext(7);

    expect(context.yearsOfHistory).toBeGreaterThan(0);
    expect(context.percentileRank).toBeGreaterThan(0);
  });
});
