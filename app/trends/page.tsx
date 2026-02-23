import Link from "next/link";
import { getCurrentUserId } from "../../lib/auth/session";
import { getTrendData } from "../../lib/db/analytics";
import { computeInsightCards } from "../../lib/insights/compute";
import Charts from "../../components/trends/Charts";
import InsightCards from "../../components/trends/InsightCards";
import Disclaimer from "../../components/legal/Disclaimer";

export const dynamic = "force-dynamic";

const ranges = [7, 30, 90] as const;

const parseRange = (value?: string) => {
  const parsed = Number(value);
  if (parsed === 7 || parsed === 30 || parsed === 90) return parsed;
  return 7;
};

export default async function TrendsPage({
  searchParams
}: {
  searchParams?: { range?: string };
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Trends</p>
          <h1 className="text-3xl font-semibold">Sign in to continue</h1>
          <p className="text-sm text-ink-800">
            Create an account to unlock your recovery trends and insights.
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

  const range = parseRange(searchParams?.range);
  const trendData = await getTrendData(userId, range);
  const insightCards = computeInsightCards(trendData);
  const hasEnoughData = trendData.length >= 7;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Trends</p>
        <h1 className="text-3xl font-semibold">Pattern review</h1>
        <p className="text-sm text-ink-800">
          Compare the last {range} days across recovery, energy, sleep, stress,
          and training load.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {ranges.map((value) => {
          const isActive = value === range;
          return (
            <Link
              key={value}
              href={`/trends?range=${value}`}
              className={`rounded-full px-4 py-2 text-xs transition ${
                isActive
                  ? "bg-ink-950 text-fog-50"
                  : "border border-ink-800/20 text-ink-800"
              }`}
            >
              {value} days
            </Link>
          );
        })}
      </div>

      <Charts data={trendData} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Insight cards</h2>
        <InsightCards cards={insightCards} hasEnoughData={hasEnoughData} />
      </section>

      <Disclaimer />
    </div>
  );
}
