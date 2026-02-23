# Feature Specification: RecoveryOS MVP Web App

**Feature Branch**: `001-build-recoveryos-pwa`  
**Created**: 2026-02-23  
**Status**: Draft  
**Input**: User description: "Define an MVP recovery operating system with daily check-ins, recovery score and guidance, trend dashboards, meal photo capture, and historic CSV import, targeted at men 40–55, with non-medical framing."

## Clarifications

### Session 2026-02-23

- Q: Which daily check-in fields are required? → A: sleep hours, stress, soreness, training load, alcohol, energy
- Q: What export formats are required for MVP? → A: CSV only (check-ins, scores, meals metadata)
- Q: What data deletion capability is required for MVP? → A: account deletion and “delete all my data”
- Q: How should CSV import handle invalid rows? → A: import valid rows and report invalid rows in preview
- Q: What timezone rule applies to daily check-ins? → A: use the user’s account timezone for all dates

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Daily Check-In With Recovery Guidance (Priority: P1)

As a time-poor professional, I want to enter a short daily check-in so I get a
clear Recovery Score and a simple “today’s protocol,” helping me decide how to
train or recover.

**Why this priority**: This is the core daily loop that delivers immediate value
and establishes habit formation.

**Independent Test**: Can be tested by completing a check-in and confirming a
Recovery Score, pillar breakdown, and protocol appear for that date.

**Acceptance Scenarios**:

1. **Given** a signed-in user with no check-in for today, **When** they submit a
   check-in with required inputs (sleep hours, stress, soreness, training load,
   alcohol, energy), **Then** a Recovery Score, pillar breakdown, and “today’s
   protocol” are created and shown.
2. **Given** a user has already checked in today, **When** they update their
   entries, **Then** the score and guidance update for that date.

---

### User Story 2 - Trend Review And Insight Cards (Priority: P2)

As a user, I want weekly and monthly trends so I can see patterns in recovery
and energy over time.

**Why this priority**: Trends validate whether the system works and reinforce
long-term engagement.

**Independent Test**: Can be tested by loading trend views after multiple days
of data and confirming charts and insight cards show computed changes.

**Acceptance Scenarios**:

1. **Given** at least seven days of check-ins, **When** the user opens the
   trends view, **Then** charts show Recovery Score, Energy, Sleep, Stress, and
   Training Load over the selected period.

---

### User Story 3 - Meal Photo Capture With Tags (Priority: P3)

As a user, I want to quickly capture meal photos and optional tags so I can
correlate diet with recovery and energy later.

**Why this priority**: Low-friction meal capture enables future insights and
supports the data-first positioning.

**Independent Test**: Can be tested by uploading a meal photo with tags and
confirming it appears in the meals list with timestamp and notes.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they add a meal photo with optional tags
   and notes, **Then** the meal entry is saved and visible in their history.

---

### User Story 4 - Historic Data Import (Priority: P4)

As a user, I want to import historic data so my trends and scores reflect my
recent past rather than starting from zero.

**Why this priority**: Importing history accelerates insight generation and
reduces time to value.

**Independent Test**: Can be tested by importing a CSV file and confirming
check-ins and scores exist for those dates.

**Acceptance Scenarios**:

1. **Given** a valid CSV file in the supported format, **When** the user uploads
   and confirms import, **Then** past days are created and scores are
   recomputed.
2. **Given** a CSV file with invalid rows, **When** the user previews the
   import, **Then** invalid rows are flagged and do not block valid rows.

---

### Edge Cases

- User submits a check-in missing optional fields (e.g., HRV or resting HR).
- User attempts a second check-in on the same date.
- CSV import contains duplicate dates already captured.
- CSV import includes invalid rows; valid rows should still proceed after
  preview.
- Meal photo upload fails or times out on a poor connection.
- Trend view is opened with fewer than seven days of data.
- Check-in date is determined by the user’s account timezone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to sign in and access only their own data.
- **FR-002**: System MUST allow users to submit one daily check-in per date with
  required fields (sleep hours, stress, soreness, training load, alcohol,
  energy) and update it.
- **FR-003**: System MUST generate a Recovery Score (0–100) with a five-part
  pillar breakdown for each check-in date.
- **FR-004**: System MUST display a concise “today’s protocol” recommendation
  tied to the latest score.
- **FR-005**: System MUST provide trend views for 7, 30, and 90-day ranges for
  Recovery Score, Energy, Sleep, Stress, and Training Load.
- **FR-006**: System MUST generate simple insight cards that summarize observed
  correlations (e.g., alcohol vs. energy) when sufficient data exists.
- **FR-007**: System MUST allow users to upload meal photos with optional tags,
  meal time, and notes, and view their meal history.
- **FR-008**: System MUST compress uploaded meal photos before storage to reduce
  upload time and data usage.
- **FR-009**: System MUST support importing historic data from a defined CSV
  format with a preview and confirmation step.
- **FR-010**: System MUST recompute scores for imported dates after a successful
  import.
- **FR-011**: System MUST allow users to delete their meal photos and related
  entries.
- **FR-012**: System MUST provide a CSV data export for a user’s check-ins,
  scores, and meals metadata.
- **FR-014**: System MUST allow users to delete their account and all associated
  data.
- **FR-013**: System MUST display clear privacy copy covering photo usage and
  data ownership.

### Compliance Notes *(mandatory)*

- Non-medical positioning: all user-facing copy and guidance MUST avoid medical
  diagnosis or treatment claims and include a clear “not medical advice”
  disclaimer.
- Explainability: each score, pillar value, and insight card MUST provide a
  short explanation linking it to the inputs that drive it.

### Key Entities *(include if feature involves data)*

- **User**: Person with an account and access to only their own data.
- **DailyCheckin**: A per-date record of recovery-related inputs and notes.
- **RecoveryScore**: A per-date score with a five-part pillar breakdown and
  model version.
- **Meal**: A photo-based meal entry with timestamp, optional tags, and notes.
- **ImportJob**: A record of a CSV import, its status, and any row-level errors.

## Dependencies

- A defined MVP CSV format and sample data for import testing.
- Approved privacy copy for meal photos and non-medical disclaimer.

## Assumptions

- Users authenticate with an email-based sign-in experience.
- Each account maps to a single user and only their data.
- The MVP CSV format is defined by the product team and published to users.
- Trend views require at least seven days of data to show insights.
- Score explanations are short, user-facing summaries tied to inputs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of users can complete a daily check-in in under 2 minutes.
- **SC-002**: At least 95% of valid CSV rows import successfully on first try.
- **SC-003**: Users can access a 7-day trend view in under 5 seconds.
- **SC-004**: 80% of test users report the Recovery Score as “understandable” or
  “very understandable” in a post-task survey.
- **SC-005**: At least 70% of users who add 7+ check-ins view the trends page at
  least once within the following week.
