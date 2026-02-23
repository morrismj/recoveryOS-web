"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function AppHeader() {
  const { data, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/today", label: "Today" },
    { href: "/checkin", label: "Check-in" },
    { href: "/trends", label: "Trends" },
    { href: "/meals", label: "Meals" },
    { href: "/import", label: "Import" },
    { href: "/settings", label: "Settings" }
  ];

  return (
    <header className="relative mb-8 flex items-center justify-between">
      <Link href="/" className="text-xs uppercase tracking-[0.3em] text-ink-800">
        RecoveryOS
      </Link>
      <div className="flex items-center gap-2 text-xs text-ink-800">
        {status === "authenticated" && data?.user?.email ? (
          <>
            <span className="hidden rounded-full bg-fog-100 px-3 py-1 md:inline">
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
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          className="rounded-full border border-ink-800/40 px-3 py-1 text-sm"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
      </div>

      {menuOpen ? (
        <div className="absolute right-0 top-12 z-20 w-56 rounded-2xl border border-ink-800/10 bg-white p-2 shadow-lg">
          <nav className="grid gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-ink-950 text-fog-50"
                      : "text-ink-800 hover:bg-fog-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
