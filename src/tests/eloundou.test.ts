import { describe, expect, it } from "vitest";

import { parseEloundouOccupationCsv } from "@/lib/ai-impact/eloundou";

describe("Eloundou occupation exposure parser", () => {
  it("parses dv_rating_beta into Labor Pulse exposure scores", () => {
    const scores = parseEloundouOccupationCsv(
      [
        "O*NET-SOC Code,Title,dv_rating_alpha,dv_rating_beta,dv_rating_gamma,human_rating_alpha,human_rating_beta,human_rating_gamma",
        "11-1011.00,Chief Executives,0.1,0.46,0.82,0.18,0.35,0.52",
        "15-1252.00,Software Developers,0.2,0.72,0.95,0.1,0.44,0.8",
        "53-3032.00,Heavy and Tractor-Trailer Truck Drivers,0,0.2,0.4,0,0.1,0.2"
      ].join("\n")
    );

    expect(scores).toEqual([
      {
        occupationSocCode: "11-1011.00",
        occupationTitle: "Chief Executives",
        exposureScore: 0.46,
        exposureCategory: "moderate"
      },
      {
        occupationSocCode: "15-1252.00",
        occupationTitle: "Software Developers",
        exposureScore: 0.72,
        exposureCategory: "high"
      },
      {
        occupationSocCode: "53-3032.00",
        occupationTitle: "Heavy and Tractor-Trailer Truck Drivers",
        exposureScore: 0.2,
        exposureCategory: "low"
      }
    ]);
  });

  it("rejects missing exposure columns", () => {
    expect(() => parseEloundouOccupationCsv("code,title\nx,y")).toThrow(/requires/);
  });
});
