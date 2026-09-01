import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { NotificationBell } from '../common/NotificationBell';
import { SearchModal } from '../common/SearchModal';
import { NAV_ITEMS } from './nav';
import { Avatar } from '../ui';
import { useStore } from '../../store/useStore';
import { isSupabaseConfigured } from '../../lib/supabase';

export function AppShell() {
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const location = useLocation();
  const user = useStore((s) => s.user);
  const demo = import.meta.env.VITE_DEMO === '1' || !isSupabaseConfigured;

  const current = NAV_ITEMS.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)));
  const title = current?.label ?? 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* mobile drawer */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 bottom-0 animate-fade-in">
            <Sidebar onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="relative z-40 h-16 shrink-0 glass border-b border-white/50 flex items-center gap-3 px-4 sm:px-6">
          <button onClick={() => setDrawer(true)} className="lg:hidden w-9 h-9 rounded-lg border border-line flex items-center justify-center text-ink-soft">
            <Menu size={18} />
          </button>
          <h1 className="text-lg font-semibold text-ink truncate">{title}</h1>
          {demo && <span className="hidden sm:inline-flex items-center rounded-full bg-yellow/80 text-ink-800 text-[11px] font-semibold px-2.5 py-1 border border-white/40">Demo</span>}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button onClick={() => setSearch(true)} className="hidden sm:flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-ink-muted hover:border-teal hover:text-teal transition-colors">
              <Search size={16} /> <span className="hidden md:inline">Search…</span>
            </button>
            <button onClick={() => setSearch(true)} className="sm:hidden w-9 h-9 rounded-lg border border-line flex items-center justify-center text-ink-soft">
              <Search size={18} />
            </button>
            <NotificationBell />
            <Avatar name={user.name} size="md" className="hidden sm:flex" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin pb-24 lg:pb-0">
          <div className="app-bg min-h-full">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>

        <BottomNav />
      </div>

      <SearchModal open={search} onClose={() => setSearch(false)} />
    </div>
  );
}
