"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DataAsOfBadge } from "./data-as-of-badge";

export type TrajectoryPoint = {
  date: string;
  value: number | null;
  label?: string;
};

export type TrajectorySeries = {
  id: string;
  label: string;
  data: TrajectoryPoint[];
};

export type TrajectoryChartProps = {
  title: string;
  series: TrajectorySeries[];
  source: string;
  asOf: string;
  valueLabel: string;
  unit?: string;
  description?: string;
  sourceHref?: string;
  className?: string;
};

const colors = ["#24446b", "#8a2e3b", "#266b3f", "#8c5c17", "#5b4b8a", "#1f6f78"];

export function TrajectoryChart({ title, series, source, asOf, valueLabel, unit, description, sourceHref, className = "" }: TrajectoryChartProps) {
  const dates = Array.from(new Set(series.flatMap((item) => item.data.map((point) => point.date)))).sort();
  const chartData = dates.map((date) => {
    const row: Record<string, string | number | null> = { date, displayDate: formatDate(date) };

    series.forEach((item) => {
      row[item.id] = item.data.find((point) => point.date === date)?.value ?? null;
    });

    return row;
  });

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
      <div className="h-[380px]" role="img" aria-label={`${title}, ${valueLabel} over time`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 12, right: 18, bottom: 24, left: 8 }}>
            <CartesianGrid stroke="var(--lp-hair)" vertical={false} />
            <XAxis dataKey="displayDate" tickLine={false} axisLine={{ stroke: "var(--lp-hair)" }} tick={{ fill: "var(--lp-sub)", fontSize: 11 }} minTickGap={28} />
            <YAxis tickLine={false} axisLine={{ stroke: "var(--lp-hair)" }} tick={{ fill: "var(--lp-sub)", fontSize: 11 }} tickFormatter={(value) => formatNumber(Number(value), unit)} width={70} />
            <Tooltip
              separator=": "
              formatter={(value, name) => [formatNumber(Number(value), unit), String(name)]}
              labelStyle={{ color: "var(--lp-ink)" }}
              contentStyle={{ borderColor: "var(--lp-rule)", borderRadius: 2, fontFamily: "var(--lp-sans)" }}
            />
            {series.map((item, index) => (
              <Line key={item.id} type="monotone" dataKey={item.id} name={item.label} stroke={colors[index % colors.length]} strokeWidth={2.2} dot={false} activeDot={{ r: 3.8 }} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-2 font-sans text-xs text-sub">
        {series.map((item, index) => (
          <span key={item.id} className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5" style={{ backgroundColor: colors[index % colors.length] }} />
            {item.label}
          </span>
        ))}
      </figcaption>
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
