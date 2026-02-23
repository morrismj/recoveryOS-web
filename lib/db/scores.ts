import { db } from "./index";
import type { RecoveryScoreResult } from "../scoring/v1";

export async function upsertRecoveryScore(
  userId: string,
  date: string,
  payload: RecoveryScoreResult
) {
  return db.recoveryScore.upsert({
    where: {
      userId_date: {
        userId,
        date: new Date(date)
      }
    },
    create: {
      userId,
      date: new Date(date),
      recoveryScore: payload.recovery_score,
      pillars: payload.pillars,
      explanation: payload.explanation,
      modelVersion: payload.model_version
    },
    update: {
      recoveryScore: payload.recovery_score,
      pillars: payload.pillars,
      explanation: payload.explanation,
      modelVersion: payload.model_version
    }
  });
}
