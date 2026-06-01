import Link from "next/link";
import type { Route } from "next";

const navItems = [
  { href: "/", label: "Dashboard", current: true },
  { href: "/insights", label: "Insights", current: false },
  { href: "/ai-impact", label: "AI Impact", current: false },
  { href: "/briefings", label: "Briefings", current: false },
  { href: "/sources", label: "Sources", current: false },
  { href: "/about", label: "About", current: false }
] satisfies Array<{ href: string; label: string; current: boolean }>;

export function TopBar() {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-4 py-[18px] sm:px-6 md:flex-row md:items-end md:justify-between md:py-5 lg:px-8">
        <Link href="/" className="inline-flex w-fit items-end gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">
          <span className="whitespace-nowrap font-serif text-[23px] font-bold leading-none tracking-[-0.015em] text-ink">LaborPulse</span>
          <span className="whitespace-nowrap pb-[1px] font-sans text-[10.5px] font-semibold uppercase leading-none tracking-[0.16em] text-navy">
            US Labor Market Monitor
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-[26px] font-sans text-[13.5px] font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              aria-current={item.current ? "page" : undefined}
              className={
                item.current
                  ? "border-b-2 border-navy pb-[3px] font-semibold text-ink"
                  : "pb-[5px] text-sub transition-colors hover:text-ink"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
