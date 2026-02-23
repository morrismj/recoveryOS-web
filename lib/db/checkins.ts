import { db } from "./index";
import type { DailyCheckinInput } from "../scoring/v1";

export type DailyCheckinRecord = DailyCheckinInput & {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export async function upsertDailyCheckin(
  userId: string,
  payload: DailyCheckinInput
): Promise<DailyCheckinRecord> {
  const { data, error } = await db
    .from("daily_checkins")
    .upsert({ ...payload, user_id: userId }, { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as DailyCheckinRecord;
}
