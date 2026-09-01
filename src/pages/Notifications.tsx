import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, Badge, Button, EmptyState } from '../components/ui';
import { Bell, Check } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import type { NotificationCategory } from '../data/types';

const ICON: Record<NotificationCategory, string> = {
  invitation: '👋', recommendation: '✨', task: '✅', deadline: '⏰', milestone: '🏁',
  mention: '@', update: '📣', validation: '🔬', overdue: '🚨',
};

export function Notifications() {
  const notifications = useStore((s) => s.notifications);
  const markAllRead = useStore((s) => s.markAllRead);
  const markRead = useStore((s) => s.markNotifRead);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const list = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-ink flex items-center gap-2"><Bell size={22} className="text-teal" /> Notifications</h2>
          <p className="text-ink-muted mt-1">{unread} unread · prioritized by importance</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-line p-0.5">
            <button onClick={() => setFilter('all')} className={cn('px-3 py-1.5 text-sm rounded-md', filter === 'all' ? 'bg-teal text-white' : 'text-ink-soft')}>All</button>
            <button onClick={() => setFilter('unread')} className={cn('px-3 py-1.5 text-sm rounded-md', filter === 'unread' ? 'bg-teal text-white' : 'text-ink-soft')}>Unread</button>
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead}><Check size={14} /> Mark all read</Button>
        </div>
      </div>

      <Card className="p-0">
        {list.length === 0 ? (
          <EmptyState icon={<Bell size={22} />} title="You're all caught up" description="No unread notifications right now." />
        ) : (
          <div className="divide-y divide-line">
            {list.map((n) => (
              <button key={n.id} onClick={() => markRead(n.id)} className={cn('w-full text-left px-5 py-4 flex gap-3 hover:bg-white/50', !n.read && 'bg-teal-50/40')}>
                <div className="text-xl leading-none mt-0.5">{ICON[n.category]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink truncate">{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-teal shrink-0" />}
                  </div>
                  <p className="text-sm text-ink-muted mt-0.5">{n.body}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge tone={n.priority === 'high' ? 'red' : n.priority === 'medium' ? 'yellow' : 'gray'}>{n.priority}</Badge>
                    <span className="text-[11px] text-ink-muted">{formatDate(n.date)}</span>
                    <Badge tone="gray">{n.category}</Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
