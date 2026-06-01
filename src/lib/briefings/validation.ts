import { BRIEFING_AUDIENCES, BRIEFING_HORIZONS, type BriefingRequest } from "@/lib/briefings/generator";

type ValidationResult =
  | { ok: true; value: BriefingRequest }
  | { ok: false; status: 400; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<T extends readonly string[]>(value: unknown, options: T): value is T[number] {
  return typeof value === "string" && options.includes(value);
}

export function validateBriefingRequest(body: unknown, validIndicatorIds: Set<string>): ValidationResult {
  if (!isRecord(body)) {
    return { ok: false, status: 400, errors: ["Request body must be an object."] };
  }

  const errors: string[] = [];
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const geography = typeof body.geography === "string" ? body.geography.trim() : "US";
  const indicatorIds = Array.isArray(body.indicatorIds) ? body.indicatorIds.filter((id): id is string => typeof id === "string") : [];
  const includeMethodology = typeof body.includeMethodology === "boolean" ? body.includeMethodology : true;

  if (title.length > 120) errors.push("Title must be 120 characters or fewer.");
  if (!isOneOf(body.audience, BRIEFING_AUDIENCES)) errors.push("Audience is invalid.");
  if (!isOneOf(body.horizon, BRIEFING_HORIZONS)) errors.push("Horizon is invalid.");
  if (!/^[A-Za-z0-9 ,.-]{2,40}$/.test(geography)) errors.push("Geography contains unsupported characters.");
  if (indicatorIds.length < 1 || indicatorIds.length > 8) errors.push("Select between 1 and 8 indicators.");

  const unknownIds = indicatorIds.filter((id) => !validIndicatorIds.has(id));
  if (unknownIds.length > 0) errors.push(`Unknown indicators: ${unknownIds.join(", ")}.`);

  if (errors.length > 0 || !isOneOf(body.audience, BRIEFING_AUDIENCES) || !isOneOf(body.horizon, BRIEFING_HORIZONS)) {
    return { ok: false, status: 400, errors };
  }

  return {
    ok: true,
    value: {
      title,
      audience: body.audience,
      horizon: body.horizon,
      geography,
      indicatorIds,
      includeMethodology
    }
  };
}
