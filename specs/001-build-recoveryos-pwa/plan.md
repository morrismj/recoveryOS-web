# Implementation Plan: RecoveryOS MVP Web App

**Branch**: `001-build-recoveryos-pwa` | **Date**: 2026-02-23 | **Spec**: `/Users/michaelmorris/Documents/GitHub/recoveryOS-web/specs/001-build-recoveryos-pwa/spec.md`
**Input**: Feature specification from `/specs/001-build-recoveryos-pwa/spec.md`

## Summary

Build a mobile-first RecoveryOS MVP web app that supports daily check-ins,
Recovery Score guidance, trends and insight cards, meal photo capture, and CSV
history import. Implement as a Next.js PWA with Supabase for auth, storage, and
Postgres data, prioritizing minimal friction and explainable outputs.

## Technical Context

**Language/Version**: TypeScript (Node.js 20.x runtime)  
**Primary Dependencies**: Next.js (App Router), TailwindCSS, Supabase JS client, Recharts  
**Storage**: Supabase Postgres + Supabase Storage (meal photos)  
**Testing**: Vitest (unit) and Playwright (e2e smoke)  
**Target Platform**: Mobile-first web (iOS Safari, Android Chrome)  
**Project Type**: Web application (PWA)  
**Performance Goals**: Home and trends views usable within 5 seconds on 4G  
**Constraints**: Add-to-Home-Screen PWA, non-medical positioning, offline-friendly
read access to recent data  
**Scale/Scope**: MVP for 1,000 active users, tens of thousands of check-ins

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- System over metrics: check-in aggregates multi-signal inputs and produces
  a Recovery Score, pillar breakdown, and guidance.
- Data integrity & explainability: scoring outputs link to input drivers and
  preserve raw input records.
- Non-medical positioning: UI copy includes explicit “not medical advice”
  disclaimer and avoids diagnosis language.
- Minimal friction: required inputs limited to six fields and designed for
  <2 minute completion.
- Calm, premium, data-first tone: UI copy is concise, neutral, and analytical.

## Project Structure

### Documentation (this feature)

```text
specs/001-build-recoveryos-pwa/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── (public)/
├── auth/
├── checkin/
├── import/
├── meals/
├── settings/
├── today/
└── trends/

components/
lib/
public/
styles/

supabase/
└── migrations/
```

**Structure Decision**: Single Next.js app at repository root using App Router,
with feature routes in `app/` and shared code in `components/` and `lib/`.
Supabase migrations live in `supabase/migrations`.

## Constitution Check (Post-Design)

- System over metrics: data model captures multi-signal inputs and supports
  derived scoring with provenance.
- Data integrity & explainability: contracts include inputs and scoring outputs
  with explanation fields.
- Non-medical positioning: quickstart and UI copy references include disclaimer
  requirement.
- Minimal friction: required inputs enumerated and kept to six fields.
- Calm, premium, data-first tone: UI copy guidelines included in quickstart.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
