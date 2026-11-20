import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";

import { TopBar } from "@/components/layout/top-bar";
import { NoteBody } from "@/components/research/note-body";
import { PageCitation } from "@/components/research/page-citation";
import { formatNoteDate } from "@/lib/research/format";
import { getPublishedNote } from "@/lib/research/notes";

// Must be a literal for Next.js; keep in step with NOTES_REVALIDATE_SECONDS.
export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const note = await getPublishedNote(slug);
  if (!note) {
    return { title: "Research" };
  }
  return {
    title: note.title,
    description: note.summary,
    openGraph: { type: "article", title: note.title, description: note.summary, publishedTime: note.date }
  };
}

export default async function ResearchNotePage({ params }: Params) {
  const { slug } = await params;
  const note = await getPublishedNote(slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <Link href={"/research" as Route} className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy hover:underline">
          Research
        </Link>
        <article className="mt-3">
          <h1 className="max-w-4xl font-serif text-[40px] font-bold leading-[1.05] tracking-[-0.02em]">{note.title}</h1>
          <p className="mt-4 font-sans text-[12px] uppercase tracking-[0.08em] text-sub">
            {note.byline} · {formatNoteDate(note.date)} · Model version {note.model_version}
          </p>
          <div className="mt-6 border-t border-rule pt-2">
            <NoteBody markdown={note.body} baseUrl={note.sourceUrl} />
          </div>
        </article>

        <section className="mt-10 max-w-[720px] border border-rule bg-[var(--lp-navy-tint)] px-5 py-4" aria-labelledby="note-reproducibility">
          <p id="note-reproducibility" className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">
            Reproducibility
          </p>
          <p className="mt-2 font-serif text-[15px] leading-[1.55] text-ink">
            Every figure in this note was checked against the computed results it was written from. See the{" "}
            <a className="font-semibold text-navy underline underline-offset-2" href={note.sourceUrl} target="_blank" rel="noopener noreferrer">
              note source
            </a>{" "}
            and its{" "}
            <a className="font-semibold text-navy underline underline-offset-2" href={note.factsUrl} target="_blank" rel="noopener noreferrer">
              facts snapshot
            </a>
            .
          </p>
        </section>

        <PageCitation className="mt-8" title={note.title} path={`/research/${note.slug}`} publishedAt={note.date} source="LaborPulse Research calculations" />
      </main>
    </div>
  );
}
