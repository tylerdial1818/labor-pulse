import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { getBriefing } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function BriefingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const briefing = await getBriefing(Number(id));

  if (!briefing) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Briefing</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">{briefing.theme}</h1>
        <p className="mt-3 font-sans text-xs text-sub">
          {briefing.geography} - {new Date(briefing.createdAt).toLocaleString("en-US", { timeZone: "UTC" })} - {briefing.model}
        </p>
        <pre className="mt-8 overflow-auto whitespace-pre-wrap border-y border-rule bg-panel px-4 py-5 font-mono text-[13px] leading-[1.6] text-ink">
          {briefing.content}
        </pre>
      </main>
    </div>
  );
}
