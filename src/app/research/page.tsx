import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";

import { TopBar } from "@/components/layout/top-bar";
import { formatNoteDate } from "@/lib/research/format";
import { listPublishedNotes, RESEARCH_REPO_URL } from "@/lib/research/notes";

// Must be a literal for Next.js; keep in step with NOTES_REVALIDATE_SECONDS.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Research",
  description: "Research notes from the LaborPulse Research Desk, each backed by an open, reproducible analysis."
};

export default async function ResearchPage() {
  const notes = await listPublishedNotes();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">LaborPulse Research Desk</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">Research</h1>
        <p className="mb-8 mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
          Analyses of workforce, education and labor-market policy. Every number in a note is computed by an open, reproducible pipeline and checked
          against it before publication.
        </p>

        <section className="border-t border-rule" aria-label="Research notes">
          {notes.length === 0 ? (
            <p className="py-8 font-serif text-base italic text-sub">No research notes are available right now. Please check back soon.</p>
          ) : (
            notes.map((note) => (
              <Link key={note.slug} href={`/research/${note.slug}` as Route} className="block border-b border-rule py-6 hover:bg-[var(--lp-navy-tint)]">
                <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.12em] text-navy">
                  {formatNoteDate(note.date)} · {note.byline}
                </p>
                <h2 className="mt-2 font-serif text-[26px] font-semibold leading-tight">{note.title}</h2>
                <p className="mt-2 max-w-3xl font-serif text-[15px] leading-[1.55] text-sub">{note.summary}</p>
              </Link>
            ))
          )}
        </section>

        <section className="mt-8 max-w-3xl border-l-2 border-navy pl-4">
          <h2 className="font-serif text-xl font-semibold">How these notes are made</h2>
          <p className="mt-2 font-serif text-[15px] leading-[1.55] text-ink">
            Each note is written from the results of a versioned analysis pipeline. Before a note is published, an automated check confirms that every
            figure in it matches a computed result or a cited source, and that the results still match what the model produces today. Code, data and
            methods are public in the{" "}
            <a className="font-semibold text-navy underline underline-offset-2" href={RESEARCH_REPO_URL} target="_blank" rel="noopener noreferrer">
              LaborPulse Research repository
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
