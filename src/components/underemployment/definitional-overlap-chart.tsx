"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DataAsOfBadge } from "./data-as-of-badge";

export type DefinitionalOverlapDatum = {
  label: string;
  value: number;
  definition: string;
  includedInHeadline?: boolean;
};

export type DefinitionalOverlapChartProps = {
  title: string;
  data: DefinitionalOverlapDatum[];
  source: string;
  asOf: string;
  valueLabel: string;
  unit?: string;
  description?: string;
  sourceHref?: string;
  className?: string;
};

export function DefinitionalOverlapChart({ title, data, source, asOf, valueLabel, unit, description, sourceHref, className = "" }: DefinitionalOverlapChartProps) {
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
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)]">
        <div className="h-[320px]" role="img" aria-label={`${title}, ${valueLabel}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 18, bottom: 24, left: 8 }}>
              <CartesianGrid stroke="var(--lp-hair)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "var(--lp-hair)" }} tick={{ fill: "var(--lp-sub)", fontSize: 11 }} interval={0} />
              <YAxis tickLine={false} axisLine={{ stroke: "var(--lp-hair)" }} tick={{ fill: "var(--lp-sub)", fontSize: 11 }} tickFormatter={(value) => formatNumber(Number(value), unit)} width={70} />
              <Tooltip
                separator=": "
                formatter={(value) => [formatNumber(Number(value), unit), valueLabel]}
                labelStyle={{ color: "var(--lp-ink)" }}
                contentStyle={{ borderColor: "var(--lp-rule)", borderRadius: 2, fontFamily: "var(--lp-sans)" }}
              />
              <Bar dataKey="value" fill="var(--lp-navy)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <dl className="grid content-start gap-3 border-l border-rule pl-4 font-sans text-xs leading-[1.45] max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-4">
          {data.map((item) => (
            <div key={item.label}>
              <dt className="font-bold text-ink">{item.label}</dt>
              <dd className="mt-1 text-sub">{item.definition}</dd>
              <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy">{item.includedInHeadline ? "Included in headline" : "Adjacent measure"}</dd>
            </div>
          ))}
        </dl>
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
