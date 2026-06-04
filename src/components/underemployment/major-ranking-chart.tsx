"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DataAsOfBadge } from "./data-as-of-badge";

export type MajorRankingDatum = {
  major: string;
  value: number;
  rank?: number;
  group?: string;
  note?: string;
};

export type MajorRankingChartProps = {
  title: string;
  data: MajorRankingDatum[];
  source: string;
  asOf: string;
  valueLabel: string;
  unit?: string;
  description?: string;
  sourceHref?: string;
  maxItems?: number;
  className?: string;
};

export function MajorRankingChart({ title, data, source, asOf, valueLabel, unit, description, sourceHref, maxItems, className = "" }: MajorRankingChartProps) {
  const chartData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, maxItems ?? data.length)
    .map((item, index) => ({ ...item, displayRank: item.rank ?? index + 1 }));

  return (
    <figure className={`border-y border-rule py-5 ${className}`} aria-labelledby={`${slugify(title)}-title`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h3 id={`${slugify(title)}-title`} className="font-serif text-[24px] font-semibold leading-tight text-ink">
            {title}
          </h3>
          {description ? <p className="mt-1 font-sans text-xs leading-[1.45] text-sub">{description}</p> : null}
        </div>
        <DataAsOfBadge source={source} asOf={asOf} href={sourceHref} />
      </div>
      <div className="h-[420px]" role="img" aria-label={`${title}, ranked by ${valueLabel}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 22, bottom: 8, left: 16 }}>
            <CartesianGrid stroke="var(--lp-hair)" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={{ stroke: "var(--lp-hair)" }} tick={{ fill: "var(--lp-sub)", fontSize: 11 }} tickFormatter={(value) => formatNumber(Number(value), unit)} />
            <YAxis type="category" dataKey="major" width={170} tickLine={false} axisLine={{ stroke: "var(--lp-hair)" }} tick={{ fill: "var(--lp-sub)", fontSize: 11 }} />
            <Tooltip
              separator=": "
              formatter={(value) => [formatNumber(Number(value), unit), valueLabel]}
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as MajorRankingDatum | undefined;
                return item?.group ? `${item.major}, ${item.group}` : item?.major ?? "";
              }}
              labelStyle={{ color: "var(--lp-ink)" }}
              contentStyle={{ borderColor: "var(--lp-rule)", borderRadius: 2, fontFamily: "var(--lp-sans)" }}
            />
            <Bar dataKey="value" fill="var(--lp-navy)" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

function formatNumber(value: number, unit?: string) {
  const formatted = new Intl.NumberFormat("en", { maximumFractionDigits: Math.abs(value) < 10 ? 1 : 0 }).format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
