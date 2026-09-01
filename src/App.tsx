import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/auth';
import { useStore } from './store/useStore';
import * as api from './data/api';
import { isSupabaseConfigured } from './lib/supabase';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/Toast';
import { Button } from './components/ui';
import { Dashboard } from './pages/Dashboard';
import { Discover } from './pages/Discover';
import { Validate } from './pages/Validate';
import { Build } from './pages/Build';
import { Team } from './pages/Team';
import { Progress } from './pages/Progress';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Auth } from './pages/Auth';

function Splash() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center text-white font-bold animate-pulse">T</div>
        <span className="text-ink-muted font-medium">Loading your workspace…</span>
      </div>
    </div>
  );
}

function ConfigNotice() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="glass-strong max-w-lg rounded-3xl p-8">
        <h1 className="text-lg font-bold text-ink mb-2">Supabase not configured</h1>
        <p className="text-sm text-ink-soft mb-3">
          Copy <code className="bg-black/5 px-1 rounded">.env.example</code> to <code className="bg-black/5 px-1 rounded">.env</code> and add your Supabase project URL and anon key, then run the SQL migrations in <code className="bg-black/5 px-1 rounded">supabase/migrations/</code>.
        </p>
        <p className="text-xs text-ink-muted">After updating <code className="bg-black/5 px-1 rounded">.env</code>, restart the dev server.</p>
      </div>
    </div>
  );
}

function HydrateError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="glass-strong max-w-md rounded-3xl p-8 text-center">
        <h1 className="text-lg font-bold text-ink mb-2">Couldn't load your workspace</h1>
        <p className="text-sm text-ink-soft mb-4">Something went wrong while loading your data. Please try again.</p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { loading, userId, configured } = useAuth();
  const hydrate = useStore((s) => s.hydrate);
  const loadDemo = useStore((s) => s.loadDemo);
  const loadInvites = useStore((s) => s.loadInvites);
  const hydrated = useStore((s) => s.hydrated);
  const teamId = useStore((s) => s.team.id);
  const refreshTeam = useStore((s) => s.refreshTeam);
  const [hydrateError, setHydrateError] = useState(false);

  const DEMO = import.meta.env.VITE_DEMO === '1' || !isSupabaseConfigured;

  useEffect(() => {
    if (DEMO) { loadDemo(); return; }
    if (!userId) return;
    setHydrateError(false);
    hydrate(userId).catch((e) => { console.error('hydrate failed', e); setHydrateError(true); });
  }, [DEMO, userId, loadDemo, hydrate]);

  useEffect(() => {
    if (DEMO || !configured || !teamId) return;
    const unsub = api.subscribeToTeam(
      teamId,
      ['tasks', 'milestones', 'hypotheses', 'goals', 'decisions', 'issues', 'activities', 'notifications', 'team_values', 'capabilities', 'businesses', 'invites', 'team_members', 'profiles'],
      (table) => {
        void refreshTeam();
        if (table === 'invites') void loadInvites();
      },
    );
    return () => { void unsub(); };
  }, [DEMO, configured, teamId, refreshTeam, loadInvites]);

  if (loading && !DEMO) return <Splash />;
  if (DEMO) {
    if (!hydrated) return <Splash />;
    return (
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/validate" element={<Validate />} />
          <Route path="/build" element={<Build />} />
          <Route path="/team" element={<Team />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    );
  }
  if (!configured) return <ConfigNotice />;
  if (!userId) return <Routes><Route path="/auth" element={<Auth />} /><Route path="*" element={<Navigate to="/auth" replace />} /></Routes>;
  if (hydrateError) return <HydrateError onRetry={() => { setHydrateError(false); void hydrate(userId); }} />;
  if (!hydrated) return <Splash />;

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/validate" element={<Validate />} />
        <Route path="/build" element={<Build />} />
        <Route path="/team" element={<Team />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
        <ToastProvider />
      </AuthProvider>
    </BrowserRouter>
  );
}
