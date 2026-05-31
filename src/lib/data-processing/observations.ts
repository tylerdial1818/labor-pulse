import { LABOR_PULSE_GEOGRAPHY_DEFAULT } from "@/types/labor-pulse";
import type { DateString, LaborPulseGeography, Observation } from "@/types/labor-pulse";

export type RawFredObservation = {
  date: string;
  value: string;
};

export function parseFredObservationValue(value: string): number | null {
  if (value === ".") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toLaborPulseObservation(
  seriesId: string,
  observation: RawFredObservation,
  geography: LaborPulseGeography = LABOR_PULSE_GEOGRAPHY_DEFAULT
): Observation {
  return {
    seriesId,
    geography,
    date: observation.date as DateString,
    value: parseFredObservationValue(observation.value)
  };
}

export function toLaborPulseObservations(
  seriesId: string,
  observations: RawFredObservation[],
  geography: LaborPulseGeography = LABOR_PULSE_GEOGRAPHY_DEFAULT
): Observation[] {
  return observations.map((observation) => toLaborPulseObservation(seriesId, observation, geography));
}
