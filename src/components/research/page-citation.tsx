import { appConfig } from "@/config/app";

type PageCitationProps = {
  title: string;
  path: string;
  source?: string;
  publishedAt?: string;
  updatedAt?: string;
  className?: string;
};

function formatPublicDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(typeof value === "string" ? new Date(`${value}T00:00:00.000Z`) : value);
}

function absolutePageUrl(path: string) {
  const base = appConfig.url.endsWith("/") ? appConfig.url : `${appConfig.url}/`;
  return new URL(path.replace(/^\//, ""), base).toString();
}

export function PageCitation({ title, path, source, publishedAt, updatedAt, className = "" }: PageCitationProps) {
  const accessDate = formatPublicDate(new Date());
  const publicationDetails = publishedAt
    ? ` Published ${formatPublicDate(publishedAt)}.${updatedAt ? ` Updated ${formatPublicDate(updatedAt)}.` : ""}`
    : "";
  const sourceDetails = source ? ` Data source: ${source}.` : "";
  const citation = `Labor Pulse Research. “${title}.” Labor Pulse. Dialed Intelligence LLC.${publicationDetails} Retrieved ${accessDate}, from ${absolutePageUrl(path)}.${sourceDetails}`;

  return (
    <section className={`border-y border-rule py-5 ${className}`} aria-labelledby={`cite-${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>
      <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Use in research</p>
      <h2 id={`cite-${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} className="mt-2 font-serif text-2xl font-semibold">
        Cite this page
      </h2>
      <p className="mt-3 max-w-4xl font-serif text-[15px] leading-[1.55] text-ink">{citation}</p>
      <p className="mt-2 max-w-3xl font-sans text-xs leading-[1.5] text-sub">
        Cite the original publisher when referring to the underlying data. Use this citation for the Labor Pulse presentation and interpretation.
      </p>
    </section>
  );
}
