---

description: "Phase 4 task list for trend review and insight cards"
---

# Tasks: RecoveryOS Phase 4 - Trends And Insight Cards

**Input**: Design documents from `/specs/004-phase-4/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Scope Note**: Phases 1-3 are complete in the codebase; this task list focuses on Phase 4 only.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US2)
- Include exact file paths in descriptions

---

## Phase 4: User Story 2 - Trend Review And Insight Cards (Priority: P2)

**Goal**: Users can view trend charts and simple insight cards for 7/30/90 days.

**Independent Test**: Seed multiple days of data and verify trend charts and insight cards render for each range.

### Implementation for User Story 2

- [X] T024 [P] [US2] Build trends page layout in `app/trends/page.tsx`
- [X] T025 [P] [US2] Add charts components in `components/trends/Charts.tsx`
- [X] T026 [P] [US2] Add insight cards UI in `components/trends/InsightCards.tsx`
- [X] T027 [US2] Implement trend data query in `lib/db/analytics.ts`
- [X] T028 [US2] Implement insight computation in `lib/insights/compute.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.
