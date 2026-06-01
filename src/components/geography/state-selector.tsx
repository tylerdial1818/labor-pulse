"use client";

import { US_STATE_OPTIONS, buildStateSeriesId } from "@/lib/geo/states";

type StateSelectorProps = {
  id?: string;
  label?: string;
  value: string;
  seriesPattern?: string | null;
  onChange: (value: string) => void;
};

export function StateSelector({ id = "state-selector", label = "State", value, seriesPattern, onChange }: StateSelectorProps) {
  const stateSeriesId = buildStateSeriesId(seriesPattern, value);

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-sub">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded border border-rule bg-paper px-3 font-sans text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
      >
        {US_STATE_OPTIONS.map((state) => (
          <option key={state.fips} value={state.abbreviation}>
            {state.name} ({state.abbreviation}) - FIPS {state.fips}
          </option>
        ))}
      </select>
      {seriesPattern ? (
        <span className="mt-2 block font-sans text-[11.5px] text-sub">
          Series pattern: <span className="font-semibold text-ink">{stateSeriesId ?? "not available"}</span>
        </span>
      ) : null}
    </label>
  );
}
