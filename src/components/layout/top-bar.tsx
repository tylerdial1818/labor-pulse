"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/jobs", label: "Jobs" },
  { href: "/wages", label: "Wages" },
  { href: "/education", label: "Education", alsoActiveFor: ["/underemployment"] },
  { href: "/ai-impact", label: "AI Impact" },
  { href: "/research", label: "Research" },
  { href: "/insights", label: "Research Monitor" },
  { href: "/sources", label: "Data & Methods" },
  { href: "/glossary", label: "Glossary" }
] satisfies Array<{ href: string; label: string; alsoActiveFor?: string[] }>;

function isActiveRoute(pathname: string, href: string, alsoActiveFor: string[] = []) {
  return [href, ...alsoActiveFor].some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

type TopBarProps = {
  /**
   * "home" pairs the bar with the large masthead on `/`: the bar gets the double
   * rule on top and its wordmark fades in once the masthead scrolls away.
   */
  variant?: "default" | "home";
};

/** Compact sticky navigation used on every page, with a decorative scroll progress line. */
export function TopBar({ variant = "default" }: TopBarProps) {
  const pathname = usePathname();
  const isHome = variant === "home";

  return (
    <header className={cn("sticky top-0 z-30 border-b border-ink bg-paper", isHome && "border-t-4 border-double border-t-ink")}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-4 py-[10px] sm:px-6 md:min-h-[56px] md:flex-row md:items-center md:justify-between md:gap-6 md:py-2 lg:px-8">
        <Link
          href="/"
          className={cn(
            "inline-flex w-fit items-baseline gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy",
            isHome && "lp-brand-fade"
          )}
        >
          <span className="whitespace-nowrap font-serif text-[21px] font-bold leading-none tracking-[-0.015em] text-ink">Labor Pulse</span>
          <span className="hidden whitespace-nowrap font-sans text-[10.5px] font-semibold uppercase leading-none tracking-[0.16em] text-navy lg:inline">
            US Labor Market Monitor
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-x-[22px] gap-y-2 font-sans text-[13.5px] font-medium max-[767px]:gap-x-4 max-[767px]:text-[12.5px]">
          {navItems.map((item) => {
            const isCurrent = isActiveRoute(pathname, item.href, "alsoActiveFor" in item ? item.alsoActiveFor : undefined);

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "border-b-2 border-transparent pb-[3px] pt-[5px] text-sub transition-colors hover:text-ink",
                  isCurrent && "border-navy font-semibold text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div aria-hidden="true" className="lp-progress h-[3px] bg-navy" />
    </header>
  );
}
