import { describe, expect, it } from "vitest";

import { isCronAuthorized } from "@/lib/cron/auth";
import { toCompositeColumns, toObservationColumns } from "@/lib/db/relational-store";
import { selectRefreshSeries } from "@/lib/fred/refresh-scope";
import { ageInDays, assessFreshness } from "@/lib/freshness/assess";

const NOW = new Date("2026-11-18T12:00:00Z");

describe("assessFreshness", () => {
  it("treats a monthly series inside its release lag as current", () => {
    const report = assessFreshness([{ id: "JTSJOL", label: "Job Openings", frequency: "monthly", latestDate: "2026-09-01" }], NOW);
    expect(report.ok).toBe(true);
    expect(report.checks[0]).toMatchObject({ status: "current", ageDays: 78, maxAgeDays: 100 });
  });

  it("flags composites stuck six months behind", () => {
    const report = assessFreshness([{ id: "sahm_rule", label: "Sahm Rule", frequency: "monthly", latestDate: "2026-04-01" }], NOW);
    expect(report.ok).toBe(false);
    expect(report.staleCount).toBe(1);
    expect(report.checks[0].status).toBe("stale");
  });

  it("flags a daily refresh that stopped and a missing dataset", () => {
    const report = assessFreshness(
      [
        { id: "research_monitor", label: "Research Monitor", frequency: "daily", latestDate: "2026-06-01T09:00:00.000Z" },
        { id: "aei", label: "Economic Index", frequency: "quarterly", latestDate: null }
      ],
      NOW
    );
    expect(report.checks.map((check) => check.status)).toEqual(["stale", "missing"]);
  });

  it("counts whole days for date-only and timestamp inputs", () => {
    expect(ageInDays("2026-11-17", NOW)).toBe(1);
    expect(ageInDays("2026-11-18T13:00:00Z", NOW)).toBe(-1);
  });
});

describe("batched relational writes", () => {
  it("splits observations into column arrays of the requested size", () => {
    const observations = Array.from({ length: 5 }, (_, index) => ({
      seriesId: "UNRATE",
      geography: "US",
      date: `2026-0${index + 1}-01`,
      value: index === 2 ? null : 4 + index / 10
    }));
    const chunks = toObservationColumns(observations, 2);
    expect(chunks).toHaveLength(3);
    expect(chunks[1]).toEqual({
      seriesIds: ["UNRATE", "UNRATE"],
      geographies: ["US", "US"],
      dates: ["2026-03-01", "2026-04-01"],
      values: [null, 4.3]
    });
    expect(toObservationColumns([])).toEqual([]);
  });

  it("keeps composite columns aligned", () => {
    const columns = toCompositeColumns([
      { compositeId: "sahm_rule", geography: "US", date: "2026-10-01", value: 0.2 },
      { compositeId: "labor_stress", geography: "US", date: "2026-10-01", value: -0.1 }
    ]);
    expect(columns).toEqual({
      compositeIds: ["sahm_rule", "labor_stress"],
      geographies: ["US", "US"],
      dates: ["2026-10-01", "2026-10-01"],
      values: [0.2, -0.1]
    });
  });
});

describe("FRED refresh scope", () => {
  it("refreshes headline indicators separately from segment series", () => {
    const core = selectRefreshSeries("core").map((series) => series.id);
    const segments = selectRefreshSeries("segments").map((series) => series.id);
    const all = selectRefreshSeries("all").map((series) => series.id);

    expect(core).toContain("UNRATE");
    expect(core).toContain("ICSA");
    expect(segments.some((id) => core.includes(id))).toBe(false);
    expect(new Set(all).size).toBe(all.length);
    expect(all.length).toBe(core.length + segments.length);
  });
});

describe("cron authorization", () => {
  const request = (authorization?: string) =>
    new Request("https://example.org/api/cron/refresh-insights", { headers: authorization ? { authorization } : {} });

  it("requires the configured bearer secret", () => {
    expect(isCronAuthorized(request("Bearer s3cret"), "s3cret")).toBe(true);
    expect(isCronAuthorized(request("Bearer wrong"), "s3cret")).toBe(false);
    expect(isCronAuthorized(request(), "s3cret")).toBe(false);
  });

  it("stays closed when no secret is configured", () => {
    expect(isCronAuthorized(request("Bearer anything"), undefined)).toBe(false);
  });
});
