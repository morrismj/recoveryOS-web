# Quickstart

## Purpose

Run the RecoveryOS MVP web app locally for development and QA.

## Prerequisites

- Node.js 20.x
- Supabase project (auth + database + storage)

## Environment Variables

Create a `.env.local` with:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Run Locally

```bash
npm install
npm run dev
```

## MVP UX Notes

- Keep daily check-in under 2 minutes.
- Always show a non-medical disclaimer alongside Recovery Score guidance.
- Use a calm, premium, data-first tone in all UI copy.
