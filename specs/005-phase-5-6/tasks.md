---

description: "Phases 5-7 task list for meals, historic import, and polish"
---

# Tasks: RecoveryOS Phases 5-7 - Meals + Historic Import + Polish

**Input**: Design documents from `/specs/005-phase-5-6/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Scope Note**: Phases 1-4 are complete in the codebase; this task list focuses on Phases 5-7 only.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US3, US4)
- Include exact file paths in descriptions

---

## Phase 5: User Story 3 - Meal Photo Capture With Tags (Priority: P3)

**Goal**: Users capture meal photos with optional tags and view meal history.

**Independent Test**: Upload a meal photo with tags and verify it appears in the meals list and can be deleted.

### Implementation for User Story 3

- [X] T029 [P] [US3] Build meals page UI in `app/meals/page.tsx`
- [X] T030 [P] [US3] Build meal upload form in `components/meals/MealForm.tsx`
- [X] T031 [US3] Implement client-side compression in `lib/media/compress.ts`
- [X] T032 [US3] Implement meal upload action in `app/meals/actions.ts`
- [X] T033 [US3] Persist meal metadata in `lib/db/meals.ts`
- [X] T034 [US3] Implement meal deletion action in `app/meals/actions.ts`

**Checkpoint**: User Story 3 should be fully functional and testable independently.

---

## Phase 6: User Story 4 - Historic Data Import (Priority: P4)

**Goal**: Users import historic CSV data with preview, then confirm import and recompute scores.

**Independent Test**: Upload a CSV, preview valid/invalid rows, confirm import, and verify past scores exist.

### Implementation for User Story 4

- [X] T035 [P] [US4] Build import UI and preview table in `app/import/page.tsx`
- [X] T036 [US4] Implement CSV parsing and validation in `lib/import/csv.ts`
- [X] T037 [US4] Implement import preview action in `app/import/actions.ts`
- [X] T038 [US4] Implement import confirmation action in `app/import/actions.ts`
- [X] T039 [US4] Persist import job and errors in `lib/db/imports.ts`
- [X] T040 [US4] Recompute scores for imported dates in `lib/scoring/v1.ts`

**Checkpoint**: User Story 4 should be fully functional and testable independently.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Round out MVP experience with settings scaffold, exports, account deletion, privacy copy, and reusable empty states.

### Implementation for Phase 7

- [X] T041 [P] Add settings page scaffolding in `app/settings/page.tsx`
- [X] T042 [P] Add data export endpoint handler in `app/api/exports/route.ts`
- [X] T043 [P] Add account deletion handler in `app/api/account/delete/route.ts`
- [X] T044 [P] Add privacy copy and non-medical disclaimer references in `components/legal/PrivacyCopy.tsx`
- [X] T045 Add empty states and error handling in `components/ui/EmptyState.tsx`
- [X] T046 Run quickstart checklist against `specs/005-phase-5-6/quickstart.md`
