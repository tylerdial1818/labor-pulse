import "server-only";

import { parseFredObservationResponse, parseFredSeriesResponse } from "@/lib/fred/schemas";
import type { ParsedFredObservation } from "@/lib/fred/schemas";

const FRED_API_BASE_URL = "https://api.stlouisfed.org/fred";

type FredClientOptions = {
  apiKey?: string;
  baseUrl?: string;
};

export type FredClient = {
  getSeries(seriesId: string): Promise<ReturnType<typeof parseFredSeriesResponse>>;
  getObservations(seriesId: string, options?: { observationStart?: string }): Promise<ParsedFredObservation[]>;
};

function getApiKey(apiKey?: string) {
  const resolved = apiKey ?? process.env.FRED_API_KEY;

  if (!resolved) {
    throw new Error("FRED_API_KEY is required for FRED requests.");
  }

  return resolved;
}

async function fetchFredJson(path: string, params: Record<string, string>, options: FredClientOptions) {
  const url = new URL(`${options.baseUrl ?? FRED_API_BASE_URL}${path}`);
  const apiKey = getApiKey(options.apiKey);

  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("file_type", "json");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: {
      accept: "application/json"
    },
    next: {
      revalidate: 0
    }
  });

  if (!response.ok) {
    throw new Error(`FRED request failed with status ${response.status}.`);
  }

  return response.json() as Promise<unknown>;
}

export function createFredClient(options: FredClientOptions = {}): FredClient {
  return {
    async getSeries(seriesId) {
      const payload = await fetchFredJson("/series", { series_id: seriesId }, options);
      return parseFredSeriesResponse(payload);
    },
    async getObservations(seriesId, requestOptions = {}) {
      const params: Record<string, string> = {
        series_id: seriesId
      };

      if (requestOptions.observationStart) {
        params.observation_start = requestOptions.observationStart;
      }

      const payload = await fetchFredJson("/series/observations", params, options);
      return parseFredObservationResponse(payload);
    }
  };
}
