---

description: "Task list template for feature implementation"
---

# Tasks: RecoveryOS MVP Web App

**Input**: Design documents from `/specs/001-build-recoveryos-pwa/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js App Router app with TypeScript in `package.json` and `app/`
- [X] T002 Configure TailwindCSS in `tailwind.config.ts` and `styles/globals.css`
- [X] T003 [P] Configure ESLint and formatting rules in `.eslintrc.json` and `.prettierrc`
- [X] T004 [P] Add base layout shell and metadata in `app/layout.tsx`
- [X] T005 [P] Add PWA manifest and icons in `public/manifest.json` and `public/icons/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create Supabase client and env wiring in `lib/supabase/client.ts`
- [X] T007 Configure auth session handling in `lib/auth/session.ts`
- [X] T008 Create database migrations for core entities in `supabase/migrations/001_init.sql`
- [X] T009 Configure storage bucket policy for meal photos in `supabase/migrations/002_storage.sql`
- [X] T010 Configure RLS policies for user-owned data in `supabase/migrations/003_rls.sql`
- [X] T011 Create shared data access helpers in `lib/db/index.ts`
- [X] T012 Create scoring engine v1 in `lib/scoring/v1.ts`
- [X] T013 Create insight computation helpers in `lib/insights/compute.ts`
- [X] T014 Create CSV parsing and validation helpers in `lib/import/csv.ts`
- [X] T015 Create image compression utility in `lib/media/compress.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Daily Check-In With Recovery Guidance (Priority: P1) 🎯 MVP

**Goal**: Users complete a short daily check-in and receive a Recovery Score,
 pillar breakdown, and “today’s protocol.”

**Independent Test**: Submit a check-in and verify the score, pillars, and
 protocol render for that date and update on edit.

### Implementation for User Story 1

- [X] T016 [P] [US1] Build check-in form UI in `app/checkin/page.tsx`
- [X] T017 [P] [US1] Build today dashboard UI in `app/today/page.tsx`
- [X] T018 [US1] Implement check-in create/update action in `app/checkin/actions.ts`
- [X] T019 [US1] Implement score calculation on save in `lib/scoring/v1.ts`
- [X] T020 [US1] Persist DailyCheckin in `lib/db/checkins.ts`
- [X] T021 [US1] Persist RecoveryScore in `lib/db/scores.ts`
- [X] T022 [US1] Render score explanation and protocol text in `components/score/ScoreCard.tsx`
- [X] T023 [US1] Add non-medical disclaimer UI in `components/legal/Disclaimer.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Trend Review And Insight Cards (Priority: P2)

**Goal**: Users can view trend charts and simple insight cards for 7/30/90 days.

**Independent Test**: Seed multiple days of data and verify trend charts and
 insight cards render for each range.

### Implementation for User Story 2

- [ ] T024 [P] [US2] Build trends page layout in `app/trends/page.tsx`
- [ ] T025 [P] [US2] Add charts components in `components/trends/Charts.tsx`
- [ ] T026 [P] [US2] Add insight cards UI in `components/trends/InsightCards.tsx`
- [ ] T027 [US2] Implement trend data query in `lib/db/analytics.ts`
- [ ] T028 [US2] Implement insight computation in `lib/insights/compute.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Meal Photo Capture With Tags (Priority: P3)

**Goal**: Users capture meal photos with optional tags and view meal history.

**Independent Test**: Upload a meal photo with tags and verify it appears in
 the meals list and can be deleted.

### Implementation for User Story 3

- [ ] T029 [P] [US3] Build meals page UI in `app/meals/page.tsx`
- [ ] T030 [P] [US3] Build meal upload form in `components/meals/MealForm.tsx`
- [ ] T031 [US3] Implement client-side compression in `lib/media/compress.ts`
- [ ] T032 [US3] Implement meal upload action in `app/meals/actions.ts`
- [ ] T033 [US3] Persist meal metadata in `lib/db/meals.ts`
- [ ] T034 [US3] Implement meal deletion action in `app/meals/actions.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Historic Data Import (Priority: P4)

**Goal**: Users import historic CSV data with preview, then confirm import and
 recompute scores.

**Independent Test**: Upload a CSV, preview valid/invalid rows, confirm import,
 and verify past scores exist.

### Implementation for User Story 4

- [ ] T035 [P] [US4] Build import UI and preview table in `app/import/page.tsx`
- [ ] T036 [US4] Implement CSV parsing and validation in `lib/import/csv.ts`
- [ ] T037 [US4] Implement import preview action in `app/import/actions.ts`
- [ ] T038 [US4] Implement import confirmation action in `app/import/actions.ts`
- [ ] T039 [US4] Persist import job and errors in `lib/db/imports.ts`
- [ ] T040 [US4] Recompute scores for imported dates in `lib/scoring/v1.ts`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T041 [P] Add settings page scaffolding in `app/settings/page.tsx`
- [ ] T042 [P] Add data export endpoint handler in `app/api/exports/route.ts`
- [ ] T043 [P] Add account deletion handler in `app/api/account/delete/route.ts`
- [ ] T044 [P] Add privacy copy and non-medical disclaimer references in `components/legal/PrivacyCopy.tsx`
- [ ] T045 Add empty states and error handling in `components/ui/EmptyState.tsx`
- [ ] T046 Run quickstart checklist against `specs/001-build-recoveryos-pwa/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses US1 data but is independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent import flow

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
Task: "Build check-in form UI in app/checkin/page.tsx"
Task: "Build today dashboard UI in app/today/page.tsx"
```

---

## Parallel Example: User Story 2

```bash
Task: "Build trends page layout in app/trends/page.tsx"
Task: "Add charts components in components/trends/Charts.tsx"
Task: "Add insight cards UI in components/trends/InsightCards.tsx"
```

---

## Parallel Example: User Story 3

```bash
Task: "Build meals page UI in app/meals/page.tsx"
Task: "Build meal upload form in components/meals/MealForm.tsx"
```

---

## Parallel Example: User Story 4

```bash
Task: "Build import UI and preview table in app/import/page.tsx"
Task: "Implement CSV parsing and validation in lib/import/csv.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
