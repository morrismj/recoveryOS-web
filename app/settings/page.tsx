import Link from "next/link";
import { getCurrentUserId } from "../../lib/auth/session";
import PrivacyCopy from "../../components/legal/PrivacyCopy";
import Disclaimer from "../../components/legal/Disclaimer";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Settings</p>
          <h1 className="text-3xl font-semibold">Sign in to continue</h1>
          <p className="text-sm text-ink-800">
            Create an account to manage your privacy and data settings.
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
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Settings</p>
        <h1 className="text-3xl font-semibold">Account controls</h1>
        <p className="text-sm text-ink-800">
          Export or delete your data whenever you need to.
        </p>
      </header>

      <section className="grid gap-3 rounded-2xl border border-ink-800/10 bg-white p-4 text-sm">
        <div className="text-sm font-semibold text-ink-950">Data export</div>
        <p className="text-xs text-ink-800/70">
          Download your check-ins, scores, and meal metadata as CSV.
        </p>
        <Link
          className="inline-flex w-fit rounded-full border border-ink-800/20 px-3 py-1 text-xs"
          href="/api/exports"
        >
          Download CSV
        </Link>
      </section>

      <section className="grid gap-3 rounded-2xl border border-ink-800/10 bg-white p-4 text-sm">
        <div className="text-sm font-semibold text-ink-950">Account deletion</div>
        <p className="text-xs text-ink-800/70">
          This permanently removes your account and all stored data.
        </p>
        <form action="/api/account/delete" method="post">
          <button
            className="inline-flex w-fit rounded-full border border-rose-300 px-3 py-1 text-xs text-rose-600"
            type="submit"
          >
            Delete account
          </button>
        </form>
      </section>

      <PrivacyCopy />

      <Disclaimer />
    </div>
  );
}
