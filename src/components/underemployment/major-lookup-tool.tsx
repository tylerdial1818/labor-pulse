"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";

import type { MajorListItem, MajorProfile } from "@/types/underemployment";

type LookupResponse = {
  profile: MajorProfile;
  historicalContext: {
    percentileRank: number;
    comparablePeriod: { date: string; value: number } | null;
    yearsOfHistory: number;
  };
  similarMajors: Array<{ id: number; name: string; underemploymentRate: number }>;
};

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function MajorLookupTool({ majors }: { majors: MajorListItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMajorId = Number(searchParams.get("major")) || majors[0]?.id || 1;
  const [selectedId, setSelectedId] = useState(initialMajorId);
  const [category, setCategory] = useState("All");
  const [data, setData] = useState<LookupResponse | null>(null);
  const categories = useMemo(() => ["All", ...Array.from(new Set(majors.map((major) => major.category).filter((item): item is string => Boolean(item))))], [majors]);
  const filteredMajors = majors.filter((major) => category === "All" || major.category === category);
  const isLoading = !data || data.profile.id !== selectedId;

  useEffect(() => {
    let isCurrent = true;
    fetch(`/api/underemployment/majors/${selectedId}`)
      .then((response) => response.json() as Promise<LookupResponse>)
      .then((body) => {
        if (isCurrent) setData(body);
      });
    router.replace(`/underemployment?major=${selectedId}#major-lookup` as Route, { scroll: false });
    return () => {
      isCurrent = false;
    };
  }, [router, selectedId]);

  return (
    <div className="border-y border-rule py-5">
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`border px-3 py-2 font-sans text-xs font-semibold ${category === item ? "border-navy bg-[var(--lp-navy-tint)] text-navy" : "border-rule text-sub"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-sub">Major</span>
        <select
          value={selectedId}
          onChange={(event) => setSelectedId(Number(event.target.value))}
          className="w-full border border-rule bg-paper px-3 py-3 font-sans text-sm font-semibold text-ink"
        >
          {filteredMajors.map((major) => (
            <option key={major.id} value={major.id}>
              {major.name}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-5 min-h-[260px]">
        {isLoading || !data ? (
          <div className="border border-rule px-4 py-8 font-sans text-sm text-sub">Loading major profile...</div>
        ) : (
          <MajorProfilePanel data={data} />
        )}
      </div>
    </div>
  );
}

export function MajorProfilePanel({ data }: { data: LookupResponse }) {
  const { profile, historicalContext, similarMajors } = data;
  const latest = profile.history.at(-2);
  const yearAgoChange = latest ? profile.current.underemploymentRate - latest.underemploymentRate : null;
  const maxRate = Math.max(...profile.history.map((point) => point.underemploymentRate), 1);

  return (
    <article className="border border-rule bg-paper">
      <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-rule p-5 md:border-b-0 md:border-r">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-2xl font-semibold text-ink">{profile.name}</h3>
            {profile.category ? <span className="border border-rule px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-sub">{profile.category}</span> : null}
            {profile.isCommonOnline ? <span className="border border-navy px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-navy">Common online</span> : null}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Metric label="Underemployment" value={formatPercent(profile.current.underemploymentRate)} note={yearAgoChange === null ? "No prior comparison" : `${yearAgoChange >= 0 ? "+" : ""}${yearAgoChange.toFixed(1)} pp vs prior point`} />
            <Metric label="Wage premium" value={formatCurrency(profile.wagePremium)} note="College job wage less non-college job wage" />
            <Metric label="Rank" value={`#${profile.rankAmongAllMajors}`} note="Among majors shown" />
          </div>
          <div className="mt-6" role="img" aria-label={`${profile.name} underemployment trend`}>
            <div className="flex h-28 items-end gap-1 border-b border-rule">
              {profile.history.map((point) => (
                <span
                  key={point.date}
                  title={`${point.date}: ${formatPercent(point.underemploymentRate)}`}
                  className="min-w-0 flex-1 bg-navy"
                  style={{ height: `${Math.max(8, (point.underemploymentRate / maxRate) * 100)}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-sans text-[11px] text-sub">
              <span>{profile.history[0]?.date.slice(0, 4)}</span>
              <span>{profile.current.date.slice(0, 4)}</span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-sub">Historical context</h4>
          <p className="mt-2 font-serif text-[15px] leading-[1.45] text-ink">
            Current underemployment sits at the {historicalContext.percentileRank}th percentile across {historicalContext.yearsOfHistory} years of available history.
          </p>
          {historicalContext.comparablePeriod ? (
            <p className="mt-2 font-sans text-xs text-sub">
              Comparable period: {historicalContext.comparablePeriod.date}, {formatPercent(historicalContext.comparablePeriod.value)}.
            </p>
          ) : null}
          <h4 className="mt-6 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-sub">Similar majors</h4>
          <ul className="mt-3 space-y-2">
            {similarMajors.map((major) => (
              <li key={major.id} className="flex justify-between gap-4 border-t border-hair pt-2 font-sans text-sm">
                <a href={`#by-major`} className="font-semibold text-navy">
                  {major.name}
                </a>
                <span className="text-sub">{formatPercent(major.underemploymentRate)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="border-t border-rule pt-3">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-sub">{label}</p>
      <p className="mt-1 font-serif text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 font-sans text-[11px] leading-[1.35] text-sub">{note}</p>
    </div>
  );
}
