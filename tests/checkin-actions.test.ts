import { beforeEach, describe, expect, it, vi } from "vitest";

const requireUserIdMock = vi.fn(async () => "user-1");
const upsertDailyCheckinMock = vi.fn(async () => ({ id: "checkin-1" }));
const upsertRecoveryScoreMock = vi.fn(async () => ({ id: "score-1" }));
const revalidatePathMock = vi.fn();
const computeRecoveryScoreMock = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock
}));

vi.mock("../lib/auth/session", () => ({
  requireUserId: requireUserIdMock
}));

vi.mock("../lib/db/checkins", () => ({
  upsertDailyCheckin: upsertDailyCheckinMock
}));

vi.mock("../lib/db/scores", () => ({
  upsertRecoveryScore: upsertRecoveryScoreMock
}));

vi.mock("../lib/scoring/v1", () => ({
  computeRecoveryScore: computeRecoveryScoreMock
}));

async function importAction() {
  const mod = await import("../app/checkin/actions");
  return mod.createOrUpdateCheckin;
}

function makeScore(tag: string) {
  return {
    recovery_score: tag === "high" ? 84 : 52,
    pillars: {
      sleep_integrity: tag === "high" ? 86 : 55,
      hormonal_stability: tag === "high" ? 82 : 50,
      load_management: tag === "high" ? 84 : 54,
      inflammation_control: tag === "high" ? 83 : 49,
      cognitive_bandwidth: tag === "high" ? 85 : 53
    },
    explanation: tag === "high" ? "Updated score" : "Initial score",
    model_version: tag === "high" ? "v1.1" : "v1"
  };
}

describe("createOrUpdateCheckin", () => {
  beforeEach(() => {
    requireUserIdMock.mockClear();
    upsertDailyCheckinMock.mockClear();
    upsertRecoveryScoreMock.mockClear();
    revalidatePathMock.mockClear();
    computeRecoveryScoreMock.mockReset();
  });

  it("coerces form values and applies defaults before persisting", async () => {
    const createOrUpdateCheckin = await importAction();
    computeRecoveryScoreMock.mockReturnValue(makeScore("low"));

    const formData = new FormData();
    formData.set("date", "2026-02-24");
    formData.set("sleep_hours", "7.5");
    formData.set("stress", "bad-input");
    formData.set("soreness", "");
    formData.set("training_load", "hard");
    formData.set("alcohol", "1-2");
    formData.set("energy", "4");
    formData.set("resting_hr", "not-a-number");
    formData.set("hrv", "64");
    formData.set("notes", "");

    await createOrUpdateCheckin(formData);

    expect(requireUserIdMock).toHaveBeenCalledTimes(1);
    expect(upsertDailyCheckinMock).toHaveBeenCalledTimes(1);
    expect(computeRecoveryScoreMock).toHaveBeenCalledTimes(1);
    expect(upsertRecoveryScoreMock).toHaveBeenCalledTimes(1);
    expect(revalidatePathMock).toHaveBeenCalledWith("/today");

    const payload = upsertDailyCheckinMock.mock.calls[0][1];
    expect(payload).toEqual({
      date: "2026-02-24",
      sleep_hours: 7.5,
      stress: 1,
      soreness: 0,
      training_load: "hard",
      alcohol: "1-2",
      energy: 4,
      resting_hr: null,
      hrv: 64,
      notes: null
    });

    expect(computeRecoveryScoreMock).toHaveBeenCalledWith(payload);
    expect(upsertRecoveryScoreMock).toHaveBeenCalledWith(
      "user-1",
      "2026-02-24",
      makeScore("low")
    );
  });

  it("recomputes score on edits and persists the updated score payload", async () => {
    const createOrUpdateCheckin = await importAction();

    computeRecoveryScoreMock.mockImplementation((payload: { energy: number }) =>
      payload.energy >= 4 ? makeScore("high") : makeScore("low")
    );

    const first = new FormData();
    first.set("date", "2026-02-24");
    first.set("sleep_hours", "6");
    first.set("stress", "3");
    first.set("soreness", "3");
    first.set("training_load", "medium");
    first.set("alcohol", "none");
    first.set("energy", "2");

    const second = new FormData();
    second.set("date", "2026-02-24");
    second.set("sleep_hours", "8");
    second.set("stress", "2");
    second.set("soreness", "2");
    second.set("training_load", "light");
    second.set("alcohol", "none");
    second.set("energy", "5");
    second.set("notes", "Feeling better");

    await createOrUpdateCheckin(first);
    await createOrUpdateCheckin(second);

    expect(computeRecoveryScoreMock).toHaveBeenCalledTimes(2);
    expect(upsertDailyCheckinMock).toHaveBeenCalledTimes(2);
    expect(upsertRecoveryScoreMock).toHaveBeenCalledTimes(2);

    const firstPayload = upsertDailyCheckinMock.mock.calls[0][1];
    const secondPayload = upsertDailyCheckinMock.mock.calls[1][1];
    expect(firstPayload.energy).toBe(2);
    expect(secondPayload.energy).toBe(5);
    expect(secondPayload.notes).toBe("Feeling better");

    expect(upsertRecoveryScoreMock.mock.calls[0]).toEqual([
      "user-1",
      "2026-02-24",
      makeScore("low")
    ]);
    expect(upsertRecoveryScoreMock.mock.calls[1]).toEqual([
      "user-1",
      "2026-02-24",
      makeScore("high")
    ]);

    const latestPersistedScore = upsertRecoveryScoreMock.mock.calls[1][2];
    expect(latestPersistedScore).toMatchObject({
      pillars: expect.any(Object),
      explanation: "Updated score",
      model_version: "v1.1"
    });
    expect(revalidatePathMock).toHaveBeenCalledTimes(2);
  });
});
