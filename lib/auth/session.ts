export async function getCurrentUserId(): Promise<string | null> {
  // TODO: Replace with real auth integration (e.g. Clerk/NextAuth).
  return process.env.RECOVERYOS_USER_ID ?? null;
}

export async function requireUserId(): Promise<string> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("User session required. Please sign in.");
  }

  return userId;
}
