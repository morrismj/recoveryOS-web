export type InsightCard = {
  id: string;
  title: string;
  description: string;
  metric: string;
};

export type ScoreEntry = {
  date: string;
  recovery_score: number;
  pillars?: Record<string, number> | null;
};

export function computeInsightCards(scores: ScoreEntry[]): InsightCard[] {
  if (scores.length === 0) {
    return [];
  }

  const average =
    scores.reduce((sum, score) => sum + score.recovery_score, 0) / scores.length;
  const bestDay = scores.reduce((best, entry) =>
    entry.recovery_score > best.recovery_score ? entry : best
  );

  return [
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
      metric: `${bestDay.recovery_score}`
    }
  ];
}
