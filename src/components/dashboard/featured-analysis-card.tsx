import Link from "next/link";
import type { Route } from "next";

export function FeaturedAnalysisCard({ recentRate, asOfDate }: { recentRate: number; asOfDate: string }) {
  return (
    <section className="mb-7 border-y border-rule py-5" aria-labelledby="featured-analysis">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Featured analysis</p>
          <h2 id="featured-analysis" className="mt-2 font-serif text-2xl font-semibold tracking-[-0.01em] text-ink">
            Underemployment Analytics
          </h2>
          <p className="mt-2 max-w-2xl font-serif text-[15px] leading-[1.45] text-sub">
            A long-form analytical guide to competing underemployment definitions, NY Fed recent graduate outcomes, and major-level risk.
          </p>
        </div>
        <Link
          href={"/underemployment" as Route}
          className="group min-w-[220px] border border-rule bg-paper px-4 py-3 text-left transition-colors hover:bg-[var(--lp-navy-tint)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
        >
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-sub">Recent graduates</span>
          <span className="mt-1 block font-serif text-4xl font-semibold text-ink">{recentRate.toFixed(1)}%</span>
          <span className="mt-1 block font-sans text-[11px] text-sub">As of {asOfDate}</span>
          <span className="mt-3 block font-sans text-xs font-bold text-navy">Read the full analysis -&gt;</span>
        </Link>
      </div>
    </section>
  );
}
