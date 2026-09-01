import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './nav';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../store/auth';
import { Avatar } from '../ui';
import { cn } from '../../lib/utils';

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const user = useStore((s) => s.user);
  const { signOut } = useAuth();
  return (
    <aside className="w-64 shrink-0 glass border-r border-white/50 flex flex-col h-full">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-line">
        <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center text-white font-bold">T</div>
        <div>
          <div className="font-bold text-ink leading-tight">Teamrise</div>
          <div className="text-[11px] text-ink-muted leading-tight">Entrepreneurship OS</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-teal-50 text-teal-700' : 'text-ink-soft hover:bg-white/50 hover:text-ink',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={cn(isActive ? 'text-teal' : 'text-ink-muted')} />
                {item.label}
                {item.label === 'Notifications' && <NotifDot />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-line">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/50 cursor-pointer">
          <Avatar name={user.name} size="md" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-ink truncate">{user.name}</div>
            <div className="text-[11px] text-ink-muted truncate">{user.role} · {user.status}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-2 px-1">
          <button onClick={() => { void signOut(); }} className="flex-1 text-xs text-ink-soft hover:text-red-500 py-1.5 rounded-md hover:bg-white/50">Logout</button>
        </div>
      </div>
    </aside>
  );
}

function NotifDot() {
  const unread = useStore((s) => s.notifications.filter((n) => !n.read).length);
  if (!unread) return null;
  return <span className="ml-auto w-2 h-2 rounded-full bg-yellow" />;
}
