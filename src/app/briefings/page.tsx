import Link from "next/link";
import type { Route } from "next";

import { TopBar } from "@/components/layout/top-bar";
import { listBriefings } from "@/lib/db/queries";

export default async function BriefingsPage() {
  const briefings = await listBriefings();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Briefing library</p>
            <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">Executive Briefings</h1>
          </div>
          <Link href={"/briefings/new" as Route} className="border border-navy px-4 py-2 font-sans text-sm font-semibold text-navy hover:bg-[var(--lp-navy-tint)]">
            New briefing
          </Link>
        </div>
        <section className="mt-8 border-t border-rule">
          {briefings.length === 0 ? (
            <p className="py-8 font-serif text-base italic text-sub">No briefings generated yet.</p>
          ) : (
            briefings.map((briefing) => (
              <Link key={briefing.id} href={`/briefings/${briefing.id}` as Route} className="block border-b border-rule py-5 hover:bg-[var(--lp-navy-tint)]">
                <h2 className="font-serif text-2xl font-semibold">{briefing.theme}</h2>
                <p className="mt-2 font-sans text-xs text-sub">
                  {briefing.geography} · {new Date(briefing.createdAt).toLocaleString("en-US", { timeZone: "UTC" })} · {briefing.model}
                </p>
              </Link>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
