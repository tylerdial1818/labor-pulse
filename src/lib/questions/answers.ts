/**
 * Rule-based short answers for the question cards.
 *
 * Every sentence is built from the latest stored data by a written rule, so the
 * number in an answer always matches the chart beside it and never goes stale.
 * A rule returns null when its inputs are missing; the card then says the data
 * is unavailable instead of guessing.
 */

export type IndicatorSnapshot = {
  id: string;
  currentValue: number | null;
  currentValueFormatted: string;
  unitLabel: string;
  currentDate: string | null;
  delta: { value: number | null; formatted: string; periodLabel: string };
};

export type CompositeSnapshot = {
  id: string;
  currentValue: number;
  asOfDate: string;
  interpretation: { label: string };
};

export type ShortAnswer = {
  text: string;
  asOf: string | null;
};

export type MajorSnapshot = {
  name: string;
  underemploymentRate: number;
  wagePremium: number;
};

const ATTACHED_UNITS = new Set(["%", "K", "M", "/hr"]);

/** "4.3%", "$36.30/hr", "220K", "7.2M", "34.2 hours": the value with its unit. */
export function valueWithUnit(indicator: IndicatorSnapshot): string {
  const unit = indicator.unitLabel.trim();
  if (!unit) return indicator.currentValueFormatted;
  if (ATTACHED_UNITS.has(unit)) return `${indicator.currentValueFormatted}${unit}`;
  if (unit === "hrs") return `${indicator.currentValueFormatted} hours`;
  return `${indicator.currentValueFormatted} ${unit}`;
}

function comparisonPhrase(periodLabel: string): string {
  if (periodLabel === "vs. year ago") return "from a year earlier";
  if (periodLabel === "vs. 4 weeks ago") return "from four weeks earlier";
  if (periodLabel === "since last release") return "since the last release";
  return periodLabel.replace(/^vs\.\s*/, "from ");
}

/** "up 0.2 pp from a year earlier" / "unchanged from a year earlier"; null if no comparison exists. */
export function describeChange(indicator: IndicatorSnapshot): string | null {
  const { value, formatted, periodLabel } = indicator.delta;
  if (value === null || formatted === "not available") return null;
  const when = comparisonPhrase(periodLabel);
  if (value === 0 || formatted === "flat") return `unchanged ${when}`;
  const magnitude = formatted.replace(/^[+-]/, "").replace(/ hrs$/, " hours");
  return `${value > 0 ? "up" : "down"} ${magnitude} ${when}`;
}

/** Value, an optional noun after it ("job openings"), then the change: "7.2M job openings, down 1.0M from a year earlier". */
function valueAndChange(indicator: IndicatorSnapshot, noun = ""): string {
  const change = describeChange(indicator);
  const value = noun ? `${valueWithUnit(indicator)} ${noun}` : valueWithUnit(indicator);
  return change ? `${value}, ${change}` : value;
}

function hasValue(indicator: IndicatorSnapshot | undefined): indicator is IndicatorSnapshot {
  return Boolean(indicator && indicator.currentValue !== null);
}

const TIGHTNESS_MEANING: Record<string, string> = {
  Tight: "employers are competing for workers, so jobs are relatively easy to find",
  Balanced: "neither job seekers nor employers have a clear edge",
  Slack: "employers have the upper hand and jobs are harder to find than usual"
};

const STRESS_MEANING: Record<string, string> = {
  "Low stress": "signs of layoffs and cut hours are calmer than usual",
  Watch: "signs of layoffs and cut hours are near their normal range",
  "Elevated stress": "signs of layoffs and cut hours are running higher than usual"
};

export function answerJobMarketNow(unemployment: IndicatorSnapshot | undefined, tightness: CompositeSnapshot | undefined): ShortAnswer | null {
  if (!hasValue(unemployment)) return null;
  let text = `The unemployment rate is ${valueAndChange(unemployment)}.`;
  if (tightness) {
    const meaning = TIGHTNESS_MEANING[tightness.interpretation.label];
    text += ` Our labor market tightness measure reads "${tightness.interpretation.label}"${meaning ? `: ${meaning}` : ""}.`;
  }
  return { text, asOf: unemployment.currentDate };
}

export function answerRecessionRisk(sahm: CompositeSnapshot | undefined): ShortAnswer | null {
  if (!sahm) return null;
  const reading = sahm.currentValue.toFixed(2);
  const label = sahm.interpretation.label;
  let text: string;
  if (label === "Recession signal") {
    text = `A warning is flashing. The Sahm Rule reading is ${reading}, at or above the 0.50 level that has marked the start of past recessions.`;
  } else if (label === "Caution") {
    text = `No recession signal so far. The Sahm Rule reading is ${reading}, below the 0.50 trigger, though unemployment has risen from its low over the past year.`;
  } else {
    text = `No recession signal. The Sahm Rule reading is ${reading}: unemployment has not risen above its low over the past year.`;
  }
  return { text, asOf: sahm.asOfDate };
}

