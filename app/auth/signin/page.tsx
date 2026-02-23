"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      window.location.href = "/checkin";
    }

    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Sign in</p>
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-sm text-ink-800">Pick up where you left off.</p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm">
          Email
          <input
            className="rounded-xl border border-ink-800/20 bg-white px-3 py-2"
            type="email"
            name="email"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Password
          <input
            className="rounded-xl border border-ink-800/20 bg-white px-3 py-2"
            type="password"
            name="password"
            minLength={8}
            required
          />
        </label>
        {error ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-ink-800">
            {error}
          </div>
        ) : null}
        <button
          className="w-full rounded-xl bg-ink-950 px-4 py-3 text-sm text-fog-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-xs text-ink-800">
        New here?{" "}
        <Link className="underline" href="/auth/signup">
          Create an account
        </Link>
        .
      </p>
    </div>
  );
}
