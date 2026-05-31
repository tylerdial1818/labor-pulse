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

const MAX_ATTEMPTS = 4;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  // FRED throttles bursts with 429s; retry transient throttling/5xx with
  // backoff, honoring the Retry-After header when provided.
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        accept: "application/json"
      },
      next: {
        revalidate: 0
      }
    });

    if (response.ok) {
      return response.json() as Promise<unknown>;
    }

    const retryable = response.status === 429 || response.status >= 500;

    if (!retryable || attempt >= MAX_ATTEMPTS) {
      throw new Error(`FRED request failed with status ${response.status}.`);
    }

    const retryAfter = Number(response.headers.get("retry-after"));
    const backoffMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** (attempt - 1);
    await sleep(backoffMs);
  }
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
