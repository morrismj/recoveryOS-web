"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AppHeader() {
  const { data, status } = useSession();

  return (
    <header className="mb-8 flex items-center justify-between">
      <Link href="/" className="text-xs uppercase tracking-[0.3em] text-ink-800">
        RecoveryOS
      </Link>
      <div className="flex items-center gap-3 text-xs text-ink-800">
        {status === "authenticated" && data?.user?.email ? (
          <>
            <span className="rounded-full bg-fog-100 px-3 py-1">
              Signed in as {data.user.email}
            </span>
            <button
              className="rounded-full border border-ink-800/40 px-3 py-1"
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Log out
            </button>
          </>
        ) : null}
        {status === "unauthenticated" ? (
          <Link className="rounded-full border border-ink-800/40 px-3 py-1" href="/auth/signin">
            Sign in
          </Link>
        ) : null}
      </div>
    </header>
  );
}
