# Research

## Decision: Web platform as mobile-first PWA
**Rationale**: Meets “Add to Home Screen” requirement without app store
submission, supports rapid iteration, and aligns with MVP scope.
**Alternatives considered**: Native iOS/Android builds (rejected for MVP scope).

## Decision: Next.js App Router + TypeScript
**Rationale**: Enables fast UI iteration, server-side rendering for landing
pages, and a unified codebase with strong type safety.
**Alternatives considered**: Single-page app with standalone API (adds
complexity for MVP).

## Decision: Supabase for auth, Postgres, and storage
**Rationale**: Consolidates authentication, database, and object storage for
meal photos under a single managed service, minimizing integration overhead.
**Alternatives considered**: Neon + Clerk + S3 (more moving parts for MVP).

## Decision: CSV import as defined product format
**Rationale**: Controls validation complexity and ensures predictable mapping
for Recovery Score inputs.
**Alternatives considered**: Supporting multiple wearable exports in MVP.

## Decision: Client-side meal photo compression
**Rationale**: Reduces upload time and data usage on mobile networks without
changing user workflow.
**Alternatives considered**: Server-side compression only (slower upload path).

## Decision: Charts for 7/30/90 day trends
**Rationale**: Directly supports success criteria and provides consistent
trend context for users.
**Alternatives considered**: Single fixed period (less flexible for insights).
