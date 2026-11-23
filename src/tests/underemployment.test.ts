import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getCommonOnlineMajorsView,
  getCurrentHeadlineRates,
  getHistoricalContext,
  getMajorProfile,
  getMajorRanking,
  getTrajectoryByAgeGroup,
  getWagePremiumScatter
} from "@/lib/underemployment/calculate";

describe("underemployment analytics", () => {
  it("returns the headline from the latest NY Fed release, not the older snapshot", async () => {
    await expect(getCurrentHeadlineRates()).resolves.toEqual({
      recentGrads: 42.5,
      allGrads: null,
      asOfDate: "2026-09-30"
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

  it("never generates major history the NY Fed does not publish", async () => {
    const ranking = await getMajorRanking();
    const context = await getHistoricalContext(7);

    expect(ranking.every((major) => major.history.length === 0)).toBe(true);
    expect(context).toEqual({ percentileRank: 0, comparablePeriod: null, yearsOfHistory: 0 });
  });

  it("has no age trajectory beyond the two NY Fed groups", async () => {
    await expect(getTrajectoryByAgeGroup()).resolves.toEqual([]);
  });
});
