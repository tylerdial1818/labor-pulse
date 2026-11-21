import Link from "next/link";
import type { Route } from "next";

import type { MeasureBar } from "@/lib/home/measure-comparison";
import { cn } from "@/lib/utils/cn";

/**
 * Home featured analysis: the underemployment guide, with a three-bar comparison of
 * measures that use different definitions. Values arrive pre-shaped from the server.
 */
export function FeaturedAnalysis({ bars }: { bars: MeasureBar[] }) {
  const sources = [...new Set(bars.map((bar) => bar.sourceLabel))].join(" and ");

  return (
    <section aria-labelledby="featured-analysis" className="grid gap-10 border-b border-rule py-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:py-12">
      <div className="min-w-0">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Featured analysis</p>
        <h2 id="featured-analysis" className="mt-3 font-serif text-[36px] font-semibold leading-[1.04] tracking-[-0.02em] text-ink md:text-[52px]">
          Underemployment Analytics
        </h2>
        <p className="mt-4 max-w-[34em] font-serif text-[19px] leading-[1.5] text-ink md:text-[21px]">
          A long-form guide to competing underemployment definitions, New York Fed outcomes for recent graduates, and risk by college major.
        </p>
        <Link
          href={"/underemployment" as Route}
          className="mt-6 inline-block rounded bg-ink px-5 py-3 font-sans text-[14px] font-semibold text-paper hover:underline hover:underline-offset-4"
        >
          Read the full analysis
        </Link>
      </div>
      <figure className="min-w-0 border border-rule bg-panel px-6 pb-5 pt-6">
        <figcaption>
          <span className="block font-serif text-[21px] font-semibold leading-tight text-ink">Three measures, three definitions</span>
          <span className="mt-1 block font-sans text-[12.5px] text-sub">Percent of each measure&apos;s own population</span>
        </figcaption>
        <ul className="mt-6 space-y-5">
          {bars.map((bar) => (
            <li key={bar.id}>
              <div className="mb-[6px] flex items-baseline justify-between gap-4 font-sans text-[13.5px] text-ink">
                <span>{bar.label}</span>
                <strong className={cn("whitespace-nowrap", bar.widthPercent === null && "font-normal text-sub")}>{bar.valueLabel}</strong>
              </div>
              <div aria-hidden="true" className="h-[14px] bg-muted">
                {bar.widthPercent !== null ? (
                  <div className={cn("lp-bar h-full", bar.emphasized ? "bg-navy" : "bg-ink")} style={{ width: `${bar.widthPercent}%` }} />
                ) : null}
              </div>
              <p className="mt-1 font-sans text-[11px] text-sub">
                {bar.sourceLabel} · As of {bar.asOf ?? "not available"}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-rule pt-3 font-sans text-[12px] leading-[1.5] text-sub">
          Definitions differ, so the bars are not directly comparable. Recent graduates counts college graduates aged 22 to 27 in jobs that do not typically require a degree. U-6 adds involuntary part-time and marginally attached workers to the unemployed. The unemployment rate counts only people actively looking for work. Sources: {sources}.{" "}
          <Link href={"/sources" as Route} className="font-semibold text-navy hover:underline">
            Methods
          </Link>
        </p>
      </figure>
    </section>
  );
}
