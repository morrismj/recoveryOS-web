import Link from "next/link";
import { getCurrentUserId } from "../../lib/auth/session";
import ImportForm from "../../components/import/ImportForm";
import Disclaimer from "../../components/legal/Disclaimer";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Import</p>
          <h1 className="text-3xl font-semibold">Sign in to continue</h1>
          <p className="text-sm text-ink-800">
            Create an account to import historic check-ins.
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
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Import</p>
        <h1 className="text-3xl font-semibold">Bring your history forward</h1>
        <p className="text-sm text-ink-800">
          Upload a CSV in the RecoveryOS format to backfill past check-ins.
        </p>
      </header>

      <ImportForm />

      <Disclaimer />
    </div>
  );
}
