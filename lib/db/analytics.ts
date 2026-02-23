import { db } from "./index";

export type TrendEntry = {
  date: string;
  recovery_score: number | null;
  energy: number | null;
  sleep_hours: number | null;
  stress: number | null;
  training_load: number | null;
  alcohol: number | null;
};

const trainingLoadScale: Record<string, number> = {
  none: 0,
  light: 1,
  medium: 2,
  hard: 3
};

const alcoholScale: Record<string, number> = {
  none: 0,
  one_two: 1,
  three_plus: 2
};

const toDateKey = (value: Date) => value.toISOString().slice(0, 10);

export async function getTrendData(userId: string, rangeDays: number) {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (rangeDays - 1));
  startDate.setHours(0, 0, 0, 0);

  const [checkins, scores] = await Promise.all([
    db.dailyCheckin.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        date: true,
        sleepHours: true,
        stress: true,
        trainingLoad: true,
        alcohol: true,
        energy: true
      },
      orderBy: {
        date: "asc"
      }
    }),
    db.recoveryScore.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        date: true,
        recoveryScore: true
      },
      orderBy: {
        date: "asc"
      }
    })
  ]);

  const entries = new Map<string, TrendEntry>();

  for (const checkin of checkins) {
    const key = toDateKey(checkin.date);
    entries.set(key, {
      date: key,
      recovery_score: null,
      sleep_hours: Number(checkin.sleepHours),
      stress: checkin.stress,
      training_load: trainingLoadScale[checkin.trainingLoad],
      alcohol: alcoholScale[checkin.alcohol],
      energy: checkin.energy
    });
  }

  for (const score of scores) {
    const key = toDateKey(score.date);
    const entry = entries.get(key);
    if (entry) {
      entry.recovery_score = score.recoveryScore;
    } else {
      entries.set(key, {
        date: key,
        recovery_score: score.recoveryScore,
        sleep_hours: null,
        stress: null,
        training_load: null,
        alcohol: null,
        energy: null
      });
    }
  }

  return Array.from(entries.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}
