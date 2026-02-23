"use server";

import { revalidatePath } from "next/cache";
import { computeRecoveryScore } from "../../lib/scoring/v1";
import { upsertDailyCheckin } from "../../lib/db/checkins";
import { upsertRecoveryScore } from "../../lib/db/scores";
import { requireUserId } from "../../lib/auth/session";

const parseNumber = (value: FormDataEntryValue | null) => {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export async function createOrUpdateCheckin(formData: FormData) {
  const userId = await requireUserId();

  const payload = {
    date: String(formData.get("date") ?? ""),
    sleep_hours: parseNumber(formData.get("sleep_hours")) ?? 0,
    stress: parseNumber(formData.get("stress")) ?? 1,
    soreness: parseNumber(formData.get("soreness")) ?? 1,
    training_load: String(formData.get("training_load") ?? "none") as
      | "none"
      | "light"
      | "medium"
      | "hard",
    alcohol: String(formData.get("alcohol") ?? "none") as "none" | "1-2" | "3+",
    energy: parseNumber(formData.get("energy")) ?? 1,
    resting_hr: parseNumber(formData.get("resting_hr")),
    hrv: parseNumber(formData.get("hrv")),
    notes: String(formData.get("notes") ?? "") || null
  };

  const checkin = await upsertDailyCheckin(userId, payload);
  const score = computeRecoveryScore(payload);
  await upsertRecoveryScore(userId, payload.date, score);

  revalidatePath("/today");
  void checkin;
}
