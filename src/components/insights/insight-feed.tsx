import { ExternalLink } from "lucide-react";

import { getSourceProfileCopy } from "@/lib/insights/seed";
import { getInsightSource } from "@/lib/insights/sources";
import type { InsightSummary } from "@/lib/insights/types";
import { normalizePublicCopy } from "@/lib/utils/public-copy";

type InsightFeedProps = {
  insights: InsightSummary[];
};

function formatDate(value: string | null) {
  if (!value) return "date unavailable";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(value)
  );
}

function sourceTypeLabel(sourceType: InsightSummary["sourceType"]) {
  if (sourceType === "live") return "Latest source update";
  if (sourceType === "manual") return "Curated source";
  return "Source profile";
}

export function InsightFeed({ insights }: InsightFeedProps) {
  if (insights.length === 0) {
    return (
      <section className="border-y border-rule py-10 text-center" aria-label="No research monitor results">
        <h2 className="font-serif text-2xl font-semibold">No matching sources or updates</h2>
        <p className="mt-2 text-sm text-sub">Adjust the category or topic filters.</p>
      </section>
    );
  }

  return (
    <section className="divide-y divide-rule border-y border-rule" aria-label="Research monitor sources and updates">
      {insights.map((insight) => {
        const source = getInsightSource(insight.sourceId);
        const isSourceProfile = insight.sourceType === "seed" || String(insight.id).startsWith("seed-");
        const profile = isSourceProfile ? getSourceProfileCopy(insight.sourceId) : null;
        const isDatedUpdate = !isSourceProfile && (insight.sourceType === "live" || Boolean(insight.publishedAt));
        const title = profile?.title ?? insight.title;
        const summary = profile?.summary ?? insight.summary;
        const keyTakeaways = profile?.keyTakeaways ?? insight.keyTakeaways;

        return (
          <article key={insight.id} className="grid gap-5 py-6 md:grid-cols-[220px_1fr]">
            <div className="text-sm text-sub">
              <p className="font-semibold text-navy">{insight.sourceName}</p>
              <p className="mt-1">{isDatedUpdate ? formatDate(insight.publishedAt ?? insight.updatedAt) : source?.cadence ?? "Recurring source"}</p>
              <p className="mt-3 inline-flex border border-rule bg-[var(--lp-navy-tint)] px-2.5 py-1 font-sans text-[10.5px] font-bold uppercase tracking-[0.12em] text-navy">
                {sourceTypeLabel(insight.sourceType)}
              </p>
            </div>
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif text-2xl font-semibold leading-tight text-ink">{title}</h2>
                <a
                  href={insight.url}
                  className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-rule text-navy"
                  aria-label={`Open ${insight.sourceName}`}
                >
                  <ExternalLink aria-hidden="true" size={16} />
                </a>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-ink">{normalizePublicCopy(summary)}</p>
              <ul className="mt-4 grid gap-2 text-sm text-sub">
                {keyTakeaways.map((takeaway) => (
                  <li key={takeaway} className="border-l-2 border-navy pl-3">
                    {normalizePublicCopy(takeaway)}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {insight.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="border border-rule px-2 py-1 font-sans text-[10px] uppercase tracking-[0.08em] text-sub">
                    {tag.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
