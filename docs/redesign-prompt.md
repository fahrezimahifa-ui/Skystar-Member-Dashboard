# Teamrise — Redesign Execution Prompt (reusable)

```
You are a senior frontend engineer. Improve the UI/UX, performance, and responsiveness of
"Teamrise", a React 19 + Vite + TypeScript + Tailwind CSS collaborative entrepreneurship
dashboard backed by Supabase (auth, Postgres, Realtime). The app is functional; this task is a
visual + UX + performance polish pass ONLY — do NOT change backend logic, SQL migrations, RBAC,
auth flows, API contracts, or data shapes.

STACK & CONSTRAINTS
- React 19, Vite 8, TypeScript (noUnusedLocals/Parameters, verbatimModuleSyntax). Build: `npm run build` (tsc -b && vite build) MUST stay green.
- Tailwind CSS v3 with custom tokens in tailwind.config.js (teal/yellow/blue/ink/canvas/line, shadow-card/soft, radius xl/2xl). Do NOT break these tokens.
- State: Zustand (src/store/useStore.ts). Use granular selectors to avoid re-renders.
- Supabase client in src/lib/supabase.ts; data access only via src/data/api.ts. DO NOT modify api.ts contracts or the store's data actions except for cosmetic wiring.
- Keep all behavior: username+password auth (synthetic @teamrise.app emails), team RPCs, invite-by-username, realtime, server RBAC.

DESIGN DIRECTION — "Clean SaaS" (refine, don't reinvent)
- Replace the current aurora-mesh background (.app-bg) and frosted-glass surfaces (.glass/.card in src/index.css) with a calm NEUTRAL CANVAS (#F7F8FA) and SOLID ELEVATED surfaces (white, 1px border-line, shadow-soft). Brand color is accent-only.
- Color roles: teal #3B988F primary, blue #2682B5 secondary, yellow #F4DB73 sparing highlight; add green/red for status. Stop hardcoding hex in components — use the existing tokens (canvas/ink/line/teal/...).
- Typography: Inter; consistent ramp 12/13/14/16/18/20/24/30/36; headings use font-heading.
- Spacing 4/8/12/16/24/32/48; radii sm8/md12/lg16/xl20; visible focus ring (ring-2 ring-teal/40).
- Add DARK MODE (Tailwind darkMode:'class'); override body/.card/.glass/text via a .dark CSS block; add a toggle in Settings (persist in localStorage). Scope-limited, low-risk.
- Motion via framer-motion (add to package.json): page transitions (AnimatePresence, fade/slide 200ms), modal/toast enter, hover lift on cards/buttons. Honor prefers-reduced-motion.

NAVIGATION / IA
- Desktop Sidebar (src/components/layout/Sidebar.tsx): brand wordmark, grouped nav, active pill, user footer. Mobile BottomNav: trim to 5 primary items (keep drawer for the rest). Header (AppShell.tsx): solid/translucent surface, keep search + notification bell + avatar.

PERFORMANCE
- Convert route imports in src/App.tsx to React.lazy + <Suspense fallback={<ScreenSkeleton/>}> so the heavy recharts 'charts' chunk loads only on Build/Progress. Keep existing manualChunks. React.memo heavy list rows. Verify selector granularity.

RESPONSIVENESS
- Audit every prioritized screen at 360/768/1024/1440. Fix overflow, standardize max-w-7xl container, touch targets >=40px, bottom-nav safe areas.

SHARED STATES
- Add Skeleton and ErrorState components (src/components/ui). Standardize EmptyState usage for async (hydrate, invites, KPIs).

SCREENS (priority order)
1 Auth — split brand panel + form, inline validation, password show/hide, submit loading, errors to toasts.
2 Settings — sectioned (Profile/Appearance[dark toggle]/Demo/Account), restyle danger zone, wire Save/Role/Log-out (already in store).
3 Notifications — grouped list, unread emphasis, mark-all, rich empty state.
4 Team — redesign InvitesInbox (received/sent, accept/reject/withdraw, invite-by-username), member cards w/ role + compatibility, readable Permissions.
5 Progress — chart tooltips/legends/palette, KPI tiles, loading skeleton, empty state.
6 Discover — idea cards w/ match-score viz, filter/sort, clear CTA.
7 Validate — hypothesis cards / status pipeline, inline add/edit.
8 Build — restyle tab bar + Overview; tidy Goals/Decisions/Issues/Values lists.
9 Dashboard — calmer hero, reduce visual noise (yellow Next Action card, teal stage card), consistent KPI tiles.

CODE CLEANUP (light only)
Remove dead exports, standardize Card/Button/Badge usage, eliminate hardcoded hex, drop unused imports. No architectural rewrite, no strict-TS migration.

ACCEPTANCE
- `npm run build` passes with no type errors.
- charts chunk loads only when Build/Progress visited.
- No console errors; toasts/modals animate; reduced-motion respected.
- No horizontal scroll at 360/768/1024/1440.
- Dark-mode toggle works for the session.
- All existing user flows still work (signup, form team, invite, accept, KPIs, realtime).

DELIVER
- Keep changes incremental and reviewable. Do not commit unless asked. Summarize what changed per file.
```
