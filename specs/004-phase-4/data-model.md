# Data Model

## Overview

All records are scoped to a single user. Dates for daily check-ins are computed
in the user’s account timezone.

## Entities

### User
- **id**: UUID (primary key)
- **email**: string (unique, required)
- **timezone**: string (IANA name, required)
- **created_at**: timestamp

### DailyCheckin
- **id**: UUID (primary key)
- **user_id**: UUID (FK → User.id, required)
- **date**: date (required, unique per user)
- **sleep_hours**: decimal (required, >= 0)
- **stress**: integer 1–5 (required)
- **soreness**: integer 1–5 (required)
- **training_load**: enum {none, light, medium, hard} (required)
- **alcohol**: enum {none, 1-2, 3+} (required)
- **energy**: integer 1–5 (required)
- **resting_hr**: integer (optional)
- **hrv**: decimal (optional)
- **notes**: text (optional)
- **created_at**: timestamp
- **updated_at**: timestamp

**Validation rules**:
- One check-in per user per date (account timezone).
- Optional fields do not block score creation.

### RecoveryScore
- **id**: UUID (primary key)
- **user_id**: UUID (FK → User.id, required)
- **date**: date (required, unique per user)
- **recovery_score**: integer 0–100 (required)
- **pillars**: JSON object with keys:
  - **sleep_integrity**: 0–100
  - **hormonal_stability**: 0–100
  - **load_management**: 0–100
  - **inflammation_control**: 0–100
  - **cognitive_bandwidth**: 0–100
- **explanation**: short text (required, ties score to inputs)
- **model_version**: string (required)
- **created_at**: timestamp

**Relationships**:
- One RecoveryScore per DailyCheckin date per user.

### Meal
- **id**: UUID (primary key)
- **user_id**: UUID (FK → User.id, required)
- **timestamp**: timestamp (required)
- **photo_url**: string (required)
- **meal_type**: enum {breakfast, lunch, dinner, snack} (optional)
- **tags**: string array (optional)
- **note**: text (optional)
- **created_at**: timestamp

**Validation rules**:
- Photos are compressed client-side before upload.

### ImportJob
- **id**: UUID (primary key)
- **user_id**: UUID (FK → User.id, required)
- **type**: enum {generic_csv} (required)
- **original_filename**: string (required)
- **status**: enum {uploaded, previewed, processed, failed} (required)
- **row_errors**: JSON array (optional)
- **created_at**: timestamp

**State transitions**:
- uploaded → previewed → processed
- uploaded → failed
- previewed → failed

## Relationships Summary
- User 1..n DailyCheckin
- User 1..n RecoveryScore
- User 1..n Meal
- User 1..n ImportJob
- DailyCheckin 1..1 RecoveryScore (by date, user scope)
