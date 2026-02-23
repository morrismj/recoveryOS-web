import { createOrUpdateCheckin } from "./actions";
import Disclaimer from "../../components/legal/Disclaimer";

const today = new Date().toISOString().slice(0, 10);

export default function CheckinPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Daily Check-in</p>
        <h1 className="text-3xl font-semibold">How are you today?</h1>
        <p className="text-sm text-ink-800">
          Keep it quick. Six required signals, two optional, then you&apos;re done.
        </p>
      </header>

      <form action={createOrUpdateCheckin} className="space-y-4">
        <label className="flex flex-col gap-2 text-sm">
          Date
          <input
            className="rounded-xl border border-ink-800/20 px-3 py-2"
            type="date"
            name="date"
            defaultValue={today}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          Sleep hours
          <input
            className="rounded-xl border border-ink-800/20 px-3 py-2"
            type="number"
            name="sleep_hours"
            min="0"
            step="0.25"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            Stress (1-5)
            <input
              className="rounded-xl border border-ink-800/20 px-3 py-2"
              type="number"
              name="stress"
              min="1"
              max="5"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Soreness (1-5)
            <input
              className="rounded-xl border border-ink-800/20 px-3 py-2"
              type="number"
              name="soreness"
              min="1"
              max="5"
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          Training load
          <select
            className="rounded-xl border border-ink-800/20 px-3 py-2"
            name="training_load"
            required
          >
            <option value="none">None</option>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          Alcohol
          <select
            className="rounded-xl border border-ink-800/20 px-3 py-2"
            name="alcohol"
            required
          >
            <option value="none">None</option>
            <option value="1-2">1-2 drinks</option>
            <option value="3+">3+ drinks</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          Energy (1-5)
          <input
            className="rounded-xl border border-ink-800/20 px-3 py-2"
            type="number"
            name="energy"
            min="1"
            max="5"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            Resting HR (optional)
            <input
              className="rounded-xl border border-ink-800/20 px-3 py-2"
              type="number"
              name="resting_hr"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            HRV (optional)
            <input
              className="rounded-xl border border-ink-800/20 px-3 py-2"
              type="number"
              name="hrv"
              step="0.1"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          Notes (optional)
          <textarea
            className="min-h-[96px] rounded-xl border border-ink-800/20 px-3 py-2"
            name="notes"
          />
        </label>

        <button
          className="w-full rounded-xl bg-ink-950 px-4 py-3 text-sm text-fog-50"
          type="submit"
        >
          Save check-in
        </button>
      </form>

      <Disclaimer />
    </div>
  );
}
