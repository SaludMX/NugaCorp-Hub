# NugaCorp Wireless Hub — Technical & Security README

This document centralizes all technical details and security-sensitive guidance. Per the immutable rule, do not place confidential or security-sensitive information in the root README.md. Use this file for engineering-centric documentation.

## Documentation Index

All non-essential root markdown files are organized under this `docs/` folder per the immutable project rule.

Contents:
- PHASE1_SUMMARY.md
- PHASE2A_SUMMARY.md
- PHASE2C_SUMMARY.md
- PHASE3_SUMMARY.md
- PHASE4A_SUMMARY.md
- SUPABASE_SETUP.md
- README-TECH.md

Root exceptions: The project root README.md remains a commercial/profile overview only. Technical and security-sensitive details are consolidated in this README-TECH.md.

## Scope
- Engineering setup and environment configuration
- Security practices and secrets handling
- Deployment, CI/CD, and operations
- Architecture diagrams and data flows
- Supabase schema, RLS policies, and functions
- Edge Functions, workers, and job processing

## Security & Secrets
- Never commit secrets. Use environment files or secure secret stores.
- Frontend uses publishable keys only (e.g., Supabase anon key). Service role keys must never be in client code.
- RLS enforces multi-tenant access; roles are authoritative server-side.
- Edge Functions must validate JWT if exposed publicly.

## Environments
- `.env` (local only, untracked)
- `.env.example` (template with non-sensitive placeholders)
- Required variables:
  - `VITE_SUPABASE_URL` — Project URL
  - `VITE_SUPABASE_ANON_KEY` — Publishable key
  - Optional per-service keys in server-side contexts only

## Supabase
- See migrations under `supabase/migrations/`.
- Confirm policies for `SUPER_ADMIN`, `WISP_OWNER`, `WISP_STAFF`, `CLIENT`.
- RPC:
  - `enqueue_mikrotik_job()` — enqueues jobs with role validation
  - `increment_job_retry()` — worker-only retry management

## Edge Functions
- `supabase/functions/enqueue-mikrotik-job/` — Validates JWT and calls RPC.
- Keep function dependencies minimal; use import maps if needed.

## Worker (MikroTik Jobs)
- Location: `workers/mikrotik-worker/`
- Polls pending/scheduled jobs; processes in mock mode (no SSH).
- Uses service role key in server context only.

## Frontend Hooks
- `hooks/data/useMikrotikJobs.ts` — Read-only jobs + enqueue via Edge Function.
- Other hooks follow the pattern `{ data, loading, error, refetch, (optional) create/update/delete }`.

## Architecture Notes
- React + TypeScript + Vite
- Supabase Postgres with RLS; Edge Functions; Node worker
- Multi-tenant strategy via `wisp_id` and role policies

## Compliance
- README.md remains commercial overview only.
- All technical/sensitive content lives here or under `docs/`.
- Non-essential root markdown is housed in `docs/` per project rules.

## References
- [PHASE1_SUMMARY.md](PHASE1_SUMMARY.md)
- [PHASE2A_SUMMARY.md](PHASE2A_SUMMARY.md)
- [PHASE2C_SUMMARY.md](PHASE2C_SUMMARY.md)
- [PHASE3_SUMMARY.md](PHASE3_SUMMARY.md)
- [PHASE4A_SUMMARY.md](PHASE4A_SUMMARY.md)
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
