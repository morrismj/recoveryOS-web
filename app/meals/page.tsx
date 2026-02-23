import Link from "next/link";
import { getCurrentUserId } from "../../lib/auth/session";
import { listMeals } from "../../lib/db/meals";
import { deleteMeal } from "./actions";
import MealForm from "../../components/meals/MealForm";
import Disclaimer from "../../components/legal/Disclaimer";

export const dynamic = "force-dynamic";

const formatTimestamp = (value: Date) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

export default async function MealsPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Meals</p>
          <h1 className="text-3xl font-semibold">Sign in to continue</h1>
          <p className="text-sm text-ink-800">
            Create an account to save meals and connect nutrition to recovery.
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

  const meals = await listMeals(userId);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Meals</p>
        <h1 className="text-3xl font-semibold">Photo log</h1>
        <p className="text-sm text-ink-800">
          Capture meals to build context around recovery and energy shifts.
        </p>
      </header>

      <MealForm />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recent meals</h2>
        {meals.length === 0 ? (
          <div className="rounded-2xl border border-ink-800/10 bg-white p-4 text-sm text-ink-800">
            No meals yet. Add your first photo to get started.
          </div>
        ) : (
          <div className="grid gap-4">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="overflow-hidden rounded-2xl border border-ink-800/10 bg-white"
              >
                <img
                  alt="Meal"
                  className="h-40 w-full object-cover"
                  src={meal.photoUrl}
                />
                <div className="grid gap-2 p-4 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-ink-950">
                      {meal.mealType ? meal.mealType : "Meal"}
                    </span>
                    <span className="text-xs text-ink-800/70">
                      {formatTimestamp(meal.timestamp)}
                    </span>
                  </div>
                  {meal.tags.length ? (
                    <div className="flex flex-wrap gap-2">
                      {meal.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-fog-100 px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {meal.note ? <p className="text-ink-800">{meal.note}</p> : null}
                  <form action={deleteMeal}>
                    <input type="hidden" name="meal_id" value={meal.id} />
                    <button
                      className="text-xs uppercase tracking-[0.2em] text-ink-800/70"
                      type="submit"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Disclaimer />
    </div>
  );
}
