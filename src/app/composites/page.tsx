import { CompositesStrip } from "@/components/dashboard/composites-strip";
import { TopBar } from "@/components/layout/top-bar";
import { PageCitation } from "@/components/research/page-citation";
import { getCompositeSummaries } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function CompositesPage() {
  const composites = await getCompositeSummaries();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Composite signals</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">Composite Signals</h1>
        <p className="mb-8 mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
          Three summary measures calculated by Labor Pulse from official indicators. Each one combines several series into a single reading of
          recession risk, labor market tightness, or labor market stress. Open a signal to see its history, method, and input series.
        </p>

        {composites.length === 0 ? (
          <p className="border-y border-rule py-8 font-serif text-base italic text-sub">Composite signals are not available yet.</p>
        ) : (
          <CompositesStrip composites={composites} />
        )}

        <PageCitation className="mt-8" title="Composite Signals" path="/composites" source="Labor Pulse calculations from BLS and DOL data via FRED" />
      </main>
    </div>
  );
}
