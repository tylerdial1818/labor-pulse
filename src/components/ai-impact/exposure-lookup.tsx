"use client";

import { useMemo, useState } from "react";

import { EXPOSURE_LOOKUP_LIMIT as MAX_RESULTS, filterExposureScores } from "@/lib/ai-impact/exposure";
import type { AiExposureScore } from "@/types/v15";

const CATEGORY_LABEL: Record<AiExposureScore["exposureCategory"], string> = {
  high: "High",
  moderate: "Moderate",
  low: "Low"
};

/** Search any occupation's Eloundou et al. exposure score. Scores arrive sorted most exposed first. */
export function ExposureLookup({ scores }: { scores: AiExposureScore[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => filterExposureScores(scores, query), [scores, query]);

  return (
    <div className="border border-rule p-4">
      <label htmlFor="exposure-search" className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-sub">
        Look up an occupation
      </label>
      <input
        id="exposure-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="e.g. accountant, nurse, 15-1252"
        className="mt-2 w-full border border-rule bg-paper px-3 py-2 font-sans text-sm text-ink focus:outline focus:outline-2 focus:outline-navy"
      />
      <p className="mt-2 font-sans text-xs text-sub" aria-live="polite">
        {query.trim() ? `${results.length === MAX_RESULTS ? `First ${MAX_RESULTS}` : results.length} matching occupations` : `The ${MAX_RESULTS} most exposed of ${scores.length} occupations`}
      </p>
      <table className="mt-3 min-w-full border-collapse font-sans text-sm">
        <thead>
          <tr className="border-b border-rule text-left text-[10px] uppercase tracking-[0.14em] text-sub">
            <th className="py-2 pr-4">Occupation</th>
            <th className="py-2 pr-4">Exposure (0 to 1)</th>
            <th className="py-2">Level</th>
          </tr>
        </thead>
        <tbody>
          {results.map((score) => (
            <tr key={score.occupationSocCode} className="border-b border-hair">
              <td className="py-2 pr-4">
                <span className="font-semibold">{score.occupationTitle}</span>
                <span className="ml-2 text-xs text-sub">{score.occupationSocCode}</span>
              </td>
              <td className="py-2 pr-4">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="inline-block h-2 w-24 bg-[var(--lp-hair)]">
                    <span className="block h-2 bg-navy" style={{ width: `${Math.round(score.exposureScore * 100)}%` }} />
                  </span>
                  {score.exposureScore.toFixed(2)}
                </span>
              </td>
              <td className="py-2">{CATEGORY_LABEL[score.exposureCategory]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {results.length === 0 ? <p className="mt-3 font-sans text-sm text-sub">No occupation matches that search.</p> : null}
    </div>
  );
}
