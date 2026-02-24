import { beforeEach, describe, expect, it, vi } from "vitest";

const upsertMock = vi.fn();
const findFirstMock = vi.fn();

vi.mock("../../lib/db/index", () => ({
  db: {
    recoveryScore: {
      upsert: upsertMock,
      findFirst: findFirstMock
    }
  }
}));

const samplePayload = {
  recovery_score: 72,
  pillars: {
    sleep_integrity: 70,
    hormonal_stability: 68,
    load_management: 74,
    inflammation_control: 71,
    cognitive_bandwidth: 77
  },
  explanation: "Solid day.",
  model_version: "v1"
};

describe("recovery scores db", () => {
  beforeEach(() => {
    upsertMock.mockReset();
    findFirstMock.mockReset();
  });

  it("upserts with normalized date and payload mapping", async () => {
    const { upsertRecoveryScore } = await import("../../lib/db/scores");

    await upsertRecoveryScore("user-1", "2026-02-24", samplePayload);

    expect(upsertMock).toHaveBeenCalledTimes(1);
    const args = upsertMock.mock.calls[0][0];

    expect(args.where.userId_date.userId).toBe("user-1");
    expect(args.where.userId_date.date).toBeInstanceOf(Date);
    expect(args.create.recoveryScore).toBe(samplePayload.recovery_score);
    expect(args.create.pillars).toEqual(samplePayload.pillars);
    expect(args.create.explanation).toBe(samplePayload.explanation);
    expect(args.create.modelVersion).toBe(samplePayload.model_version);
    expect(args.update.recoveryScore).toBe(samplePayload.recovery_score);
    expect(args.update.pillars).toEqual(samplePayload.pillars);
    expect(args.update.explanation).toBe(samplePayload.explanation);
    expect(args.update.modelVersion).toBe(samplePayload.model_version);

    const createdDate = args.create.date as Date;
    expect(createdDate.toISOString().startsWith("2026-02-24")).toBe(true);
  });

  it("fetches the latest recovery score by date desc", async () => {
    const { getLatestRecoveryScore } = await import("../../lib/db/scores");

    await getLatestRecoveryScore("user-2");

    expect(findFirstMock).toHaveBeenCalledWith({
      where: { userId: "user-2" },
      orderBy: { date: "desc" }
    });
  });
});
