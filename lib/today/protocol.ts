const pillarLabels: Record<string, string> = {
  sleep_integrity: "Sleep integrity",
  hormonal_stability: "Hormonal stability",
  load_management: "Load management",
  inflammation_control: "Inflammation control",
  cognitive_bandwidth: "Cognitive bandwidth"
};

export const toPillarsArray = (pillars: Record<string, number>) =>
  Object.entries(pillars).map(([key, value]) => ({
    label: pillarLabels[key] ?? key,
    value
  }));

export const buildProtocol = (score: number, pillars: Record<string, number>) => {
  const sorted = Object.entries(pillars).sort((a, b) => a[1] - b[1]);
  const lowest = sorted[0]?.[0] ?? "sleep_integrity";

  if (score >= 80) {
    return [
      "Keep training light and technique-focused.",
      "Hydrate early and prioritize whole foods.",
      "Take a 20-minute walk to stay loose."
    ];
  }

  if (score >= 60) {
    return [
      "Keep intensity moderate and avoid late workouts.",
      "Prioritize a consistent sleep window.",
      "Balance stress with a short recovery block."
    ];
  }

  const focus =
    lowest === "sleep_integrity"
      ? "Protect sleep with a consistent wind-down."
      : lowest === "hormonal_stability"
        ? "Keep nutrition steady and avoid alcohol tonight."
        : lowest === "load_management"
          ? "Reduce training load and add recovery time."
          : lowest === "inflammation_control"
            ? "Add mobility work and lower strain today."
            : "Reduce cognitive load with shorter focus blocks.";

  return [
    focus,
    "Keep training light and focus on mobility.",
    "Aim for an early bedtime and hydration."
  ];
};
