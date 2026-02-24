# Next Tests To Build

1. Today page rendering behavior
- If no user session, shows sign-in CTA and hides score/empty state.
- If user + no score, shows EmptyState with correct CTA.
- If user + score, renders ScoreCard with mapped pillars and protocol.

2. Scores DB integration (Prisma)
- Integration test against a test database to confirm upsertRecoveryScore writes.
- Verify getLatestRecoveryScore returns the newest record.

3. Check-in flow logic
- Validation rules and score recomputation on edits.
- Correct persistence of pillars/explanation/model version.

4. Auth/session boundaries
- getCurrentUserId behavior for missing session.
- getCurrentUserId behavior for expired session.
- getCurrentUserId behavior for valid user.
