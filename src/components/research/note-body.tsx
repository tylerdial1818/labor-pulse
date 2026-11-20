import { Fragment } from "react";

import { parseMarkdown, type Inline } from "@/lib/research/markdown";

function InlineContent({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        switch (node.type) {
          case "text":
            return <Fragment key={i}>{node.text}</Fragment>;
          case "strong":
            return (
              <strong key={i} className="font-semibold">
                <InlineContent nodes={node.children} />
              </strong>
            );
          case "em":
            return (
              <em key={i}>
                <InlineContent nodes={node.children} />
              </em>
            );
          case "code":
            return (
              <code key={i} className="rounded-sm bg-[var(--lp-navy-tint)] px-1 font-mono text-[0.9em]">
                {node.text}
              </code>
            );
          case "link": {
            const external = /^https?:\/\//.test(node.href);
            return (
              <a
                key={i}
                href={node.href}
                className="font-semibold text-navy underline underline-offset-2 hover:text-ink"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <InlineContent nodes={node.children} />
              </a>
            );
          }
        }
      })}
    </>
  );
}

export function NoteBody({ markdown, baseUrl }: { markdown: string; baseUrl?: string }) {
  const blocks = parseMarkdown(markdown, baseUrl);
  return (
    <div className="max-w-[720px] font-serif text-[17px] leading-[1.65] text-ink">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          const className = "mt-10 font-serif font-semibold leading-tight text-ink";
          return block.level === 2 ? (
            <h2 key={i} className={`${className} text-[26px]`}>
              <InlineContent nodes={block.children} />
            </h2>
          ) : (
            <h3 key={i} className={`${className} text-[20px]`}>
              <InlineContent nodes={block.children} />
            </h3>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="mt-4 list-disc space-y-2 pl-6">
              {block.items.map((item, j) => (
                <li key={j}>
                  <InlineContent nodes={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-4">
            <InlineContent nodes={block.children} />
          </p>
        );
      })}
    </div>
  );
}
