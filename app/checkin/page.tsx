"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createOrUpdateCheckin } from "./actions";
import Disclaimer from "../../components/legal/Disclaimer";

const today = new Date().toISOString().slice(0, 10);

const ratingOptions = [1, 2, 3, 4, 5];

export default function CheckinPage() {
  const { status } = useSession();
  const router = useRouter();
  const [sleepHours, setSleepHours] = useState(7.5);
  const [stress, setStress] = useState(3);
  const [soreness, setSoreness] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [trainingLoad, setTrainingLoad] = useState("light");
  const [alcohol, setAlcohol] = useState("none");
  const [submissionState, setSubmissionState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionState("saving");
    setSubmissionError(null);

    try {
      const formData = new FormData(event.currentTarget);
      await createOrUpdateCheckin(formData);
      setSubmissionState("saved");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setSubmissionState("error");
      setSubmissionError(message);
    }
  };

  if (status === "loading") {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="h-6 w-24 animate-pulse rounded-full bg-fog-100" />
        <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-fog-100" />
        <div className="h-64 animate-pulse rounded-3xl bg-fog-100" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-800">
            Daily Check-in
          </p>
          <h1 className="text-3xl font-semibold">Sign in to continue</h1>
          <p className="text-sm text-ink-800">
            Create an account to save your check-ins and see your recovery score.
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

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Daily Check-in</p>
        <h1 className="text-3xl font-semibold">How are you today?</h1>
        <p className="text-sm text-ink-800">
          Quick sliders and taps. Six required signals, two optional, then you&apos;re
          done.
        </p>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm">
          Date
          <input
            className="rounded-xl border border-ink-800/20 bg-white px-3 py-2"
            type="date"
            name="date"
            defaultValue={today}
            required
          />
        </label>

        <div className="rounded-2xl border border-ink-800/10 bg-white p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Sleep hours</span>
            <span className="rounded-full bg-fog-100 px-3 py-1 text-xs">
              {sleepHours.toFixed(1)} h
            </span>
          </div>
          <input
            className="mt-3 w-full"
            type="range"
            name="sleep_hours"
            min="4"
            max="10"
            step="0.25"
            value={sleepHours}
            onChange={(event) => setSleepHours(Number(event.target.value))}
            required
          />
          <div className="mt-2 flex justify-between text-[11px] text-ink-800/70">
            <span>4h</span>
            <span>7h</span>
            <span>10h</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <fieldset className="rounded-2xl border border-ink-800/10 bg-white p-4">
            <legend className="text-sm">Stress</legend>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {ratingOptions.map((value) => (
                <label key={`stress-${value}`} className="text-center">
                  <input
                    type="radio"
                    name="stress"
                    value={value}
                    className="peer sr-only"
                    checked={stress === value}
                    onChange={() => setStress(value)}
                    required
                  />
                  <span className="block rounded-xl border border-ink-800/20 py-2 text-sm transition peer-checked:border-ink-950 peer-checked:bg-ink-950 peer-checked:text-fog-50">
                    {value}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-ink-800/10 bg-white p-4">
            <legend className="text-sm">Soreness</legend>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {ratingOptions.map((value) => (
                <label key={`soreness-${value}`} className="text-center">
                  <input
                    type="radio"
                    name="soreness"
                    value={value}
                    className="peer sr-only"
                    checked={soreness === value}
                    onChange={() => setSoreness(value)}
                    required
                  />
                  <span className="block rounded-xl border border-ink-800/20 py-2 text-sm transition peer-checked:border-ink-950 peer-checked:bg-ink-950 peer-checked:text-fog-50">
                    {value}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset className="rounded-2xl border border-ink-800/10 bg-white p-4">
          <legend className="text-sm">Training load</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { label: "None", value: "none" },
              { label: "Light", value: "light" },
              { label: "Medium", value: "medium" },
              { label: "Hard", value: "hard" }
            ].map((option) => (
              <label key={option.value} className="text-center">
                <input
                  type="radio"
                  name="training_load"
                  value={option.value}
                  className="peer sr-only"
                  checked={trainingLoad === option.value}
                  onChange={() => setTrainingLoad(option.value)}
                  required
                />
                <span className="block rounded-xl border border-ink-800/20 px-2 py-2 text-sm transition peer-checked:border-ink-950 peer-checked:bg-ink-950 peer-checked:text-fog-50">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-ink-800/10 bg-white p-4">
          <legend className="text-sm">Alcohol</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: "None", value: "none" },
              { label: "1-2", value: "1-2" },
              { label: "3+", value: "3+" }
            ].map((option) => (
              <label key={option.value} className="text-center">
                <input
                  type="radio"
                  name="alcohol"
                  value={option.value}
                  className="peer sr-only"
                  checked={alcohol === option.value}
                  onChange={() => setAlcohol(option.value)}
                  required
                />
                <span className="block rounded-xl border border-ink-800/20 px-2 py-2 text-sm transition peer-checked:border-ink-950 peer-checked:bg-ink-950 peer-checked:text-fog-50">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-ink-800/10 bg-white p-4">
          <legend className="text-sm">Energy</legend>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {ratingOptions.map((value) => (
              <label key={`energy-${value}`} className="text-center">
                <input
                  type="radio"
                  name="energy"
                  value={value}
                  className="peer sr-only"
                  checked={energy === value}
                  onChange={() => setEnergy(value)}
                  required
                />
                <span className="block rounded-xl border border-ink-800/20 py-2 text-sm transition peer-checked:border-ink-950 peer-checked:bg-ink-950 peer-checked:text-fog-50">
                  {value}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            Resting HR (optional)
            <input
              className="rounded-xl border border-ink-800/20 bg-white px-3 py-2"
              type="number"
              name="resting_hr"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            HRV (optional)
            <input
              className="rounded-xl border border-ink-800/20 bg-white px-3 py-2"
              type="number"
              name="hrv"
              step="0.1"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          Notes (optional)
          <textarea
            className="min-h-[96px] rounded-xl border border-ink-800/20 bg-white px-3 py-2"
            name="notes"
          />
        </label>

        <button
          className="w-full rounded-xl bg-ink-950 px-4 py-3 text-sm text-fog-50 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={submissionState === "saving"}
        >
          {submissionState === "saving" ? "Saving..." : "Save check-in"}
        </button>

        {submissionState === "saved" && (
          <p className="text-sm text-ink-800">
            Check-in saved. You can review today&apos;s snapshot in the Today tab.
          </p>
        )}

        {submissionState === "error" && submissionError && (
          <p className="text-sm text-rose-600">{submissionError}</p>
        )}
      </form>

      <Disclaimer />
    </div>
  );
}
