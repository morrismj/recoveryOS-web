"use client";

import { useState } from "react";
import Link from "next/link";

const MIN_PASSWORD_LENGTH = 8;

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password !== confirm) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Unable to create account.");
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-800">Sign up</p>
        <h1 className="text-3xl font-semibold">Create your RecoveryOS login</h1>
        <p className="text-sm text-ink-800">
          Use a secure password with at least {MIN_PASSWORD_LENGTH} characters.
        </p>
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
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Confirm password
          <input
            className="rounded-xl border border-ink-800/20 bg-white px-3 py-2"
            type="password"
            name="confirm"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </label>
        {error ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-ink-800">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-sea-500/30 bg-sea-500/10 p-3 text-xs text-ink-800">
            Account created. You can sign in now.
          </div>
        ) : null}
        <button
          className="w-full rounded-xl bg-ink-950 px-4 py-3 text-sm text-fog-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="text-xs text-ink-800">
        Already have an account?{" "}
        <Link className="underline" href="/auth/signin">
          Sign in
        </Link>
        .
      </p>
    </div>
  );
}
