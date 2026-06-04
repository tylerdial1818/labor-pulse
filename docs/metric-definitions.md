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
| Sparkline history | Most recent 10 years of observations for the indicator, preserving nulls as gaps | Database observations | Sparkline is directional context, not a forecast |
| Proxy indicator flag | `series.isProxy` and associated methodology note | Indicator catalog/database | Proxy status must be visible for Tech & AI impact indicators |
| 10-year composite history | Trailing derived composite observations from the latest composite observation back 10 calendar years | Labor Pulse composite calculations over stored observations | Composite availability depends on all required input series having enough stored history |
| Breakdown current value | Latest non-null observation for the supported segment series | Existing Labor Pulse observations and FRED-compatible metadata | Metadata-only segments remain unavailable until observations are ingested |
| Report history | 10-year indicator, composite, and selected breakdown observations | Database observations plus explicit segment availability metadata | Report rows must include source, URL, units, geography, date, availability, and caveat where applicable |
| Recent graduate underemployment rate | Share of employed recent college graduates working in occupations classified as non-college jobs | NY Fed Labor Market for Recent College Graduates | Recent graduates are ages 22 to 27 with a bachelor's degree or higher |
| All graduate underemployment rate | Share of employed college graduates working in occupations classified as non-college jobs | NY Fed Labor Market for Recent College Graduates | Includes college graduates outside the recent graduate age band |
| Major wage premium | Median wage in college-level jobs minus median wage in non-college jobs for a major | NY Fed outcomes by major | Wage premium is not a causal return to the major |
| Common online major flag | Major appears in the curated common online and competency-based program list | Labor Pulse curation from public program catalogs | Program category flag does not name or evaluate specific universities |

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

## v1.6 Segment Model

| Dimension | Supported metrics | Series metadata | Availability rule | Caveat |
| --- | --- | --- | --- | --- |
| Industry | `PAYEMS`, `CES0500000003`, `JTSJOL`, `JTSQUR`, `JTSLDR`, `AWHAETP` where FRED exposes matching sector series | Examples: `USGOOD`, `CES6000000003`, `JTS2300JOL`, `JTS2300QUR`, `JTU2300LDR`, `AWHAEMAN` | Detail page fetches mapped FRED series server-side | Sector series are comparisons, not always a decomposition of the headline metric. Some layoffs sector series are not seasonally adjusted |
| Gender | `UNRATE`, `CIVPART`, `EMRATIO` | `LNS14000001`, `LNS14000002`, `LNS11300001`, `LNS11300002`, `LNS12300001`, `LNS12300002` | Detail page fetches mapped FRED series server-side | Uses BLS/FRED published categories and does not cover every indicator |
| State | `UNRATE`, `PAYEMS`, `CIVPART`, `ICSA` | Examples: `CAUR`, `CANA`, `LBSSA06`, `CAICLAIMS` | Detail page fetches mapped FRED series server-side | State initial claims are not seasonally adjusted. Unsupported state cuts are omitted |
| Age | `UNRATE`, `CIVPART`, partial `EMRATIO` | Examples: `LNS14000012`, `LNS14000036`, `LNS11300060`, `LNS12300060` | Detail page fetches mapped FRED series server-side | Employment-population age coverage is partial in FRED, so only verified bands are shown |

## Review Checklist

- [ ] Metric formula confirmed with stakeholder.
- [ ] Source and refresh cadence documented.
- [ ] Tests cover edge cases such as zero denominators.
- [ ] UI label matches the definition.
