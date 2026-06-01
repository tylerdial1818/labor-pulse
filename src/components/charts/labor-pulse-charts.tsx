"use client";

export type PulseChartPoint = {
  date: string;
  value: number | null;
};

type Tone = "up" | "down" | "info" | "muted";

type NumericPoint = {
  date: string;
  value: number;
};

const toneColor: Record<Tone, string> = {
  up: "var(--lp-up)",
  down: "var(--lp-down)",
  info: "var(--lp-navy)",
  muted: "var(--lp-sub)"
};

function getExtent(data: NumericPoint[]) {
  const min = Math.min(...data.map((point) => point.value));
  const max = Math.max(...data.map((point) => point.value));
  const padding = (max - min || Math.max(Math.abs(max), 1)) * 0.06;

  return { min: min - padding, max: max + padding, range: max - min + padding * 2 || 1 };
}

function parseDateMs(date: string) {
  const parsed = new Date(`${date}T00:00:00.000Z`).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function scaledPoints(data: NumericPoint[], width: number, height: number, padding = 2) {
  const { min, range } = getExtent(data);
  const times = data.map((point) => parseDateMs(point.date));
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const timeRange = maxTime - minTime || 1;

  return data.map((point) => ({
    date: point.date,
    value: point.value,
    x: padding + ((parseDateMs(point.date) - minTime) / timeRange) * (width - padding * 2),
    y: padding + (height - padding * 2) - ((point.value - min) / range) * (height - padding * 2)
  }));
}

function linePath(points: Array<{ x: number; y: number }>) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
}

function formatAxisValue(value: number) {
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (absolute >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  if (absolute >= 100) return value.toFixed(0);
  if (absolute >= 10) return value.toFixed(1);

  return value.toFixed(2).replace(/\.?0+$/, "");
}

function formatAxisDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" }).format(parsed);
}

function valueTicks(min: number, max: number, count = 5) {
  if (count < 2 || min === max) return [max, min];

  return Array.from({ length: count }, (_, index) => max - ((max - min) / (count - 1)) * index);
}

function xTicks(points: NumericPoint[], count = 5) {
  if (points.length <= count) return points;

  return Array.from({ length: count }, (_, index) => points[Math.round((index / (count - 1)) * (points.length - 1))]);
}

function yForValue(value: number, min: number, range: number, plot: { top: number; bottom: number }) {
  return plot.top + (plot.bottom - plot.top) - ((value - min) / range) * (plot.bottom - plot.top);
}

export function IndicatorSparkline({ data, tone, unitLabel }: { data: PulseChartPoint[]; tone: Tone; unitLabel?: string }) {
  const points = data.filter((point): point is NumericPoint => point.value !== null);

  if (points.length < 2) {
    return <div aria-hidden="true" className="h-[48px] w-[132px] border-b border-hair" />;
  }

  const plot = { left: 34, right: 132, top: 6, bottom: 32 };
  const { min, max } = getExtent(points);
  const scaled = scaledPoints(points, plot.right - plot.left, plot.bottom - plot.top, 0).map((point) => ({
    ...point,
    x: point.x + plot.left,
    y: point.y + plot.top
  }));
  const firstPoint = points[0];
  const lastPoint = points.at(-1);
  const last = scaled.at(-1);

  return (
    <svg className="h-[48px] w-[132px]" viewBox="0 0 132 48" aria-hidden="true">
      <text x="0" y="10" fill="var(--lp-sub)" fontSize="6" fontFamily="var(--font-sans, sans-serif)">
        {formatAxisValue(max)}
      </text>
      <text x="0" y="32" fill="var(--lp-sub)" fontSize="6" fontFamily="var(--font-sans, sans-serif)">
        {formatAxisValue(min)}
      </text>
      {unitLabel ? (
        <text x="0" y="44" fill="var(--lp-sub)" fontSize="5.5" fontFamily="var(--font-sans, sans-serif)">
          {unitLabel.slice(0, 7)}
        </text>
      ) : null}
      <line x1={plot.left} x2={plot.right} y1={plot.bottom} y2={plot.bottom} stroke="var(--lp-hair)" />
      <path d={linePath(scaled)} fill="none" stroke="var(--lp-faint)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      {last ? <circle cx={last.x} cy={last.y} r="2.4" fill={toneColor[tone]} /> : null}
      {firstPoint ? (
        <text x={plot.left} y="43" fill="var(--lp-sub)" fontSize="6" fontFamily="var(--font-sans, sans-serif)">
          {formatAxisDate(firstPoint.date)}
        </text>
      ) : null}
      {lastPoint ? (
        <text x={plot.right} y="43" textAnchor="end" fill="var(--lp-sub)" fontSize="6" fontFamily="var(--font-sans, sans-serif)">
          {formatAxisDate(lastPoint.date)}
        </text>
      ) : null}
    </svg>
  );
}

