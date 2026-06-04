"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/insights", label: "Insights" },
  { href: "/ai-impact", label: "AI Impact" },
  { href: "/underemployment", label: "Underemployment" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" }
] satisfies Array<{ href: string; label: string }>;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-4 py-[18px] sm:px-6 md:flex-row md:items-end md:justify-between md:py-5 lg:px-8">
        <Link href="/" className="inline-flex w-fit items-end gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">
          <span className="whitespace-nowrap font-serif text-[23px] font-bold leading-none tracking-[-0.015em] text-ink">LaborPulse</span>
          <span className="whitespace-nowrap pb-[1px] font-sans text-[10.5px] font-semibold uppercase leading-none tracking-[0.16em] text-navy">
            US Labor Market Monitor
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-x-[22px] gap-y-3 font-sans text-[13.5px] font-medium max-[520px]:gap-x-5 max-[520px]:text-[12.5px]">
          {navItems.map((item) => {
            const isCurrent = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "border-b-2 border-transparent pb-[5px] text-sub transition-colors hover:text-ink",
                  isCurrent && "border-navy pb-[3px] font-semibold text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
