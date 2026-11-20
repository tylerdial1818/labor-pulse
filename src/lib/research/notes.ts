// Research notes published from the labor-pulse-research repository.
//
// That repo's `notes/index.json` lists every note, and each note is a Markdown
// file with front matter. Both are read from the repo's main branch and cached
// for an hour, so a merged note appears on the site without a deploy. Every
// number in a note is checked against computed facts before it can merge
// (`lpresearch check-notes` in that repo's CI).

import { z } from "zod";

export const RESEARCH_REPO = "tylerdial1818/labor-pulse-research";
export const RESEARCH_REPO_URL = `https://github.com/${RESEARCH_REPO}`;
// Branch to read notes from. Override only to preview unmerged notes.
const NOTES_REF = process.env.RESEARCH_NOTES_REF ?? "main";
const RAW_BASE = `https://raw.githubusercontent.com/${RESEARCH_REPO}/${NOTES_REF}/notes/`;
const BLOB_BASE = `${RESEARCH_REPO_URL}/blob/${NOTES_REF}/notes/`;
export const NOTES_REVALIDATE_SECONDS = 3600;

const noteEntrySchema = z.object({
  study: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  path: z.string().regex(/^[a-z0-9_]+\/[a-z0-9-]+\/note\.md$/),
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  byline: z.string(),
  model_version: z.string(),
  status: z.enum(["draft", "published"]),
  summary: z.string()
});

const noteIndexSchema = z.object({
  schema_version: z.literal(1),
  notes: z.array(noteEntrySchema)
});

export type NoteEntry = z.infer<typeof noteEntrySchema>;

export type Note = NoteEntry & {
  body: string;
  sourceUrl: string;
  factsUrl: string;
};

type Fetcher = (url: string) => Promise<Response>;

const cachedFetch: Fetcher = (url) => fetch(url, { next: { revalidate: NOTES_REVALIDATE_SECONDS } });

/** Published notes only, newest first. Validation failures and outages return an empty list. */
export function publishedNotes(index: unknown): NoteEntry[] {
  const parsed = noteIndexSchema.safeParse(index);
  if (!parsed.success) {
    return [];
  }
  return parsed.data.notes
    .filter((note) => note.status === "published")
    .sort((a, b) => (a.date === b.date ? b.slug.localeCompare(a.slug) : b.date.localeCompare(a.date)));
}

/** The prose of a note: front matter and the `# ` title line removed. */
export function noteProse(markdown: string): string {
  const withoutFront = markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
  return withoutFront.replace(/^\s*#\s+.*\n/, "");
}

export function noteSourceUrl(entry: NoteEntry): string {
  return `${BLOB_BASE}${entry.path}`;
}

export async function listPublishedNotes(fetcher: Fetcher = cachedFetch): Promise<NoteEntry[]> {
  try {
    const response = await fetcher(`${RAW_BASE}index.json`);
    if (!response.ok) {
      return [];
    }
    return publishedNotes(await response.json());
  } catch {
    return [];
  }
}

export async function getPublishedNote(slug: string, fetcher: Fetcher = cachedFetch): Promise<Note | null> {
  const entry = (await listPublishedNotes(fetcher)).find((note) => note.slug === slug);
  if (!entry) {
    return null;
  }
  try {
    const response = await fetcher(`${RAW_BASE}${entry.path}`);
    if (!response.ok) {
      return null;
    }
    const sourceUrl = noteSourceUrl(entry);
    return {
      ...entry,
      body: noteProse(await response.text()),
      sourceUrl,
      factsUrl: sourceUrl.replace(/note\.md$/, "facts.json")
    };
  } catch {
    return null;
  }
}
