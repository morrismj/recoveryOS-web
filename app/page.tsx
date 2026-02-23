import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">RecoveryOS</p>
        <h1 className="text-3xl font-semibold md:text-4xl">
          Recovery, clarified.
        </h1>
        <p className="text-base text-ink-800">
          A calm, data-first daily check-in that translates signals into
          practical guidance.
        </p>
      </header>
      <div className="grid gap-3">
        <Link className="rounded-xl bg-ink-950 px-4 py-3 text-sm text-fog-50" href="/checkin">
          Start today&apos;s check-in
        </Link>
        <Link className="rounded-xl border border-ink-800 px-4 py-3 text-sm" href="/today">
          View today&apos;s protocol
        </Link>
      </div>
    </div>
  );
}
