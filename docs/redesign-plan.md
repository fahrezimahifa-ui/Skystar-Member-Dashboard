# Teamrise — "Clean SaaS" Redesign Plan

## 1. Goal & principles
Elevate the current **aurora + frosted-glass** look into a calm, professional SaaS UI while keeping the Teamrise teal/yellow/blue brand. Keep every existing behavior (Supabase auth, RPCs, RBAC, realtime, KPIs) intact. Principles: restrained color, consistent surfaces, clear hierarchy, fast, responsive, delightful-but-subtle motion.

## 2. Design language (the "refine" spec)
- **Background**: replace the loud `.app-bg` mesh + frosted `.glass`/`.card` with a **neutral canvas** (`#F7F8FA`) and **solid elevated surfaces** (white, 1px `line` border, `shadow-soft`). Keep brand color for accents/CTA only. (This is the single biggest "cleaner" win.)
- **Color roles**: teal `#3B988F` = primary/brand; blue `#2682B5` = secondary; yellow `#F4DB73` = sparing highlight only; add semantic **green/red** for status (already used by `Badge` tone). Define `canvas`, `surface`, `ink` scale, `line` tokens and reuse them everywhere (stop hardcoding hex in components).
- **Typography**: Inter; explicit ramp — 12/13/14/16/18/20/24/30/36px; weights 500/600/700; tighter heading line-heights. Use `font-heading` for h1–h4 consistently.
- **Spacing & radius**: standardize to 4/8/12/16/24/32/48 and radii sm8/md12/lg16/xl20. Remove one-off paddings.
- **Shadows & borders**: `shadow-card` for resting, `shadow-soft` + `border-teal/40` on hover lift. Add a visible **focus ring** (`ring-2 ring-teal/40`).
- **Dark mode** (pragmatic, low-risk): `darkMode: 'class'`; override `body`/`.card`/`.glass`/text via a `.dark` CSS block; add a toggle in Settings. Keep it scope-limited to layout surfaces, not a full token rewrite.
- **Motion (Framer Motion)**: page transitions (fade/slide 200ms), modal/toast enter, button/card hover lift; honor `prefers-reduced-motion`.

## 3. Navigation & IA
- **Desktop sidebar** (`Sidebar.tsx`): add brand wordmark, group items (Work: Discover/Validate/Build/Progress; Team: Team/Notifications; Account: Settings), active "pill" state, user footer. Keep `hidden lg:flex`.
- **Mobile bottom nav**: currently 8 items (`sm:grid-cols-8`) — trim to **5 primary** (Discover, Validate, Build, Team, More→Notifications/Settings) to avoid cramping; keep drawer for the rest.
- **Header** (`AppShell.tsx`): swap glass for a solid/translucent surface; keep search, notification bell (unread dot), avatar; ensure consistent height.
- Enforce **one primary CTA per stage** across screens (Dashboard already does this).

## 4. Cross-cutting engineering
- **Performance**:
  - Convert all route imports in `App.tsx` to `React.lazy` + `<Suspense fallback={<ScreenSkeleton/>}>` so the `charts` chunk (410 kB) loads only when Build/Progress are visited. (manualChunks already exists.)
  - `React.memo` heavy list rows (members, tasks, hypotheses, notifications); verify Zustand selector granularity (avoid selecting whole objects that re-render).
- **Responsiveness**: audit every prioritized screen at 360 / 768 / 1024 / 1440; fix horizontal overflow, standardize `max-w-7xl` container, ensure touch targets ≥ 40px, test bottom-nav safe areas.
- **State consistency**: standardize `EmptyState`, add `Skeleton` + `ErrorState` components; use them for async (hydrate, invites, KPIs).
- **Dark mode** as above.

## 5. Per-screen improvements (priority order)
1. **Auth** (high): split-screen brand panel + form; inline validation; password show/hide; route errors to toasts; loading state on submit; link to username (not email) semantics.
2. **Settings** (high): sectioned layout (Profile / Appearance [dark toggle] / Demo / Account); restyle danger zone; wire already-implemented Save/Role/Log-out.
3. **Notifications** (high): grouped-by-date list, unread emphasis, bulk "mark all read", rich empty state.
4. **Team** (high): redesign `InvitesInbox` (received/sent, accept/reject/withdraw, invite-by-username) with clearer hierarchy; `MemberGrid` cards (role badge, compatibility); make Permissions tab readable.
5. **Progress** (high): refine chart tooltips/legends/palette, KPI tiles, loading skeleton, empty state.
6. **Discover** (high): idea cards with match-score visualization; filter/sort; clearer CTA to invite/form team.
7. **Validate** (high): hypothesis cards / validation-status pipeline; inline add/edit.
8. **Build** (high): restyle tab bar + Overview; tidy Goals/Decisions/Issues/Values lists (density, dividers, hover).
9. **Dashboard** (medium): calmer hero, tighten stage card + "Next Action" yellow card (reduce visual noise), consistent KPI tiles, keep journey stepper.

## 6. Light code cleanup (only)
Remove dead exports; standardize `Card`/`Button`/`Badge` usage; move repeated class strings into component variants; eliminate hardcoded hex in favor of tokens; drop unused imports. No architectural rewrite, no strict-TS migration.

## 7. Concrete file changes
- `tailwind.config.js`: add `darkMode:'class'`, motion-easing tokens, focus ring util.
- `src/index.css`: neutralize `.app-bg`, make `.card`/`.glass` solid surfaces, add `.dark` overrides + CSS vars.
- `src/App.tsx`: `React.lazy` routes + Suspense skeleton; wrap transitions in `AnimatePresence`.
- `src/components/layout/{Sidebar,BottomNav,AppShell}.tsx`: nav redesign.
- `src/components/ui/*`: add `Skeleton`, `ErrorState`; refine `Card`/`Button` variants; keep API.
- `src/components/common/{Toast,ErrorBoundary}.tsx`: optional Framer Motion polish.
- Screens: `Auth, Settings, Notifications, Team, Progress, Discover, Validate, Build, Dashboard`.
- `src/lib/utils.ts`/`motion.ts`: add shared transition presets.
- `package.json`: add `framer-motion`.

## 8. Out of scope
Deep a11y audit (assessed fine), email password-reset, automated tests/CI, backend/migration changes, strict-TS refactor, i18n.

## 9. Execution phases
1. Tokens + CSS surface overhaul + dark-mode scaffolding (no behavior change, build green).
2. Navigation (sidebar/bottom nav/header) + route lazy-loading + transitions.
3. Shared states (`Skeleton`, `ErrorState`, empty states) + Framer Motion presets.
4. Screens in priority order (Auth → Settings → Notifications → Team → Progress → Discover → Validate → Build → Dashboard).
5. Light cleanup pass.
6. Verify (build, responsive sweep, dark-mode toggle, lazy chunk confirmed).

## 10. Verification
- `npm run build` passes (tsc + vite).
- `charts` chunk loads only on Build/Progress (Network tab).
- No console errors; toasts/modals animate; reduced-motion respected.
- Layout holds at 360/768/1024/1440; no horizontal scroll.
- Dark-mode toggle works and persists for the session.
- All existing flows (signup, team form, invite, accept, KPIs) still function.
