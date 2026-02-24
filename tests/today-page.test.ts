import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state: {
  userId: string | null;
  latestScore: null | {
    recoveryScore: number;
    explanation: string;
    pillars: Record<string, number>;
  };
} = {
  userId: null,
  latestScore: null
};

const getCurrentUserIdMock = vi.fn(async () => state.userId);
const getLatestRecoveryScoreMock = vi.fn(async () => state.latestScore);

const scoreCardSpy = vi.fn((props: unknown) =>
  React.createElement("div", { "data-testid": "score-card" }, JSON.stringify(props))
);
const emptyStateSpy = vi.fn((props: unknown) =>
  React.createElement("div", { "data-testid": "empty-state" }, JSON.stringify(props))
);
const disclaimerSpy = vi.fn(() =>
  React.createElement("div", { "data-testid": "disclaimer" }, "Disclaimer")
);

vi.mock("next/link", () => ({
  default: (props: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href: props.href }, props.children)
}));

vi.mock("../lib/auth/session", () => ({
  getCurrentUserId: getCurrentUserIdMock
}));

vi.mock("../lib/db/scores", () => ({
  getLatestRecoveryScore: getLatestRecoveryScoreMock
}));

vi.mock("../components/score/ScoreCard", () => ({
  default: scoreCardSpy
}));

vi.mock("../components/ui/EmptyState", () => ({
  default: emptyStateSpy
}));

vi.mock("../components/legal/Disclaimer", () => ({
  default: disclaimerSpy
}));

async function renderTodayPage() {
  const { default: TodayPage } = await import("../app/today/page");
  const element = await TodayPage();
  return renderToStaticMarkup(element);
}

describe("Today page rendering", () => {
  beforeEach(() => {
    state.userId = null;
    state.latestScore = null;

    getCurrentUserIdMock.mockClear();
    getLatestRecoveryScoreMock.mockClear();
    scoreCardSpy.mockClear();
    emptyStateSpy.mockClear();
    disclaimerSpy.mockClear();
  });

  it("shows auth CTA when there is no session", async () => {
    const html = await renderTodayPage();

    expect(html).toContain("Sign in to continue");
    expect(html).toContain("href=\"/auth/signin\"");
    expect(html).toContain("href=\"/auth/signup\"");
    expect(getLatestRecoveryScoreMock).not.toHaveBeenCalled();
    expect(scoreCardSpy).not.toHaveBeenCalled();
    expect(emptyStateSpy).not.toHaveBeenCalled();
    expect(disclaimerSpy).toHaveBeenCalledTimes(1);
  });

  it("shows empty state when user has no score", async () => {
    state.userId = "user-1";
    state.latestScore = null;

    const html = await renderTodayPage();

    expect(html).toContain("Your recovery snapshot");
    expect(getLatestRecoveryScoreMock).toHaveBeenCalledWith("user-1");
    expect(emptyStateSpy).toHaveBeenCalledTimes(1);
    expect(scoreCardSpy).not.toHaveBeenCalled();
    expect(disclaimerSpy).toHaveBeenCalledTimes(1);

    expect(emptyStateSpy.mock.calls[0][0]).toMatchObject({
      title: "No check-in yet",
      actionLabel: "Start check-in",
      actionHref: "/checkin"
    });
  });

  it("renders ScoreCard with mapped pillars and protocol when score exists", async () => {
    state.userId = "user-2";
    state.latestScore = {
      recoveryScore: 55,
      explanation: "Recovery is limited by hormonal stability today.",
      pillars: {
        sleep_integrity: 70,
        hormonal_stability: 42,
        load_management: 65,
        inflammation_control: 60,
        cognitive_bandwidth: 68
      }
    };

    const html = await renderTodayPage();

    expect(html).toContain("Your recovery snapshot");
    expect(getLatestRecoveryScoreMock).toHaveBeenCalledWith("user-2");
    expect(scoreCardSpy).toHaveBeenCalledTimes(1);
    expect(emptyStateSpy).not.toHaveBeenCalled();

    expect(scoreCardSpy.mock.calls[0][0]).toMatchObject({
      score: 55,
      explanation: "Recovery is limited by hormonal stability today."
    });
    expect(scoreCardSpy.mock.calls[0][0]).toMatchObject({
      pillars: [
        { label: "Sleep integrity", value: 70 },
        { label: "Hormonal stability", value: 42 },
        { label: "Load management", value: 65 },
        { label: "Inflammation control", value: 60 },
        { label: "Cognitive bandwidth", value: 68 }
      ],
      protocol: expect.arrayContaining([
        "Keep nutrition steady and avoid alcohol tonight."
      ])
    });
  });
});
