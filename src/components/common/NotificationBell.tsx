import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Badge, Button } from '../ui';
import { cn, formatDate } from '../../lib/utils';
import type { NotificationCategory } from '../../data/types';

const ICON: Record<NotificationCategory, string> = {
  invitation: '👋', recommendation: '✨', task: '✅', deadline: '⏰', milestone: '🏁',
  mention: '@', update: '📣', validation: '🔬', overdue: '🚨',
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const notifications = useStore((s) => s.notifications);
  const markAllRead = useStore((s) => s.markAllRead);
  const markRead = useStore((s) => s.markNotifRead);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-lg border border-line flex items-center justify-center text-ink-soft hover:text-teal hover:border-teal transition-colors"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-yellow text-[10px] font-bold text-ink-800 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-strong rounded-xl border border-white/60 z-50 animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <div className="font-semibold text-ink">Notifications</div>
              <button onClick={markAllRead} className="text-xs text-teal hover:underline flex items-center gap-1">
                <Check size={13} /> Mark all read
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { markRead(n.id); setOpen(false); navigate('/notifications'); }}
                  className={cn('w-full text-left px-4 py-3 border-b border-line last:border-0 flex gap-3', !n.read && 'bg-teal-50/40')}
                >
                  <div className="text-lg leading-none mt-0.5">{ICON[n.category]}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink truncate">{n.title}</span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />}
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">{n.body}</p>
                    <div className="mt-1"><Badge tone={n.priority === 'high' ? 'red' : n.priority === 'medium' ? 'yellow' : 'gray'}>{n.priority}</Badge> <span className="text-[11px] text-ink-muted ml-1">{formatDate(n.date)}</span></div>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-line">
              <Button variant="outline" size="sm" className="w-full" onClick={() => { setOpen(false); navigate('/notifications'); }}>View all</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
