# Metric Definitions

Every client-facing metric must have a clear owner, formula, source, grain, and caveat.

## Template

| Field | Definition |
| --- | --- |
| Metric name | TODO |
| Business question | TODO |
| Formula | TODO |
| Source tables/APIs | TODO |
| Grain | account, user, day, month, transaction, etc. |
| Filters applied | TODO |
| Refresh cadence | TODO |
| Owner | TODO |
| Caveats | TODO |

## Labor Pulse Metrics

| Metric | Formula | Source | Caveat |
| --- | --- | --- | --- |
| Current value | Latest non-null observation for an indicator and geography, default `US` | Database observations from FRED or manual import | Values may be revised by source publishers |
| Monthly delta | Current monthly value minus the value 12 months prior | Database observations | Display unavailable if the comparison observation is missing |
| Weekly delta | Current weekly value minus the value 4 weeks prior | Database observations | Display unavailable if the comparison observation is missing |
| Sparkline history | Most recent observations for the indicator, preserving nulls as gaps | Database observations | Sparkline is directional context, not a forecast |
| Proxy indicator flag | `series.isProxy` and associated methodology note | Indicator catalog/database | Proxy status must be visible for Tech & AI impact indicators |

## Indicator Catalog

| Category | Series ID | Label | Frequency | Notes |
| --- | --- | --- | --- | --- |
| Lagging | `UNRATE` | Unemployment Rate | Monthly | FRED |
| Lagging | `PAYEMS` | Nonfarm Payroll Employment | Monthly | FRED |
| Lagging | `CIVPART` | Labor Force Participation Rate | Monthly | FRED |
| Lagging | `CES0500000003` | Average Hourly Earnings, Total Private | Monthly | FRED |
| Lagging | `EMRATIO` | Employment-Population Ratio | Monthly | FRED |
| Lagging | `U6RATE` | U-6 Total Underemployment Rate | Monthly | FRED |
| Leading | `ICSA` | Initial Jobless Claims | Weekly | FRED |
| Leading | `JTSJOL` | Job Openings (JOLTS) | Monthly | FRED |
| Leading | `JTSQUR` | Quits Rate | Monthly | FRED |
| Leading | `JTSLDR` | Layoffs and Discharges Rate | Monthly | FRED |
| Leading | `TEMPHELPS` | Temporary Help Services Employment | Monthly | FRED |
| Leading | `AWHAETP` | Average Weekly Hours, All Employees | Monthly | FRED |
| Tech & AI Impact | `USPBS` | Professional and Business Services Employment | Monthly | Proxy |
| Tech & AI Impact | `USINFO` | Information Sector Employment | Monthly | Proxy |
| Tech & AI Impact | `ANTHROPIC_ECONOMIC_INDEX` | Anthropic Economic Index | Ad hoc | Claude-only direct usage signal |

## Review Checklist

- [ ] Metric formula confirmed with stakeholder.
- [ ] Source and refresh cadence documented.
- [ ] Tests cover edge cases such as zero denominators.
- [ ] UI label matches the definition.
