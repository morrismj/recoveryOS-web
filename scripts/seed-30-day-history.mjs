import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const DAYS = 30;
const shouldPush = process.argv.includes("--push");

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeFivePoint(value) {
  return clamp((value - 1) * 25, 0, 100);
}

const trainingLoadPenalty = {
  none: 0,
  light: 5,
  medium: 12,
  hard: 20
};

const alcoholPenalty = {
  none: 0,
  "1-2": 6,
  "3+": 15
};

function computeRecoveryScore(input) {
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

  return {
    recovery_score: recoveryScore,
    pillars,
    explanation: `Sleep ${Math.round(input.sleep_hours * 10) / 10}h, stress ${
      input.stress
    }/5, soreness ${input.soreness}/5, load ${input.training_load}, alcohol ${
      input.alcohol
    }.`,
    model_version: "v1"
  };
}

function generateRows() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = [];
  for (let offset = DAYS - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);

    const day = date.getDay(); // 0=Sun
    const idx = DAYS - 1 - offset;
    const weekend = day === 0 || day === 6;
    const heavyDay = [1, 3, 5].includes(day);
    const mediumDay = [2, 4].includes(day);

    const sleepBase = weekend ? 8.0 : 7.1;
    const sleepDrift = ((idx % 5) - 2) * 0.2;
    const sleepHours = clamp(Number((sleepBase + sleepDrift).toFixed(1)), 5.8, 9.2);

    const training_load = heavyDay ? "hard" : mediumDay ? "medium" : weekend ? "light" : "none";
    const soreness = clamp(
      training_load === "hard" ? 3 + (idx % 3 === 0 ? 1 : 0) : training_load === "medium" ? 2 + (idx % 4 === 0 ? 1 : 0) : 2,
      1,
      5
    );
    const stress = clamp((weekend ? 2 : 3) + (idx % 7 === 1 ? 1 : 0), 1, 5);
    const alcohol = weekend ? (day === 6 && idx % 2 === 0 ? "1-2" : "none") : idx % 13 === 0 ? "1-2" : "none";
    const energy = clamp(
      Math.round((sleepHours - 6.5) + (weekend ? 2 : 1) - (stress - 2) - (soreness - 2)),
      1,
      5
    );
    const resting_hr = clamp(
      Math.round(52 + soreness * 2 + stress + (training_load === "hard" ? 3 : training_load === "medium" ? 1 : 0) - (sleepHours >= 8 ? 2 : 0)),
      46,
      66
    );
    const hrv = clamp(
      Number((62 - stress * 4 - soreness * 2 - (training_load === "hard" ? 4 : 0) + (sleepHours >= 8 ? 5 : 0) - (alcohol === "1-2" ? 3 : 0)).toFixed(1)),
      28,
      82
    );

    let notes = "";
    if (training_load === "hard") notes = "Intensity day";
    else if (alcohol !== "none") notes = "Social evening";
    else if (weekend) notes = "Active recovery";
    else if (idx % 9 === 0) notes = "Work travel";

    rows.push({
      date: isoDate(date),
      sleep_hours: sleepHours,
      stress,
      soreness,
      training_load,
      alcohol,
      energy,
      resting_hr,
      hrv,
      notes
    });
  }
  return rows;
}

function toCsv(rows) {
  const header = [
    "date",
    "sleep_hours",
    "stress",
    "soreness",
    "training_load",
    "alcohol",
    "energy",
    "resting_hr",
    "hrv",
    "notes"
  ];

  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.date,
        row.sleep_hours,
        row.stress,
        row.soreness,
        row.training_load,
        row.alcohol,
        row.energy,
        row.resting_hr,
        row.hrv,
        row.notes || ""
      ].join(",")
    );
  }
  return lines.join("\n") + "\n";
}

async function writeCsv(rows) {
  const outDir = path.join(process.cwd(), "data", "imports");
  await fs.mkdir(outDir, { recursive: true });
  const filename = `daily-checkins-${rows[0].date}_to_${rows[rows.length - 1].date}.csv`;
  const filePath = path.join(outDir, filename);
  await fs.writeFile(filePath, toCsv(rows), "utf8");
  return filePath;
}

function mapAlcohol(alcohol) {
  if (alcohol === "1-2") return "one_two";
  if (alcohol === "3+") return "three_plus";
  return "none";
}

async function pushToDatabase(rows) {
  const userId = process.env.RECOVERYOS_USER_ID;
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }
  if (!userId) {
    throw new Error("RECOVERYOS_USER_ID is not set.");
  }

  const prisma = new PrismaClient({ log: ["error"] });
  try {
    const user = await prisma.userProfile.findUnique({
      where: { id: userId },
      select: { id: true, email: true, timezone: true }
    });

    if (!user) {
      throw new Error(`UserProfile not found for RECOVERYOS_USER_ID=${userId}`);
    }

    for (const row of rows) {
      await prisma.dailyCheckin.upsert({
        where: {
          userId_date: {
            userId,
            date: new Date(row.date)
          }
        },
        create: {
          userId,
          date: new Date(row.date),
          sleepHours: row.sleep_hours,
          stress: row.stress,
          soreness: row.soreness,
          trainingLoad: row.training_load,
          alcohol: mapAlcohol(row.alcohol),
          energy: row.energy,
          restingHr: row.resting_hr,
          hrv: row.hrv,
          notes: row.notes || null
        },
        update: {
          sleepHours: row.sleep_hours,
          stress: row.stress,
          soreness: row.soreness,
          trainingLoad: row.training_load,
          alcohol: mapAlcohol(row.alcohol),
          energy: row.energy,
          restingHr: row.resting_hr,
          hrv: row.hrv,
          notes: row.notes || null,
          updatedAt: new Date()
        }
      });

      const score = computeRecoveryScore(row);
      await prisma.recoveryScore.upsert({
        where: {
          userId_date: {
            userId,
            date: new Date(row.date)
          }
        },
        create: {
          userId,
          date: new Date(row.date),
          recoveryScore: score.recovery_score,
          pillars: score.pillars,
          explanation: score.explanation,
          modelVersion: score.model_version
        },
        update: {
          recoveryScore: score.recovery_score,
          pillars: score.pillars,
          explanation: score.explanation,
          modelVersion: score.model_version
        }
      });
    }

    const count = await prisma.dailyCheckin.count({
      where: {
        userId,
        date: {
          gte: new Date(rows[0].date),
          lte: new Date(rows[rows.length - 1].date)
        }
      }
    });

    return {
      userEmail: user.email,
      timezone: user.timezone,
      count
    };
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const rows = generateRows();
  const csvPath = await writeCsv(rows);

  console.log(`Generated CSV: ${csvPath}`);
  console.log(`Date range: ${rows[0].date} to ${rows[rows.length - 1].date}`);
  console.log(`Rows: ${rows.length}`);

  if (!shouldPush) {
    console.log("Skipping database push (run with --push to upsert into Neon).");
    return;
  }

  const result = await pushToDatabase(rows);
  console.log(
    `Upserted ${rows.length} daily_checkins and ${rows.length} recovery_scores for ${result.userEmail} (${result.timezone}).`
  );
  console.log(`Verified daily_checkins in range: ${result.count}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
