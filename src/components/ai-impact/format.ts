/** "2026-08-12" -> "Aug 12, 2026"; "2026-05" -> "May 2026". */
export function formatSourceDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month) return value;
  const date = new Date(Date.UTC(year, month - 1, day ?? 1));
  return new Intl.DateTimeFormat("en-US", day ? { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" } : { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export function formatPercent(value: number | null, decimals = 1): string {
  return value === null ? "not available" : `${value.toFixed(decimals)}%`;
}

export function formatSignedPoints(value: number | null, unit = "pp"): string {
  if (value === null) return "";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1)} ${unit}`;
}

export function formatSignedPercent(value: number | null): string {
  if (value === null) return "not available";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}
