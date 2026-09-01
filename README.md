# Teamrise — Team Entrepreneurship Dashboard

A collaborative web app that guides a founding team through the entrepreneurship
journey: **Discover** (assessment & self-understanding) → **Validate** (find &
invite complementary teammates, test hypotheses) → **Build** (run the business
with tasks, milestones, decisions, issues, and live analytics).

Built as a real, multi-user product on **React 19 + Vite + TypeScript** with
**Supabase** (Postgres + Auth + Realtime + Storage). Authentication uses a
**username + password** model (the app synthesizes an internal email per user,
so no real inbox is required).

## Features

- Username/password sign-up & sign-in (Supabase Auth, auto-confirmed).
- Personal profile: MBTI, skills, interests, availability, entrepreneurial preferences.
- Candidate pool & team recommendations scored from real teammate profiles.
- Form a team and **invite colleagues by username**; invites surface as notifications.
- Build workspace: business idea, model canvas, hypotheses/personas, goals,
  milestones, Kanban tasks, decisions, issues, team values, capabilities.
- Live collaboration via Supabase Realtime (tasks, milestones, members, invites).
- Analytics: KPIs and charts computed from your real team data.
- Role-based access control (Admin / Team Lead / Member) enforced in the database.

## Tech stack

- React 19, Vite 8, TypeScript (strict-ish; `noUnusedLocals`, `verbatimModuleSyntax`).
- Supabase JS v2 (`@supabase/supabase-js`).
- Recharts for visualizations, Tailwind for styling, Oxlint for linting.
- State: Zustand (`src/store`).

## Prerequisites

- Node.js 18+ and npm.
- A Supabase project (or use the shared project — ask the owner for the env values).

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   Then set:
#     VITE_SUPABASE_URL=https://<your-project>.supabase.co
#     VITE_SUPABASE_ANON_KEY=<your-anon-key>
#     VITE_DEMO=0
#   (If you use the shared project, get these values from the project owner.)

# 3. Run database migrations
#   In the Supabase dashboard → SQL Editor, run, in order:
#     supabase/migrations/0001_init.sql
#     supabase/migrations/0002_team_rpcs.sql
#     supabase/migrations/0003_invite_username.sql
#     supabase/migrations/0004_rbac.sql
#   (The anon key is public by design; RLS protects all data.)

# 4. Start the dev server
npm run dev
```

> **Note:** `VITE_DEMO=1` runs the app with built-in mock data and no backend.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |

## Using the app

1. Open the app and **sign up with a username and password**.
2. Complete your profile (Discover), then review **recommended teammates**.
3. **Invite a colleague by username** (Team page) or form a team from candidates.
4. Collaborate in **Build** — everything syncs live across teammates.

## Architecture notes

- `src/lib/supabase.ts` — client + `isSupabaseConfigured` guard.
- `src/data/api.ts` — Supabase access layer (all writes guarded).
- `src/data/database.ts` — row ↔ domain mappers.
- `src/store/useStore.ts` — Zustand store (hydrate, realtime refresh, actions).
- `src/store/auth.tsx` — auth provider; `toAuthEmail()` maps username → internal email.
- Migrations in `supabase/migrations/` define schema, RLS, RPCs, and triggers.

## Known limitations

- Accounts use undeliverable synthetic emails, so **password reset via email is
  disabled**; accounts are managed by the team/admin.
- Recommendation scoring is heuristic (profile-derived), not a trained model.
- Analytics are computed from your team's data; there is no platform-wide admin
  view in this build.

## License

MIT — see [LICENSE](./LICENSE).
