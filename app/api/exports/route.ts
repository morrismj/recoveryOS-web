import { NextResponse } from "next/server";
import { requireUserId } from "../../../lib/auth/session";
import { db } from "../../../lib/db";

const toCsvValue = (value: unknown) => {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (stringValue.includes("\"") || stringValue.includes(",") || stringValue.includes("\n")) {
    return `"${stringValue.replace(/\"/g, '""')}"`;
  }
  return stringValue;
};

export async function GET() {
  const userId = await requireUserId();

  const [checkins, scores, meals] = await Promise.all([
    db.dailyCheckin.findMany({
      where: { userId },
      orderBy: { date: "asc" }
    }),
    db.recoveryScore.findMany({
      where: { userId },
      orderBy: { date: "asc" }
    }),
    db.meal.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" }
    })
  ]);

  const header = [
    "type",
    "date",
    "sleep_hours",
    "stress",
    "soreness",
    "training_load",
    "alcohol",
    "energy",
    "resting_hr",
    "hrv",
    "notes",
    "recovery_score",
    "pillars",
    "explanation",
    "model_version",
    "meal_timestamp",
    "meal_type",
    "meal_tags",
    "meal_note",
    "meal_photo_url"
  ];

  const rows: string[] = [];

  for (const checkin of checkins) {
    rows.push(
      [
        "checkin",
        checkin.date.toISOString().slice(0, 10),
        Number(checkin.sleepHours),
        checkin.stress,
        checkin.soreness,
        checkin.trainingLoad,
        checkin.alcohol,
        checkin.energy,
        checkin.restingHr ?? "",
        checkin.hrv ?? "",
        checkin.notes ?? "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      ].map(toCsvValue).join(",")
    );
  }

  for (const score of scores) {
    rows.push(
      [
        "score",
        score.date.toISOString().slice(0, 10),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        score.recoveryScore,
        JSON.stringify(score.pillars),
        score.explanation,
        score.modelVersion,
        "",
        "",
        "",
        ""
      ].map(toCsvValue).join(",")
    );
  }

  for (const meal of meals) {
    rows.push(
      [
        "meal",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        meal.timestamp.toISOString(),
        meal.mealType ?? "",
        meal.tags.join("|"),
        meal.note ?? "",
        meal.photoUrl
      ].map(toCsvValue).join(",")
    );
  }

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=recOVERYOS_export.csv"
    }
  });
}
