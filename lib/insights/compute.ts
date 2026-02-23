export type InsightCard = {
  id: string;
  title: string;
  description: string;
  metric: string;
};

export type TrendEntry = {
  date: string;
  recovery_score: number | null;
  sleep_hours: number | null;
  stress: number | null;
  training_load: number | null;
  alcohol: number | null;
  energy: number | null;
};

const correlation = (pairs: Array<[number, number]>) => {
  if (pairs.length < 2) return null;
  const xs = pairs.map(([x]) => x);
  const ys = pairs.map(([, y]) => y);
  const meanX = xs.reduce((sum, value) => sum + value, 0) / xs.length;
  const meanY = ys.reduce((sum, value) => sum + value, 0) / ys.length;
  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  for (let i = 0; i < pairs.length; i += 1) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return null;
  return numerator / denominator;
};

const buildCorrelationCard = (
  label: string,
  value: number | null,
  direction: "positive" | "negative"
) => {
  if (value === null) return null;

  const strength = Math.abs(value);
  if (strength < 0.25) return null;

  const descriptor =
    direction === "positive"
      ? "tends to align with higher recovery."
      : "tends to align with lower recovery.";

  return {
    id: `${label.toLowerCase()}-trend`,
    title: `${label} impact`,
    description: `${label} ${descriptor}`,
    metric: strength >= 0.55 ? "Strong" : "Moderate"
  } satisfies InsightCard;
};

export function computeInsightCards(trends: TrendEntry[]): InsightCard[] {
  const scored = trends.filter((entry) => entry.recovery_score !== null);
  if (scored.length === 0) {
    return [];
  }

  const average =
    scored.reduce((sum, entry) => sum + (entry.recovery_score ?? 0), 0) /
    scored.length;
  const bestDay = scored.reduce((best, entry) =>
    (entry.recovery_score ?? 0) > (best.recovery_score ?? 0) ? entry : best
  );

  const cards: InsightCard[] = [
    {
      id: "avg-score",
      title: "Average recovery",
      description: "Your average score across the selected range.",
      metric: `${Math.round(average)}`
    },
    {
      id: "best-day",
      title: "Top day",
      description: `Highest recovery score on ${bestDay.date}.`,
      metric: `${bestDay.recovery_score ?? 0}`
    }
  ];

  if (scored.length >= 7) {
    const sleepPairs: Array<[number, number]> = [];
    const stressPairs: Array<[number, number]> = [];

    for (const entry of scored) {
      if (entry.sleep_hours !== null && entry.recovery_score !== null) {
        sleepPairs.push([entry.sleep_hours, entry.recovery_score]);
      }
      if (entry.stress !== null && entry.recovery_score !== null) {
        stressPairs.push([entry.stress, entry.recovery_score]);
      }
    }

    const sleepCorr = correlation(sleepPairs);
    const stressCorr = correlation(stressPairs);

    const sleepCard = buildCorrelationCard(
      "Sleep",
      sleepCorr,
      sleepCorr !== null && sleepCorr >= 0 ? "positive" : "negative"
    );
    const stressCard = buildCorrelationCard(
      "Stress",
      stressCorr,
      stressCorr !== null && stressCorr >= 0 ? "positive" : "negative"
    );

    if (sleepCard) cards.push(sleepCard);
    if (stressCard) cards.push(stressCard);

    if (!sleepCard && !stressCard) {
      cards.push({
        id: "steady-trend",
        title: "Steady signals",
        description: "No strong relationship detected yet in this range.",
        metric: "Neutral"
      });
    }
  }

  return cards;
}