export function TimeSeriesChart({ data, label, units }: { data: PulseChartPoint[]; label: string; units?: string }) {
  const points = data.filter((point): point is NumericPoint => point.value !== null);

  if (points.length < 2) {
    return <div className="h-[320px] border-y border-hair" role="img" aria-label={label} />;
  }

  const plot = { left: 74, right: 878, top: 22, bottom: 286 };
  const { min, max, range } = getExtent(points);
  const scaled = scaledPoints(points, plot.right - plot.left, plot.bottom - plot.top, 0).map((point) => ({
    ...point,
    x: point.x + plot.left,
    y: point.y + plot.top
  }));
  const last = scaled.at(-1);
  const yTicks = valueTicks(min, max).map((value) => ({ value, y: yForValue(value, min, range, plot) }));
  const xAxisTicks = xTicks(points).map((point) => {
    const scaledPoint = scaled.find((item) => item.date === point.date) ?? scaled[0];
    return { ...point, x: scaledPoint.x };
  });
  const zeroY = min < 0 && max > 0 ? yForValue(0, min, range, plot) : null;

  return (
    <svg className="h-[340px] w-full" viewBox="0 0 900 340" role="img" aria-label={label}>
      <text x="8" y="16" fill="var(--lp-sub)" fontSize="11" fontFamily="var(--font-sans, sans-serif)">
        {units ? `Value (${units})` : "Value"}
      </text>
      {yTicks.map((tick) => (
        <g key={tick.value}>
          <line x1={plot.left} x2={plot.right} y1={tick.y} y2={tick.y} stroke="var(--lp-hair)" />
          <text x={plot.left - 10} y={tick.y + 4} textAnchor="end" fill="var(--lp-sub)" fontSize="11" fontFamily="var(--font-sans, sans-serif)">
            {formatAxisValue(tick.value)}
          </text>
        </g>
      ))}
      {zeroY !== null ? (
        <g>
          <line x1={plot.left} x2={plot.right} y1={zeroY} y2={zeroY} stroke="var(--lp-sub)" strokeDasharray="4 5" opacity="0.55" />
          <text x={plot.right + 6} y={zeroY + 4} fill="var(--lp-sub)" fontSize="10" fontFamily="var(--font-sans, sans-serif)">
            0
          </text>
        </g>
      ) : null}
      <line x1={plot.left} x2={plot.left} y1={plot.top} y2={plot.bottom} stroke="var(--lp-hair)" />
      <line x1={plot.left} x2={plot.right} y1={plot.bottom} y2={plot.bottom} stroke="var(--lp-hair)" />
      <path d={linePath(scaled)} fill="none" stroke="var(--lp-navy)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      {last ? <circle cx={last.x} cy={last.y} r="3.2" fill="var(--lp-navy)" stroke="var(--lp-paper)" strokeWidth="2" /> : null}
      {xAxisTicks.map((tick, index) => (
        <g key={tick.date}>
          <line x1={tick.x} x2={tick.x} y1={plot.bottom} y2={plot.bottom + 5} stroke="var(--lp-hair)" />
          <text
            x={tick.x}
            y="312"
            textAnchor={index === 0 ? "start" : index === xAxisTicks.length - 1 ? "end" : "middle"}
            fill="var(--lp-sub)"
            fontSize="11"
            fontFamily="var(--font-sans, sans-serif)"
          >
            {formatAxisDate(tick.date)}
          </text>
        </g>
      ))}
      <text x={(plot.left + plot.right) / 2} y="332" textAnchor="middle" fill="var(--lp-sub)" fontSize="11" fontFamily="var(--font-sans, sans-serif)">
        Observation date
      </text>
    </svg>
  );
}
