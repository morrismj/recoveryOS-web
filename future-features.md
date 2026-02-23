# Future Features

## Differentiation Roadmap

- Personalized baselines (14–30 day) and deviation scoring for sleep, stress, soreness, energy.
- Trend-aware scoring that penalizes consecutive high-load + low-sleep sequences.
- Daily protocol rules that translate inputs into 2–3 actionable recommendations.
- Meal tag correlations with next-day recovery/energy (minimum event threshold).
- Import-first insights: auto-generated “first week summary” after CSV import.
- Explainability: show top drivers of today’s score (positive/negative deltas).
- Anomaly detection for outlier days versus personal baseline.
- Offline read for last 7 days and quick check-in edit from Today.
- Cohort-tuned weighting (men 40–55) without medical framing.
- Tests: unit coverage for scoring and insight logic with deterministic fixtures.

## Insight Modeling Options

- Replace Pearson with Spearman rank correlation for more robust monotonic signals.
- Use rolling day-over-day deltas to reduce baseline bias.
- Compute z-score deviations vs personal baselines to detect meaningful shifts.
- Add simple linear regression with shrinkage for stability and directionality.
- Prefer rule-based insights when data is sparse (clear, explainable triggers).
