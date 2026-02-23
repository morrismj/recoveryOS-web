import type { InsightCard } from "../../lib/insights/compute";

export default function InsightCards({
  cards,
  hasEnoughData
}: {
  cards: InsightCard[];
  hasEnoughData: boolean;
}) {
  if (!hasEnoughData) {
    return (
      <div className="rounded-2xl border border-ink-800/10 bg-white p-4 text-sm text-ink-800">
        Log at least seven days to unlock insight cards.
      </div>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="rounded-2xl border border-ink-800/10 bg-white p-4"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-ink-800/60">
            {card.metric}
          </div>
          <div className="mt-2 text-lg font-semibold text-ink-950">
            {card.title}
          </div>
          <p className="mt-1 text-sm text-ink-800">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
