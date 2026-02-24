import Link from "next/link";
import ScoreCard from "../../components/score/ScoreCard";
import Disclaimer from "../../components/legal/Disclaimer";
import EmptyState from "../../components/ui/EmptyState";
import { getCurrentUserId } from "../../lib/auth/session";
import { getLatestRecoveryScore } from "../../lib/db/scores";
import { buildProtocol, toPillarsArray } from "../../lib/today/protocol";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Today</p>
          <h1 className="text-3xl font-semibold">Sign in to continue</h1>
          <p className="text-sm text-ink-800">
            Create an account to see your recovery snapshot.
          </p>
        </header>
        <div className="grid gap-3">
          <Link
            className="rounded-xl bg-ink-950 px-4 py-3 text-sm text-fog-50"
            href="/auth/signin"
          >
            Sign in
          </Link>
          <Link
            className="rounded-xl border border-ink-800 px-4 py-3 text-sm"
            href="/auth/signup"
          >
            Create account
          </Link>
        </div>
        <Disclaimer />
      </div>
    );
  }

  const latestScore = await getLatestRecoveryScore(userId);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Today</p>
        <h1 className="text-3xl font-semibold">Your recovery snapshot</h1>
        <p className="text-sm text-ink-800">
          Scores update as you edit your daily check-in.
        </p>
      </header>

      {latestScore ? (
        <ScoreCard
          score={latestScore.recoveryScore}
          explanation={latestScore.explanation}
          pillars={toPillarsArray(
            latestScore.pillars as Record<string, number>
          )}
          protocol={buildProtocol(
            latestScore.recoveryScore,
            latestScore.pillars as Record<string, number>
          )}
        />
      ) : (
        <EmptyState
          title="No check-in yet"
          description="Complete your first daily check-in to unlock your recovery snapshot."
          actionLabel="Start check-in"
          actionHref="/checkin"
        />
      )}

      <Disclaimer />
    </div>
  );
}
