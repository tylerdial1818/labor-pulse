"use client";

import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

import { DataAsOfBadge } from "./data-as-of-badge";

export type WagePremiumScatterDatum = {
  major: string;
  underemploymentRate: number;
  wagePremium: number;
  graduates?: number;
  group?: string;
  highlight?: boolean;
};

export type WagePremiumScatterProps = {
  title: string;
  data: WagePremiumScatterDatum[];
  source: string;
  asOf: string;
  description?: string;
  sourceHref?: string;
  underemploymentUnit?: string;
  wagePremiumUnit?: string;
  className?: string;
};

export function WagePremiumScatter({
  title,
  data,
  source,
  asOf,
  description,
  sourceHref,
  underemploymentUnit = "%",
  wagePremiumUnit = "%",
  className = ""
}: WagePremiumScatterProps) {
  const regularData = data.filter((item) => !item.highlight);
  const highlightedData = data.filter((item) => item.highlight);

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
      <div className="h-[390px]" role="img" aria-label={`${title}, underemployment rate compared with wage premium`}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 14, right: 22, bottom: 28, left: 8 }}>
            <CartesianGrid stroke="var(--lp-hair)" />
            <XAxis
              type="number"
              dataKey="underemploymentRate"
              name="Underemployment rate"
              unit={underemploymentUnit}
              tickLine={false}
              axisLine={{ stroke: "var(--lp-hair)" }}
              tick={{ fill: "var(--lp-sub)", fontSize: 11 }}
              tickFormatter={(value) => formatNumber(Number(value), underemploymentUnit)}
            />
            <YAxis
              type="number"
              dataKey="wagePremium"
              name="Wage premium"
              unit={wagePremiumUnit}
              tickLine={false}
              axisLine={{ stroke: "var(--lp-hair)" }}
              tick={{ fill: "var(--lp-sub)", fontSize: 11 }}
              tickFormatter={(value) => formatNumber(Number(value), wagePremiumUnit)}
              width={72}
            />
            <ZAxis dataKey="graduates" range={[42, 180]} />
            <Tooltip
              cursor={{ stroke: "var(--lp-faint)", strokeDasharray: "4 4" }}
              formatter={(value, name) => [formatNumber(Number(value), name === "Underemployment rate" ? underemploymentUnit : wagePremiumUnit), name]}
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as WagePremiumScatterDatum | undefined;
                return item?.group ? `${item.major}, ${item.group}` : item?.major ?? "";
              }}
              labelStyle={{ color: "var(--lp-ink)" }}
              contentStyle={{ borderColor: "var(--lp-rule)", borderRadius: 2, fontFamily: "var(--lp-sans)" }}
            />
            <Scatter name="Majors" data={regularData} fill="var(--lp-navy)" opacity={0.72} />
            <Scatter name="Highlighted majors" data={highlightedData} fill="var(--lp-down)" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-2 font-sans text-xs text-sub">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 bg-navy" /> Majors</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 bg-down" /> Highlighted majors</span>
      </figcaption>
    </figure>
  );
}

function formatNumber(value: number, unit?: string) {
  const formatted = new Intl.NumberFormat("en", { maximumFractionDigits: Math.abs(value) < 10 ? 1 : 0 }).format(value);
  return unit ? `${formatted}${unit}` : formatted;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
