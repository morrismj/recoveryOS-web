import ScoreCard from "../../components/score/ScoreCard";
import Disclaimer from "../../components/legal/Disclaimer";

export default function TodayPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Today</p>
        <h1 className="text-3xl font-semibold">Your recovery snapshot</h1>
        <p className="text-sm text-ink-800">
          Scores update as you edit your daily check-in.
        </p>
      </header>

      <ScoreCard
        score={78}
        explanation="Solid sleep and stable stress, with moderate training load."
        pillars={[
          { label: "Sleep integrity", value: 82 },
          { label: "Hormonal stability", value: 76 },
          { label: "Load management", value: 70 },
          { label: "Inflammation control", value: 74 },
          { label: "Cognitive bandwidth", value: 86 }
        ]}
        protocol={[
          "Keep training light and technique-focused.",
          "Hydrate early and prioritize whole foods.",
          "Take a 20-minute walk to stay loose."
        ]}
      />

      <Disclaimer />
    </div>
  );
}
