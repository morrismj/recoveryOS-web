import { db } from "./index";
import type { RecoveryScoreResult } from "../scoring/v1";

export type RecoveryScoreRecord = RecoveryScoreResult & {
  id: string;
  user_id: string;
  date: string;
  created_at: string;
};

export async function upsertRecoveryScore(
  userId: string,
  date: string,
  payload: RecoveryScoreResult
): Promise<RecoveryScoreRecord> {
  const { data, error } = await db
    .from("recovery_scores")
    .upsert({ ...payload, user_id: userId, date }, { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as RecoveryScoreRecord;
}
