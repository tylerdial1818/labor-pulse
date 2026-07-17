import type { Metadata } from "next";

import { TopBar } from "@/components/layout/top-bar";
import { appConfig } from "@/config/app";
import { getSourcesData } from "@/lib/db/queries";
import { normalizePublicCopy } from "@/lib/utils/public-copy";

export const metadata: Metadata = {
  title: "Data & Methods",
  description: "Sources, research standards, definitions, refresh activity, and citation guidance for Labor Pulse."
};

// Render per request so source status and citation access dates stay current.
export const dynamic = "force-dynamic";

const researchStandards = [
  {
    title: "Source before interpretation",
    body: "Every core indicator links to the organization that publishes the underlying series. Source dates remain visible beside the measure."
  },
  {
    title: "Derived measures are labeled",
    body: "Labor Pulse composites identify their input series and explain how readers should interpret the result."
  },
  {
    title: "Unsupported views are omitted",
    body: "Geographic and demographic comparisons appear only when a verified public series supports the selected measure."
  },
  {
    title: "Revisions remain visible",
    body: "Publishers may revise earlier observations. Labor Pulse retains source dates and reports the latest refresh activity."
  }
];

const contentTypes = [
  {
    title: "Official indicators",
    body: "Measures published by government agencies or other named source organizations."
  },
  {
    title: "Labor Pulse composites",
    body: "Calculated summaries built from identified source series. These are not government-published statistics."
  },
  {
    title: "Proxy measures",
    body: "Directional signals that provide context for a question they do not measure directly."
  },
  {
    title: "Source profiles",
    body: "Descriptions of recurring releases and research programs monitored by Labor Pulse."
  },
  {
    title: "Special analyses",
    body: "Longer research pieces that bring definitions, trends, and limitations together around one policy question."
  }
];

function formatPublicDate(value: string | null, includeTime = false) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit", timeZoneName: "short" } : {}),
    timeZone: "UTC"
  }).format(new Date(value));
}