export function answerFindingAJob(
  openings: IndicatorSnapshot | undefined,
  quits: IndicatorSnapshot | undefined,
  tightness: CompositeSnapshot | undefined
): ShortAnswer | null {
  if (!hasValue(openings) && !hasValue(quits) && !tightness) return null;
  const parts: string[] = [];
  if (hasValue(openings)) parts.push(`Employers list ${valueAndChange(openings, "job openings")}.`);
  if (hasValue(quits)) parts.push(`The quits rate is ${valueAndChange(quits)}.`);
  if (tightness) {
    const meaning = TIGHTNESS_MEANING[tightness.interpretation.label];
    parts.push(`Overall the market reads "${tightness.interpretation.label}"${meaning ? `: ${meaning}` : ""}.`);
  }
  return { text: parts.join(" "), asOf: openings?.currentDate ?? quits?.currentDate ?? tightness?.asOfDate ?? null };
}

export function answerLayoffs(
  claims: IndicatorSnapshot | undefined,
  layoffsRate: IndicatorSnapshot | undefined,
  stress: CompositeSnapshot | undefined
): ShortAnswer | null {
  if (!hasValue(claims) && !hasValue(layoffsRate) && !stress) return null;
  const parts: string[] = [];
  if (hasValue(claims)) parts.push(`New jobless claims are running at ${valueAndChange(claims, "a week")}.`);
  if (hasValue(layoffsRate)) parts.push(`The monthly layoffs rate is ${valueAndChange(layoffsRate)}.`);
  if (stress) {
    const meaning = STRESS_MEANING[stress.interpretation.label];
    parts.push(`Our stress measure reads "${stress.interpretation.label}"${meaning ? `: ${meaning}` : ""}.`);
  }
  return { text: parts.join(" "), asOf: claims?.currentDate ?? layoffsRate?.currentDate ?? stress?.asOfDate ?? null };
}

export function answerUnemploymentMeasures(unemployment: IndicatorSnapshot | undefined, u6: IndicatorSnapshot | undefined): ShortAnswer | null {
  if (!hasValue(unemployment) || !hasValue(u6)) return null;
  return {
    text: `They count different groups. The headline unemployment rate is ${valueWithUnit(unemployment)}. U-6, which also counts people who have stopped looking and part-time workers who want full-time hours, is ${valueWithUnit(u6)}.`,
    asOf: u6.currentDate ?? unemployment.currentDate
  };
}

export function answerPaychecks(earnings: IndicatorSnapshot | undefined): ShortAnswer | null {
  if (!hasValue(earnings)) return null;
  return {
    text: `Average hourly pay for private-sector workers is ${valueAndChange(earnings)}. That is before adjusting for inflation.`,
    asOf: earnings.currentDate
  };
}

export function answerHours(hours: IndicatorSnapshot | undefined): ShortAnswer | null {
  if (!hasValue(hours)) return null;
  return { text: `The average private-sector workweek is ${valueAndChange(hours)}.`, asOf: hours.currentDate };
}

function percent(value: number) {
  return `${value.toFixed(1)}%`;
}

function dollars(value: number) {
  return Math.abs(value).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function answerGraduateUnderemployment(recentGrads: number | null, asOfDate: string | null): ShortAnswer | null {
  if (recentGrads === null || !Number.isFinite(recentGrads)) return null;
  return {
    text: `${percent(recentGrads)} of employed recent college graduates work in jobs that do not typically require a degree.`,
    asOf: asOfDate
  };
}

export function answerUnderemploymentWithExperience(recentGrads: number | null, allGrads: number | null, asOfDate: string | null): ShortAnswer | null {
  if (recentGrads === null || allGrads === null || !Number.isFinite(recentGrads) || !Number.isFinite(allGrads)) return null;
  const comparison = `The rate is ${percent(recentGrads)} for recent graduates and ${percent(allGrads)} for all college graduates.`;
  if (allGrads < recentGrads) {
    return {
      text: `Partly. ${comparison} The lower rate among all graduates suggests many move into degree-level jobs as they gain experience, but not all do.`,
      asOf: asOfDate
    };
  }
  return {
    text: `Not clearly. ${comparison} Older graduates are not less likely to be underemployed in the latest data.`,
    asOf: asOfDate
  };
}

export function answerMajors(majors: MajorSnapshot[], asOfDate: string | null): ShortAnswer | null {
  const usable = majors.filter((major) => Number.isFinite(major.underemploymentRate));
  if (usable.length < 2) return null;
  const sorted = [...usable].sort((a, b) => a.underemploymentRate - b.underemploymentRate);
  const lowest = sorted[0];
  const highest = sorted.at(-1)!;
  return {
    text: `It varies widely. Among the ${usable.length} majors tracked, recent graduates in ${lowest.name} are the least likely to be underemployed (${percent(lowest.underemploymentRate)}) and those in ${highest.name} the most likely (${percent(highest.underemploymentRate)}).`,
    asOf: asOfDate
  };
}

export function answerDegreePayoff(majors: MajorSnapshot[], asOfDate: string | null): ShortAnswer | null {
  const usable = majors.filter((major) => Number.isFinite(major.wagePremium));
  if (usable.length === 0) return null;
  const positive = usable.filter((major) => major.wagePremium > 0).length;
  const premiums = usable.map((major) => major.wagePremium);
  const min = Math.min(...premiums);
  const max = Math.max(...premiums);
  const share = positive === usable.length ? `In all ${usable.length} majors tracked` : `In ${positive} of ${usable.length} majors tracked`;
  const range = min > 0 ? ` The gap in median annual pay ranges from ${dollars(min)} to ${dollars(max)}.` : "";
  return {
    text: `${share}, graduates working in college-level jobs earn more than graduates of the same major in jobs that do not need a degree.${range}`,
    asOf: asOfDate
  };
}
