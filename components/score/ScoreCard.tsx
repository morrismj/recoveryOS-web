type ScoreCardProps = {
  score: number;
  pillars: {
    label: string;
    value: number;
  }[];
  explanation: string;
  protocol: string[];
};

export default function ScoreCard({
  score,
  pillars,
  explanation,
  protocol
}: ScoreCardProps) {
  return (
    <section className="rounded-3xl border border-ink-800/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Recovery</p>
          <h2 className="text-3xl font-semibold">{score}</h2>
        </div>
        <div className="rounded-2xl bg-ink-950 px-4 py-2 text-xs text-fog-50">
          Today&apos;s protocol
        </div>
      </div>

      <p className="mt-3 text-sm text-ink-800">{explanation}</p>

      <div className="mt-4 grid gap-3">
        {pillars.map((pillar) => (
          <div key={pillar.label} className="flex items-center justify-between">
            <span className="text-sm text-ink-800">{pillar.label}</span>
            <span className="text-sm font-semibold">{pillar.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-fog-50 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Protocol</p>
        <ul className="mt-2 space-y-1 text-sm text-ink-800">
          {protocol.map((step) => (
            <li key={step}>• {step}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
