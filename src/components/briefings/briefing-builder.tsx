"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import type { IndicatorCardViewModel } from "@/server/labor-types";

type CompositeOption = { id: string; name: string };
type InsightOption = { id: string | number; title: string };
type UnderemploymentMajorOption = { id: number; name: string };

const themes = ["Monthly state of the labor market", "AI impact update", "Hiring trends quarterly", "Recession signals check"];

export function BriefingBuilder({
  indicators,
  composites,
  insights,
  underemploymentMajors = []
}: {
  indicators: IndicatorCardViewModel[];
  composites: CompositeOption[];
  insights: InsightOption[];
  underemploymentMajors?: UnderemploymentMajorOption[];
}) {
  const router = useRouter();
  const [theme, setTheme] = useState(themes[0]);
  const [seriesIds, setSeriesIds] = useState<string[]>(indicators.slice(0, 4).map((indicator) => indicator.id));
  const [compositeIds, setCompositeIds] = useState<string[]>(composites.map((composite) => composite.id));
  const [insightIds, setInsightIds] = useState<string[]>(insights.slice(0, 3).map((insight) => String(insight.id)));
  const [underemploymentMajorIds, setUnderemploymentMajorIds] = useState<string[]>(underemploymentMajors.slice(0, 3).map((major) => String(major.id)));
  const [includeUnderemploymentHeadline, setIncludeUnderemploymentHeadline] = useState(true);
  const [includeUnderemploymentDefinitions, setIncludeUnderemploymentDefinitions] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);

  function toggle<T>(value: T, values: T[], setValues: (next: T[]) => void) {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  async function submit() {
    setSubmitting(true);
    const response = await fetch("/api/briefings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme,
        seriesIds,
        compositeIds,
        insightIds,
        underemploymentMajorIds: underemploymentMajorIds.map((id) => Number(id)),
        includeUnderemploymentHeadline,
        includeUnderemploymentDefinitions,
        geography: "US"
      })
    });
    const body = (await response.json()) as { briefing?: { id: number } };
    if (body.briefing) router.push(`/briefings/${body.briefing.id}` as Route);
    setSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <section className="border-y border-rule py-5">
        <h2 className="font-serif text-2xl font-semibold">Theme</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {themes.map((option) => (
            <button key={option} type="button" onClick={() => setTheme(option)} className={`border px-3 py-2 font-sans text-xs font-semibold ${theme === option ? "border-navy text-navy" : "border-rule text-sub"}`}>
              {option}
            </button>
          ))}
        </div>
      </section>

      <Checklist title="Indicators" items={indicators.map((indicator) => ({ id: indicator.id, label: indicator.title }))} selected={seriesIds} onToggle={(id) => toggle(id, seriesIds, setSeriesIds)} />
      <Checklist title="Composites" items={composites.map((composite) => ({ id: composite.id, label: composite.name }))} selected={compositeIds} onToggle={(id) => toggle(id, compositeIds, setCompositeIds)} />
      <Checklist title="Insights" items={insights.map((insight) => ({ id: String(insight.id), label: insight.title }))} selected={insightIds} onToggle={(id) => toggle(id, insightIds, setInsightIds)} />
      {underemploymentMajors.length > 0 ? (
        <section className="border-t border-rule pt-5">
          <h2 className="font-serif text-2xl font-semibold">Underemployment</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <label className="flex items-center gap-3 border border-rule px-3 py-2 font-sans text-sm">
              <input type="checkbox" checked={includeUnderemploymentHeadline} onChange={() => setIncludeUnderemploymentHeadline((value) => !value)} />
              <span>Headline national rates</span>
            </label>
            <label className="flex items-center gap-3 border border-rule px-3 py-2 font-sans text-sm">
              <input type="checkbox" checked={includeUnderemploymentDefinitions} onChange={() => setIncludeUnderemploymentDefinitions((value) => !value)} />
              <span>Definition framing</span>
            </label>
          </div>
          <Checklist
            title="Underemployment majors"
            items={underemploymentMajors.map((major) => ({ id: String(major.id), label: major.name }))}
            selected={underemploymentMajorIds}
            onToggle={(id) => {
              if (!underemploymentMajorIds.includes(id) && underemploymentMajorIds.length >= 5) return;
              toggle(id, underemploymentMajorIds, setUnderemploymentMajorIds);
            }}
          />
        </section>
      ) : null}

      <button type="button" onClick={submit} disabled={isSubmitting} className="border border-navy bg-navy px-5 py-3 font-sans text-sm font-semibold text-white disabled:opacity-60">
        {isSubmitting ? "Creating..." : "Create briefing"}
      </button>
    </div>
  );
}

function Checklist({
  title,
  items,
  selected,
  onToggle
}: {
  title: string;
  items: Array<{ id: string; label: string }>;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section className="border-t border-rule pt-5">
      <h2 className="font-serif text-2xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-center gap-3 border border-rule px-3 py-2 font-sans text-sm">
            <input type="checkbox" checked={selected.includes(item.id)} onChange={() => onToggle(item.id)} />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
