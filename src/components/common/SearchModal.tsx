import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Modal } from '../ui';
import { cn } from '../../lib/utils';
import type { SearchResult } from '../../data/types';

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { users, team, tasks, milestones, issues, business, recommendations } = useStore();

  const results = useMemo<SearchResult[]>(() => {
    const term = q.trim().toLowerCase();
    const list: SearchResult[] = [
      ...users.map((u) => ({ id: u.id, type: 'Member' as const, title: u.name, subtitle: `${u.role} · ${u.profile.mbti ?? 'No MBTI'}`, to: '/discover' })),
      ...team.members.map((m) => ({ id: m.userId, type: 'Member' as const, title: m.name, subtitle: `${m.role} · ${team.name}`, to: '/team' })),
      ...recommendations.map((r) => ({ id: r.id, type: 'Member' as const, title: r.name, subtitle: `Match ${r.match}% · ${r.preferredRole}`, to: '/validate' })),
      { id: 'biz', type: 'Business Idea' as const, title: business.name, subtitle: business.valueProposition, to: '/build' },
      ...tasks.map((t) => ({ id: t.id, type: 'Task' as const, title: t.title, subtitle: `${t.status} · ${t.owner}`, to: '/build' })),
      ...milestones.map((m) => ({ id: m.id, type: 'Milestone' as const, title: m.name, subtitle: `${m.status} · ${m.completion}%`, to: '/build' })),
      ...issues.map((i) => ({ id: i.id, type: 'Issue' as const, title: i.description, subtitle: `${i.category} · ${i.severity}`, to: '/build' })),
      { id: 'doc-bmc', type: 'Document' as const, title: 'Business Model Canvas', subtitle: 'Team document', to: '/build' },
      { id: 'doc-dec', type: 'Document' as const, title: 'Decision Log', subtitle: 'Team document', to: '/build' },
    ];
    if (!term) return list.slice(0, 8);
    return list.filter((r) => (r.title + ' ' + r.subtitle + ' ' + r.type).toLowerCase().includes(term));
  }, [q, users, team, tasks, milestones, issues, business, recommendations]);

  const go = (to: string) => { onClose(); setQ(''); navigate(to); };

  return (
    <Modal open={open} onClose={onClose} size="lg" title={<span className="flex items-center gap-2"><SearchIcon size={16} /> Search</span>}>
      <div className="relative mb-3">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search members, teams, tasks, ideas, documents…"
          className="w-full rounded-lg border border-line pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
        />
      </div>
      <div className="space-y-1 max-h-[50vh] overflow-y-auto scrollbar-thin">
        {results.length === 0 && <div className="text-center text-sm text-ink-muted py-8">No results for “{q}”.</div>}
        {results.map((r) => (
          <button key={r.id + r.type} onClick={() => go(r.to)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/50 text-left">
            <span className={cn('text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded', typeColor(r.type))}>{r.type}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-ink truncate">{r.title}</div>
              <div className="text-xs text-ink-muted truncate">{r.subtitle}</div>
            </div>
            <X size={14} className="text-ink-muted opacity-0 group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </Modal>
  );
}

function typeColor(t: SearchResult['type']): string {
  switch (t) {
    case 'Member': return 'bg-teal-50 text-teal-700';
    case 'Task': return 'bg-blue-50 text-blue-700';
    case 'Milestone': return 'bg-yellow-50 text-yellow-700';
    case 'Issue': return 'bg-red-50 text-red-600';
    case 'Business Idea': return 'bg-teal-50 text-teal-700';
    default: return 'bg-white/50 text-ink-muted';
  }
}
