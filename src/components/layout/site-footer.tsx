import Link from "next/link";
import type { Route } from "next";

import { appConfig } from "@/config/app";

const footerLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/insights", label: "Research Monitor" },
  { href: "/sources", label: "Data & Methods" },
  { href: "/about", label: "About" },
  { href: "/sources#corrections", label: "Corrections" }
] satisfies Array<{ href: string; label: string }>;

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-paper text-ink">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-[23px] font-bold leading-none tracking-[-0.015em]">Labor Pulse</p>
          <p className="mt-3 max-w-md font-serif text-[15px] leading-[1.5] text-sub">
            A public research service for understanding change in the U.S. labor market.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Explore</p>
          <ul className="mt-3 grid gap-2 font-sans text-sm text-sub">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-ink hover:underline" href={item.href as Route}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Stewardship</p>
          <p className="mt-3 font-sans text-sm leading-[1.55] text-sub">
            Developed and maintained by{" "}
            <a className="font-semibold text-navy hover:underline" href={appConfig.firmUrl}>
              {appConfig.firmName}
            </a>
            .
          </p>
          <p className="mt-3 font-sans text-sm leading-[1.55] text-sub">
            Research collaborations and corrections can be sent to{" "}
            <a className="font-semibold text-navy hover:underline" href={`mailto:${appConfig.researchEmail}`}>
              {appConfig.researchEmail}
            </a>
            .
          </p>
        </div>
      </div>
      <div className="border-t border-rule">
        <p className="mx-auto max-w-[1180px] px-4 py-4 font-sans text-[11px] text-sub sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Labor Pulse
        </p>
      </div>
    </footer>
  );
}
