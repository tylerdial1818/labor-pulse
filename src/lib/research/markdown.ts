// A small Markdown reader for research notes.
//
// Notes come from the labor-pulse-research repo and use a narrow subset of
// Markdown: headings, paragraphs, bullet lists, bold, italics, inline code and
// links. Parsing into plain data (rather than HTML) means the page renders
// notes as React elements and never injects raw HTML.

export type Inline =
  | { type: "text"; text: string }
  | { type: "strong"; children: Inline[] }
  | { type: "em"; children: Inline[] }
  | { type: "code"; text: string }
  | { type: "link"; href: string; children: Inline[] };

export type Block =
  | { type: "heading"; level: 2 | 3; children: Inline[] }
  | { type: "paragraph"; children: Inline[] }
  | { type: "list"; items: Inline[][] };

const INLINE = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/;

/** Make a link safe to render: http(s) and site paths pass, relative paths resolve against `baseUrl`. */
export function resolveHref(href: string, baseUrl?: string): string | null {
  if (/^https?:\/\//i.test(href) || href.startsWith("/") || href.startsWith("#")) {
    return href;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || !baseUrl) {
    return null;
  }
  return new URL(href, baseUrl).toString();
}

export function parseInline(text: string, baseUrl?: string): Inline[] {
  const out: Inline[] = [];
  let rest = text;
  while (rest) {
    const match = INLINE.exec(rest);
    if (!match) {
      out.push({ type: "text", text: rest });
      break;
    }
    if (match.index > 0) {
      out.push({ type: "text", text: rest.slice(0, match.index) });
    }
    const [whole, strong, em, code, linkText, href] = match;
    if (strong !== undefined) {
      out.push({ type: "strong", children: parseInline(strong, baseUrl) });
    } else if (em !== undefined) {
      out.push({ type: "em", children: parseInline(em, baseUrl) });
    } else if (code !== undefined) {
      out.push({ type: "code", text: code });
    } else {
      const safe = resolveHref(href, baseUrl);
      const children = parseInline(linkText, baseUrl);
      out.push(safe ? { type: "link", href: safe, children } : { type: "text", text: linkText });
    }
    rest = rest.slice(match.index + whole.length);
  }
  return out;
}

/** Parse a note body into blocks. HTML comments are dropped and `# ` titles are skipped (the page renders the title). */
export function parseMarkdown(markdown: string, baseUrl?: string): Block[] {
  const source = markdown.replace(/<!--[\s\S]*?-->/g, "").replace(/\r\n/g, "\n");
  const blocks: Block[] = [];
  for (const chunk of source.split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) {
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(lines[0]);
    if (heading && lines.length === 1) {
      const level = heading[1].length;
      if (level > 1) {
        blocks.push({ type: "heading", level: level as 2 | 3, children: parseInline(heading[2], baseUrl) });
      }
      continue;
    }
    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      blocks.push({ type: "list", items: lines.map((line) => parseInline(line.replace(/^[-*]\s+/, ""), baseUrl)) });
      continue;
    }
    blocks.push({ type: "paragraph", children: parseInline(lines.join(" "), baseUrl) });
  }
  return blocks;
}
