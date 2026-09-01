import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './nav';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export function BottomNav() {
  const unread = useStore((s) => s.notifications.filter((n) => !n.read).length);
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-white/50 grid grid-cols-4 sm:grid-cols-8">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium',
              isActive ? 'text-teal' : 'text-ink-muted',
            )
          }
        >
          <div className="relative">
            <item.icon size={20} />
            {item.label === 'Notifications' && unread > 0 && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-yellow" />
            )}
          </div>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
