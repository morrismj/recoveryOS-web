import { NextResponse } from "next/server";
import { requireUserId } from "../../../../lib/auth/session";
import { db } from "../../../../lib/db";

export async function POST() {
  const userId = await requireUserId();

  await db.$transaction([
    db.dailyCheckin.deleteMany({ where: { userId } }),
    db.recoveryScore.deleteMany({ where: { userId } }),
    db.meal.deleteMany({ where: { userId } }),
    db.importJob.deleteMany({ where: { userId } }),
    db.userProfile.deleteMany({ where: { id: userId } })
  ]);

  return new NextResponse(null, { status: 204 });
}
