import { describe, expect, it } from "vitest";

import { PRODUCTION_URL, resolveAppUrl } from "@/config/app";
import { parseInline, parseMarkdown, resolveHref } from "@/lib/research/markdown";
import { getPublishedNote, listPublishedNotes, noteProse, publishedNotes } from "@/lib/research/notes";

const entry = (overrides: Record<string, string> = {}) => ({
  study: "utah_roi",
  slug: "2026-11-20-what-utah-gets-back",
  path: "utah_roi/2026-11-20-what-utah-gets-back/note.md",
  title: "What Utah gets back",
  date: "2026-11-20",
  byline: "LaborPulse Research Desk",
  model_version: "0.1.0",
  status: "published",
  summary: "Summary.",
  ...overrides
});

const NOTE_MD = `---
title: "What Utah gets back"
status: "published"
---
# What Utah gets back

First paragraph.
`;

function fakeFetch(files: Record<string, string>) {
  return async (url: string) => {
    const key = Object.keys(files).find((name) => url.endsWith(name));
    return key ? new Response(files[key]) : new Response("missing", { status: 404 });
  };
}

describe("resolveAppUrl", () => {
  it("uses the canonical domain in production whatever NEXT_PUBLIC_APP_URL says", () => {
    expect(resolveAppUrl({ VERCEL_ENV: "production", NEXT_PUBLIC_APP_URL: "https://labor-pulse.vercel.app" })).toBe(PRODUCTION_URL);
    expect(resolveAppUrl({ NEXT_PUBLIC_VERCEL_ENV: "production" })).toBe("https://laborpulse.org");
  });

  it("uses the configured URL elsewhere", () => {
    expect(resolveAppUrl({ VERCEL_ENV: "preview", NEXT_PUBLIC_APP_URL: "https://preview.example" })).toBe("https://preview.example");
    expect(resolveAppUrl({})).toBe("http://localhost:3000");
  });
});

describe("publishedNotes", () => {
  it("keeps published notes, newest first", () => {
    const index = {
      schema_version: 1,
      notes: [
        entry({ slug: "2026-01-01-old", path: "utah_roi/2026-01-01-old/note.md", date: "2026-01-01" }),
        entry({ slug: "2026-12-01-draft", path: "utah_roi/2026-12-01-draft/note.md", date: "2026-12-01", status: "draft" }),
        entry()
      ]
    };
    expect(publishedNotes(index).map((n) => n.slug)).toEqual(["2026-11-20-what-utah-gets-back", "2026-01-01-old"]);
  });

  it("rejects an index with an unexpected shape or unsafe path", () => {
    expect(publishedNotes({ schema_version: 2, notes: [entry()] })).toEqual([]);
    expect(publishedNotes({ schema_version: 1, notes: [entry({ path: "../../secrets/note.md" })] })).toEqual([]);
  });
});

describe("fetching notes", () => {
  it("loads a published note without its front matter or title", async () => {
    const fetcher = fakeFetch({
      "notes/index.json": JSON.stringify({ schema_version: 1, notes: [entry()] }),
      "note.md": NOTE_MD
    });
    const note = await getPublishedNote("2026-11-20-what-utah-gets-back", fetcher);
    expect(note?.body.trim()).toBe("First paragraph.");
    expect(note?.factsUrl).toBe(
      "https://github.com/tylerdial1818/labor-pulse-research/blob/main/notes/utah_roi/2026-11-20-what-utah-gets-back/facts.json"
    );
  });

  it("returns nothing when GitHub is unavailable or the slug is unknown", async () => {
    const failing = async () => {
      throw new Error("network down");
    };
    expect(await listPublishedNotes(failing)).toEqual([]);
    const fetcher = fakeFetch({ "notes/index.json": JSON.stringify({ schema_version: 1, notes: [entry()] }) });
    expect(await getPublishedNote("no-such-note", fetcher)).toBeNull();
  });

  it("strips front matter and the title line", () => {
    expect(noteProse(NOTE_MD).trim()).toBe("First paragraph.");
  });
});

describe("parseMarkdown", () => {
  it("reads headings, paragraphs and lists, dropping the title and comments", () => {
    const blocks = parseMarkdown("# Title\n\n<!-- note -->\n\n## Section\n\nOne\nline.\n\n- **A:** first\n- second\n");
    expect(blocks).toEqual([
      { type: "heading", level: 2, children: [{ type: "text", text: "Section" }] },
      { type: "paragraph", children: [{ type: "text", text: "One line." }] },
      {
        type: "list",
        items: [
          [{ type: "strong", children: [{ type: "text", text: "A:" }] }, { type: "text", text: " first" }],
          [{ type: "text", text: "second" }]
        ]
      }
    ]);
  });

  it("keeps safe links, resolves relative ones and drops javascript: links", () => {
    const base = "https://github.com/o/r/blob/main/notes/s/n/note.md";
    expect(parseInline("[docs](../../../docs/x.md)", base)).toEqual([
      { type: "link", href: "https://github.com/o/r/blob/main/docs/x.md", children: [{ type: "text", text: "docs" }] }
    ]);
    expect(parseInline("[bad](javascript:alert(1))", base)[0]).toMatchObject({ type: "text" });
    expect(resolveHref("https://laborpulse.org/research")).toBe("https://laborpulse.org/research");
    expect(resolveHref("mailto:someone@example.com")).toBeNull();
  });

  it("renders raw HTML as text rather than markup", () => {
    expect(parseMarkdown("<script>alert(1)</script>")).toEqual([
      { type: "paragraph", children: [{ type: "text", text: "<script>alert(1)</script>" }] }
    ]);
  });
});
