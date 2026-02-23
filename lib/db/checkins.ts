import { db } from "./index";
import type { DailyCheckinInput } from "../scoring/v1";

export async function upsertDailyCheckin(
  userId: string,
  payload: DailyCheckinInput
) {
  return db.dailyCheckin.upsert({
    where: {
      userId_date: {
        userId,
        date: new Date(payload.date)
      }
    },
    create: {
      userId,
      date: new Date(payload.date),
      sleepHours: payload.sleep_hours,
      stress: payload.stress,
      soreness: payload.soreness,
      trainingLoad: payload.training_load,
      alcohol:
        payload.alcohol === "1-2"
          ? "one_two"
          : payload.alcohol === "3+"
            ? "three_plus"
            : "none",
      energy: payload.energy,
      restingHr: payload.resting_hr ?? null,
      hrv: payload.hrv ?? null,
      notes: payload.notes ?? null
    },
    update: {
      sleepHours: payload.sleep_hours,
      stress: payload.stress,
      soreness: payload.soreness,
      trainingLoad: payload.training_load,
      alcohol:
        payload.alcohol === "1-2"
          ? "one_two"
          : payload.alcohol === "3+"
            ? "three_plus"
            : "none",
      energy: payload.energy,
      restingHr: payload.resting_hr ?? null,
      hrv: payload.hrv ?? null,
      notes: payload.notes ?? null,
      updatedAt: new Date()
    }
  });
}
