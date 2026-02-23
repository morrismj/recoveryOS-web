<!--
Sync Impact Report
- Version change: N/A -> 0.1.0
- Modified principles: N/A
- Added sections: Core Principles, Product Constraints, Development Workflow, Governance
- Removed sections: N/A
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ⚠️ .specify/templates/commands/*.md (directory not found)
- Follow-up TODOs:
  - TODO(RATIFICATION_DATE): original ratification date not known
-->
# RecoveryOS Constitution

## Core Principles

### I. System Over Metrics
RecoveryOS MUST model stress-recovery cycles and phase awareness rather than
single-metric optimization. Features MUST integrate signals across sleep, HRV,
resting HR, training load, alcohol, travel, and check-ins to produce
system-level outputs.

### II. Data Integrity & Explainability
Every score, flag, or recommendation MUST be traceable to specific inputs with
clear reasoning. The system MUST preserve raw input provenance and present
confidence or uncertainty where appropriate.

### III. Non-Medical Positioning (Non-Negotiable)
RecoveryOS MUST NOT present medical diagnosis or treatment claims. Language,
copy, and outputs MUST frame guidance as informational and performance-oriented,
with clear disclaimers where needed.

### IV. Minimal Friction
Daily usage MUST be achievable in under two minutes, with the check-in designed
for 60 seconds or less. The system MUST default to automation and only ask for
manual input when it materially improves accuracy.

### V. Calm, Premium, Data-First Tone
All user-facing surfaces MUST maintain a calm, intelligent, low-ego voice.
Design and content MUST avoid hype, macho aesthetics, or influencer-style
language and instead emphasize clarity and trust.

## Product Constraints

RecoveryOS targets high-performing men aged 40-55 who already track data and
want clarity without coaching. The product MUST function as a structured
operating system for recovery with the following minimum outputs: Daily Recovery
Score, Stress Phase Detection, Overreach Warning, Weekly Load Recommendation,
Mobility Risk Flag, and Quarterly Performance Trend.

## Development Workflow

Every feature MUST include a Constitution Check in the plan phase and document
how it satisfies each Core Principle. Changes that affect scoring logic or
user-facing guidance MUST include explainability notes and an explicit
non-medical compliance review.

## Governance

This constitution supersedes all other practices. Amendments require
documentation, rationale, and a semantic version bump consistent with the scope
of change (MAJOR for backward-incompatible governance or principle removals,
MINOR for new principles or material expansions, PATCH for clarifications).
All plans and reviews MUST verify compliance, and any deviation MUST be
explicitly justified with a simpler alternative noted.

**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE): original ratification date not known | **Last Amended**: 2026-02-23