function formatStatus(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function publicRefreshSource(value: string) {
  return value.toLowerCase().includes("seed") ? "Labor Pulse" : value;
}

function publicRefreshOutcome(value: string | null) {
  if (!value) return "Completed without a source message.";
  if (value.toLowerCase().includes("seed")) return "Reference observations are available.";
  return normalizePublicCopy(value);
}

export default async function SourcesPage() {
  const data = await getSourcesData();
  const accessDate = formatPublicDate(new Date().toISOString());
  const citation = `Labor Pulse. (${new Date().getUTCFullYear()}). U.S. Labor Market Monitor. Dialed Intelligence LLC. Retrieved ${accessDate}, from ${appConfig.url}.`;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Research standards</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">Data & Methods</h1>
        <p className="mb-8 mt-3 max-w-3xl font-serif text-[17px] italic leading-[1.5] text-sub">
          Labor Pulse is designed to let readers move from every displayed number to its original source, definition, update history, and limitations.
        </p>

        <section className="border-y border-rule py-6" aria-labelledby="research-standards">
          <h2 id="research-standards" className="font-serif text-2xl font-semibold">Research standards</h2>
          <div className="mt-5 grid border-l border-t border-rule md:grid-cols-2">
            {researchStandards.map((standard) => (
              <article key={standard.title} className="border-b border-r border-rule px-5 py-5">
                <h3 className="font-serif text-lg font-semibold">{standard.title}</h3>
                <p className="mt-2 font-sans text-sm leading-[1.55] text-sub">{standard.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-8" aria-labelledby="content-types">
          <h2 id="content-types" className="font-serif text-2xl font-semibold">What Labor Pulse publishes</h2>
          <p className="mt-2 max-w-3xl font-sans text-sm leading-[1.55] text-sub">
            These labels distinguish source statistics from measures and interpretation produced by Labor Pulse.
          </p>
          <div className="mt-5 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
            {contentTypes.map((item) => (
              <article key={item.title} className="border-t border-rule pt-4">
                <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 font-sans text-sm leading-[1.55] text-sub">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-rule pt-8" aria-labelledby="source-coverage">
          <h2 id="source-coverage" className="font-serif text-2xl font-semibold">Source coverage</h2>
          <p className="mt-2 max-w-3xl font-sans text-sm leading-[1.55] text-sub">
            Refresh schedules describe when Labor Pulse checks for changes. The date of the latest observation still depends on each publisher&apos;s release calendar.
          </p>
          <div className="mt-5 overflow-x-auto border-y border-rule">
            <table className="w-full min-w-[760px] border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-rule text-left text-[10px] uppercase tracking-[0.14em] text-sub">
                  <th className="py-3 pr-4 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Indicators served</th>
                  <th className="px-4 py-3 font-semibold">Last refresh</th>
                  <th className="px-4 py-3 font-semibold">Cadence</th>
                </tr>
              </thead>
              <tbody>
                {data.sources.map((source) => (
                  <tr key={source.source} className="border-b border-hair align-top">
                    <td className="py-4 pr-4 font-semibold text-navy">
                      <a className="hover:underline" href={source.sourceUrl}>{source.source}</a>
                    </td>
                    <td className="px-4 py-4 text-ink">{source.indicators.join(", ")}</td>
                    <td className="px-4 py-4 text-sub">{formatPublicDate(source.lastRefresh)}</td>
                    <td className="px-4 py-4 text-sub">{source.refreshCadence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="refresh-activity">
          <h2 id="refresh-activity" className="font-serif text-2xl font-semibold">Recent refresh activity</h2>
          <p className="mt-2 max-w-3xl font-sans text-sm leading-[1.55] text-sub">
            A failed check does not remove the last successful observation. Readers should use the source date shown on each indicator when judging freshness.
          </p>
          <div className="mt-4 overflow-x-auto border-y border-rule">
            <table className="w-full min-w-[760px] border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-rule text-left text-[10px] uppercase tracking-[0.14em] text-sub">
                  <th className="py-3 pr-4 font-semibold">Started</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Series</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {data.refreshLog.map((entry) => (
                  <tr key={entry.id} className="border-b border-hair align-top">
                    <td className="py-4 pr-4 text-sub">{formatPublicDate(entry.startedAt, true)}</td>
                    <td className="px-4 py-4 text-ink">{publicRefreshSource(entry.source)}</td>
                    <td className="px-4 py-4 text-sub">{entry.seriesId ?? "All series"}</td>
                    <td className="px-4 py-4 font-semibold text-navy">{formatStatus(entry.status)}</td>
                    <td className="px-4 py-4 text-sub">{publicRefreshOutcome(entry.message)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-8 border-y border-rule py-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div aria-labelledby="citation-guidance">
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Use in research</p>
            <h2 id="citation-guidance" className="mt-2 font-serif text-2xl font-semibold">Citation guidance</h2>
            <p className="mt-3 max-w-3xl font-sans text-sm leading-[1.55] text-sub">
              Cite the original publisher for the underlying data. Use the following citation when referring to the Labor Pulse presentation, interpretation, or composite measures.
            </p>
            <p className="mt-4 border-l-2 border-navy pl-4 font-serif text-[15px] leading-[1.55] text-ink">{citation}</p>
          </div>
          <div id="corrections" className="border-l border-rule pl-8 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-6">
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Corrections</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Report a data issue</h2>
            <p className="mt-3 font-sans text-sm leading-[1.55] text-sub">
              Please include the page, measure, source, and the issue you found. We will review the source record and correct the public presentation when needed.
            </p>
            <a
              className="mt-4 inline-flex border border-navy px-4 py-2 font-sans text-sm font-semibold text-navy hover:bg-[var(--lp-navy-tint)]"
              href={`mailto:${appConfig.researchEmail}?subject=Labor%20Pulse%20correction`}
            >
              Email a correction
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
