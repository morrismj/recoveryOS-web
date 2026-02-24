import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

type ScoresModule = typeof import("../../lib/db/scores");
type DbModule = typeof import("../../lib/db/index");

const integrationEnabled =
  process.env.RUN_DB_TESTS === "1" && Boolean(process.env.TEST_DATABASE_URL);

const describeIf = integrationEnabled ? describe : describe.skip;

describeIf("recovery scores db integration (Prisma)", () => {
  let db: DbModule["db"];
  let upsertRecoveryScore: ScoresModule["upsertRecoveryScore"];
  let getLatestRecoveryScore: ScoresModule["getLatestRecoveryScore"];
  let originalDatabaseUrl: string | undefined;

  const userId = randomUUID();
  const userEmail = `scores-int-${userId}@example.com`;

  beforeAll(async () => {
    originalDatabaseUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

    vi.resetModules();
    delete (globalThis as { prisma?: unknown }).prisma;

    ({ db } = await import("../../lib/db/index"));
    ({ upsertRecoveryScore, getLatestRecoveryScore } = await import("../../lib/db/scores"));

    await db.userProfile.create({
      data: {
        id: userId,
        email: userEmail,
        passwordHash: "test-hash",
        timezone: "UTC"
      }
    });
  });

  beforeEach(async () => {
    await db.recoveryScore.deleteMany({ where: { userId } });
  });

  afterAll(async () => {
    if (!db) {
      return;
    }

    await db.recoveryScore.deleteMany({ where: { userId } });
    await db.userProfile.deleteMany({ where: { id: userId } });
    await db.$disconnect();

    delete (globalThis as { prisma?: unknown }).prisma;

    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it("upserts a score and updates the same record for the same date", async () => {
    await upsertRecoveryScore(userId, "2026-02-22", {
      recovery_score: 61,
      pillars: {
        sleep_integrity: 60,
        hormonal_stability: 62,
        load_management: 61,
        inflammation_control: 63,
        cognitive_bandwidth: 59
      },
      explanation: "Initial score",
      model_version: "v1"
    });

    await upsertRecoveryScore(userId, "2026-02-22", {
      recovery_score: 75,
      pillars: {
        sleep_integrity: 74,
        hormonal_stability: 76,
        load_management: 77,
        inflammation_control: 73,
        cognitive_bandwidth: 75
      },
      explanation: "Updated score",
      model_version: "v1.1"
    });

    const rows = await db.recoveryScore.findMany({ where: { userId } });
    expect(rows).toHaveLength(1);
    expect(rows[0].recoveryScore).toBe(75);
    expect(rows[0].explanation).toBe("Updated score");
    expect(rows[0].modelVersion).toBe("v1.1");
  });

  it("returns the newest score by date", async () => {
    await upsertRecoveryScore(userId, "2026-02-20", {
      recovery_score: 58,
      pillars: {
        sleep_integrity: 55,
        hormonal_stability: 57,
        load_management: 58,
        inflammation_control: 60,
        cognitive_bandwidth: 59
      },
      explanation: "Older score",
      model_version: "v1"
    });

    await upsertRecoveryScore(userId, "2026-02-24", {
      recovery_score: 82,
      pillars: {
        sleep_integrity: 84,
        hormonal_stability: 81,
        load_management: 83,
        inflammation_control: 80,
        cognitive_bandwidth: 82
      },
      explanation: "Latest score",
      model_version: "v1"
    });

    const latest = await getLatestRecoveryScore(userId);

    expect(latest).not.toBeNull();
    expect(latest?.recoveryScore).toBe(82);
    expect(latest?.explanation).toBe("Latest score");
    expect(latest?.date.toISOString().startsWith("2026-02-24")).toBe(true);
  });
});
