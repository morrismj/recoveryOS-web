export type TrainingLoad = "none" | "light" | "medium" | "hard";
export type AlcoholIntake = "none" | "1-2" | "3+";

export type DailyCheckinInput = {
  date: string;
  sleep_hours: number;
  stress: number;
  soreness: number;
  training_load: TrainingLoad;
  alcohol: AlcoholIntake;
  energy: number;
  resting_hr?: number | null;
  hrv?: number | null;
  notes?: string | null;
};

export type RecoveryScoreResult = {
  recovery_score: number;
  pillars: {
    sleep_integrity: number;
    hormonal_stability: number;
    load_management: number;
    inflammation_control: number;
    cognitive_bandwidth: number;
  };
  explanation: string;
  model_version: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizeFivePoint = (value: number) => clamp((value - 1) * 25, 0, 100);

const trainingLoadPenalty: Record<TrainingLoad, number> = {
  none: 0,
  light: 5,
  medium: 12,
  hard: 20
};

const alcoholPenalty: Record<AlcoholIntake, number> = {
  none: 0,
  "1-2": 6,
  "3+": 15
};

export function computeRecoveryScore(input: DailyCheckinInput): RecoveryScoreResult {
  const sleepScore = clamp(input.sleep_hours * 12.5, 0, 100);
  const stressScore = 100 - normalizeFivePoint(input.stress);
  const sorenessScore = 100 - normalizeFivePoint(input.soreness);
  const energyScore = normalizeFivePoint(input.energy);

  const loadScore = clamp(100 - trainingLoadPenalty[input.training_load], 0, 100);
  const alcoholScore = clamp(100 - alcoholPenalty[input.alcohol], 0, 100);

  const pillars = {
    sleep_integrity: clamp((sleepScore + energyScore) / 2, 0, 100),
    hormonal_stability: clamp((sleepScore + alcoholScore) / 2, 0, 100),
    load_management: clamp((loadScore + sorenessScore) / 2, 0, 100),
    inflammation_control: clamp((stressScore + sorenessScore) / 2, 0, 100),
    cognitive_bandwidth: clamp((stressScore + energyScore) / 2, 0, 100)
  };

  const recoveryScore = clamp(
    Math.round(
      (pillars.sleep_integrity +
        pillars.hormonal_stability +
        pillars.load_management +
        pillars.inflammation_control +
        pillars.cognitive_bandwidth) /
        5
    ),
    0,
    100
  );

  const explanation = `Sleep ${Math.round(
    input.sleep_hours * 10
  ) / 10}h, stress ${input.stress}/5, soreness ${input.soreness}/5, load ${
    input.training_load
  }, alcohol ${input.alcohol}.`;

  return {
    recovery_score: recoveryScore,
    pillars,
    explanation,
    model_version: "v1"
  };
}

export function recomputeScoresForImport(inputs: DailyCheckinInput[]) {
  return inputs.map((input) => ({
    date: input.date,
    score: computeRecoveryScore(input)
  }));
}
