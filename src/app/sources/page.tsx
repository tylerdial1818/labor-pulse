import { TopBar } from "@/components/layout/top-bar";
import { getSourcesData } from "@/lib/db/queries";

// Render per request so the refresh log and last-refresh times stay live.
export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const data = await getSourcesData();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <h1 className="font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">Sources</h1>
        <p className="mb-8 mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
          Source provenance, refresh cadence, and recent ingestion status for Labor Pulse indicators.
        </p>
        <section className="overflow-x-auto border-y border-rule" aria-label="Data sources">
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
                    <a href={source.sourceUrl}>{source.source}</a>
                  </td>
                  <td className="px-4 py-4 text-ink">{source.indicators.join(", ")}</td>
                  <td className="px-4 py-4 text-sub">{source.lastRefresh ?? "not available"}</td>
                  <td className="px-4 py-4 text-sub">{source.refreshCadence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="mt-10" aria-label="Refresh log">
          <h2 className="font-serif text-2xl font-semibold">Refresh log</h2>
          <div className="mt-4 overflow-x-auto border-y border-rule">
            <table className="w-full min-w-[760px] border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-rule text-left text-[10px] uppercase tracking-[0.14em] text-sub">
                  <th className="py-3 pr-4 font-semibold">Started</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Series</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                </tr>
              </thead>
              <tbody>
                {data.refreshLog.map((entry) => (
                  <tr key={entry.id} className="border-b border-hair align-top">
                    <td className="py-4 pr-4 text-sub">{entry.startedAt}</td>
                    <td className="px-4 py-4 text-ink">{entry.source}</td>
                    <td className="px-4 py-4 text-sub">{entry.seriesId ?? "all"}</td>
                    <td className="px-4 py-4 font-semibold text-navy">{entry.status}</td>
                    <td className="px-4 py-4 text-sub">{entry.message ?? "Completed without message."}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
