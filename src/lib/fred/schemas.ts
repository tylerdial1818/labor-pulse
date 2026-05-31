export type FredSeriesMetadata = {
  id: string;
  title: string;
  units: string;
  frequency: string;
  seasonal_adjustment: string | null;
  last_updated: string | null;
};

export type FredObservation = {
  date: string;
  value: string;
};

export type ParsedFredObservation = {
  date: string;
  value: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDateString(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value : null;
}

export function parseFredSeriesResponse(payload: unknown): FredSeriesMetadata {
  if (!isRecord(payload) || !Array.isArray(payload.seriess)) {
    throw new Error("Invalid FRED series response: expected seriess array.");
  }

  const first = payload.seriess[0];

  if (!isRecord(first) || typeof first.id !== "string" || typeof first.title !== "string") {
    throw new Error("Invalid FRED series response: missing required series metadata.");
  }

  return {
    id: first.id,
    title: first.title,
    units: typeof first.units === "string" ? first.units : "",
    frequency: typeof first.frequency === "string" ? first.frequency : "",
    seasonal_adjustment: optionalString(first.seasonal_adjustment),
    last_updated: optionalString(first.last_updated)
  };
}

export function parseFredObservationResponse(payload: unknown): ParsedFredObservation[] {
  if (!isRecord(payload) || !Array.isArray(payload.observations)) {
    throw new Error("Invalid FRED observation response: expected observations array.");
  }

  return payload.observations.map((entry, index) => {
    if (!isRecord(entry) || !isDateString(entry.date) || typeof entry.value !== "string") {
      throw new Error(`Invalid FRED observation at index ${index}.`);
    }

    if (entry.value === ".") {
      return {
        date: entry.date,
        value: null
      };
    }

    const value = Number(entry.value);

    if (!Number.isFinite(value)) {
      throw new Error(`Invalid FRED numeric value at index ${index}.`);
    }

    return {
      date: entry.date,
      value
    };
  });
}
