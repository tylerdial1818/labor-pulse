"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DataAsOfBadge } from "./data-as-of-badge";

export type HeadlineTrendPoint = {
  date: string;
  value: number | null;
  label?: string;
};

export type HeadlineTrendChartProps = {
  title: string;
  data: HeadlineTrendPoint[];
  source: string;
  asOf: string;
  valueLabel: string;
  unit?: string;
  description?: string;
  sourceHref?: string;
  height?: number;
  className?: string;
};

export function HeadlineTrendChart({ title, data, source, asOf, valueLabel, unit, description, sourceHref, height = 340, className = "" }: HeadlineTrendChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    displayDate: point.label ?? formatDate(point.date)
  }));

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
      <div className="h-[300px] min-h-[260px] w-full" style={{ height }} role="img" aria-label={`${title}, ${valueLabel}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 12, right: 18, bottom: 22, left: 8 }}>
            <CartesianGrid stroke="var(--lp-hair)" vertical={false} />
            <XAxis dataKey="displayDate" tickLine={false} axisLine={{ stroke: "var(--lp-hair)" }} tick={{ fill: "var(--lp-sub)", fontSize: 11 }} minTickGap={28} />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "var(--lp-hair)" }}
              tick={{ fill: "var(--lp-sub)", fontSize: 11 }}
              tickFormatter={(value) => formatNumber(Number(value), unit)}
              width={70}
            />
            <Tooltip
              separator=": "
              formatter={(value) => [formatNumber(Number(value), unit), valueLabel]}
              labelStyle={{ color: "var(--lp-ink)" }}
              contentStyle={{ borderColor: "var(--lp-rule)", borderRadius: 2, fontFamily: "var(--lp-sans)" }}
            />
            <Line type="monotone" dataKey="value" name={valueLabel} stroke="var(--lp-navy)" strokeWidth={2.4} dot={false} activeDot={{ r: 4, fill: "var(--lp-navy)" }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(parsed);
}

function formatNumber(value: number, unit?: string) {
  const formatted = new Intl.NumberFormat("en", { maximumFractionDigits: Math.abs(value) < 10 ? 1 : 0 }).format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
