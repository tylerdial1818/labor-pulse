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

## Starter Metrics

| Metric | Formula | Source | Caveat |
| --- | --- | --- | --- |
| Revenue | Sum of recognized revenue over selected period | Sample revenue series | Replace with finance-approved source |
| Revenue growth | `(latest period revenue - first period revenue) / first period revenue` | Sample revenue series | Sensitive to selected date window |
| Target attainment | `sum(revenue) / sum(target)` | Sample revenue series | Targets must use same period grain |
| Weighted win rate | `sum(win_rate * pipeline) / sum(pipeline)` | Segment performance | Pipeline weighting can hide small-segment volatility |

## Review Checklist

- [ ] Metric formula confirmed with stakeholder.
- [ ] Source and refresh cadence documented.
- [ ] Tests cover edge cases such as zero denominators.
- [ ] UI label matches the definition.
