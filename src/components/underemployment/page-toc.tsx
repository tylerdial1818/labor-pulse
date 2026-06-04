export type PageTocItem = {
  id: string;
  label: string;
  meta?: string;
};

export type PageTocProps = {
  items: PageTocItem[];
  title?: string;
  className?: string;
};

export function PageToc({ items, title = "On this page", className = "" }: PageTocProps) {
  if (items.length === 0) return null;

  return (
    <nav className={`border-y border-rule py-3 ${className}`} aria-label={title}>
      <p className="mb-2 font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-sub">{title}</p>
      <ol className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a className="inline-flex items-center gap-2 border border-rule px-3 py-2 font-sans text-xs font-semibold text-navy hover:bg-[var(--lp-navy-tint)]" href={`#${item.id}`}>
              <span>{item.label}</span>
              {item.meta ? <span className="font-normal text-sub">{item.meta}</span> : null}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
