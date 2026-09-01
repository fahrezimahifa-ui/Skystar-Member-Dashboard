import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardHeader, ProgressBar, Badge, Avatar, Tabs, Button, Input } from '../components/ui';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Users, ShieldCheck, Heart, AlertTriangle, Mail } from 'lucide-react';
import { cn } from '../lib/utils';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Role } from '../data/types';

type Tab = 'roster' | 'capabilities' | 'health' | 'permissions';

export function Team() {
  const [tab, setTab] = useState<Tab>('roster');
  const { team, capabilities, business } = useStore();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink flex items-center gap-2"><Users size={22} className="text-teal" /> Team</h2>
        <p className="text-ink-muted mt-1">{team.name} · {team.members.length} members · <Badge tone="blue">{team.status}</Badge></p>
      </div>

      <InvitesInbox />

      <Tabs tabs={[{ key: 'roster', label: 'Roster' }, { key: 'capabilities', label: 'Capabilities' }, { key: 'health', label: 'Health' }, { key: 'permissions', label: 'Permissions' }]} active={tab} onChange={(t) => setTab(t as Tab)} />

      {tab === 'roster' && (
        <Card>
          <CardHeader title="Team Members" subtitle={team.description} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.members.map((m) => (
              <div key={m.userId} className="flex items-start gap-3 rounded-xl border border-line p-4">
                <Avatar name={m.name} size="xl" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="font-semibold text-ink">{m.name}</span>{m.mbti && <Badge tone="yellow">{m.mbti}</Badge>}</div>
                  <Badge tone="teal" className="mt-1">{m.role}</Badge>
                  <div className="text-xs text-ink-muted mt-2">{m.skills.join(' · ')}</div>
                  <div className="text-[11px] text-ink-muted mt-1">{m.responsibilities.join(', ')}</div>
                  <div className="flex gap-4 mt-2 text-[11px] text-ink-muted"><span>{m.availability}</span><span>{m.contact}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'capabilities' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Team Capability Matrix" />
            <div className="h-80"><ResponsiveContainer width="100%" height="100%">
              <RadarChart data={capabilities.map((c) => ({ area: c.area, score: c.score }))} outerRadius="75%">
                <PolarGrid stroke="#E6E9EF" /><PolarAngleAxis dataKey="area" tick={{ fontSize: 10, fill: '#8A94A6' }} />
                <Radar dataKey="score" stroke="#3B988F" fill="#3B988F" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer></div>
          </Card>
          <Card>
            <CardHeader title="Capability Coverage" />
            <div className="h-80"><ResponsiveContainer width="100%" height="100%">
              <BarChart data={capabilities.map((c) => ({ area: c.area, score: c.score }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EF" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#8A94A6' }} /><YAxis type="category" dataKey="area" tick={{ fontSize: 10, fill: '#8A94A6' }} width={80} />
                <Tooltip /><Bar dataKey="score" fill="#2682B5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer></div>
          </Card>
        </div>
      )}

      {tab === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-teal-50/50">
            <CardHeader icon={<Heart size={18} />} title="Team Health" />
            <div className="text-center"><div className="text-5xl font-bold text-teal">{business.health}<span className="text-2xl">/100</span></div><ProgressBar value={business.health} className="mt-3" /></div>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader title="Workload Distribution" />
            <div className="space-y-3">
              {team.members.map((m) => (
                <div key={m.userId} className="flex items-center gap-3">
                  <Avatar name={m.name} size="sm" /><span className="w-28 text-sm text-ink truncate">{m.name}</span>
                  <ProgressBar value={m.contribution} color={m.contribution >= 85 ? 'red' : m.contribution <= 40 ? 'yellow' : 'teal'} className="flex-1" />
                  <span className="w-10 text-right text-xs text-ink-muted">{m.contribution}%</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-yellow-50 border border-yellow-200 p-3 mt-4">
              <AlertTriangle size={16} className="text-yellow-600 mt-0.5" /><span className="text-sm text-ink-soft">Marketing tasks are currently assigned to only one member. Consider cross-training.</span>
            </div>
          </Card>
        </div>
      )}

      {tab === 'permissions' && <PermissionsTab />}
    </div>
  );
}

const ROLES: { role: Role; can: string[] }[] = [
  { role: 'Member', can: ['View team', 'Complete tasks', 'Edit assigned information', 'Contribute to planning'] },
  { role: 'Team Lead', can: ['Manage team members', 'Create milestones', 'Assign responsibilities', 'Approve major changes'] },
  { role: 'Admin', can: ['Manage users & teams', 'Review platform activity', 'Moderate content', 'Configure settings'] },
];

function InvitesInbox() {
  const received = useStore((s) => s.receivedInvites);
  const sent = useStore((s) => s.sentInvites);
  const acceptInvite = useStore((s) => s.acceptInvite);
  const rejectInvite = useStore((s) => s.rejectInvite);
  const withdrawInvite = useStore((s) => s.withdrawInvite);
  const inviteByUsername = useStore((s) => s.inviteByUsername);
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!isSupabaseConfigured) return null;

  const onInvite = async () => {
    setErr(null);
    if (!username.trim()) return;
    setBusy('invite');
    const res = await inviteByUsername(username);
    setBusy(null);
    if (res.error) setErr(res.error);
    else setUsername('');
  };

  const hasAny = received.length > 0 || sent.length > 0;

  return (
    <Card className="border-blue/40">
      <CardHeader icon={<Mail size={18} />} title="Team Invites" subtitle="Invite teammates by username or respond to invites" />
      <div className="space-y-3">
        {received.map((inv) => (
          <div key={inv.id} className="flex items-center gap-3 rounded-lg border border-line p-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink">Invitation to join a team</div>
              <div className="text-xs text-ink-muted">Role: {inv.preferred_role ?? 'Member'}</div>
            </div>
            <Button size="sm" variant="primary" disabled={busy === inv.id} onClick={async () => { setBusy(inv.id); await acceptInvite(inv.id, inv.team_id ?? ''); setBusy(null); }}>Accept</Button>
            <Button size="sm" variant="ghost" disabled={busy === inv.id} onClick={async () => { setBusy(inv.id); await rejectInvite(inv.id); setBusy(null); }}>Decline</Button>
          </div>
        ))}
        {sent.map((inv) => (
          <div key={inv.id} className="flex items-center gap-3 rounded-lg border border-line p-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink">Invite pending</div>
              <div className="text-xs text-ink-muted">Role: {inv.preferred_role ?? 'Member'}</div>
            </div>
            <Button size="sm" variant="ghost" disabled={busy === inv.id} onClick={async () => { setBusy(inv.id); await withdrawInvite(inv.id); setBusy(null); }}>Withdraw</Button>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Invite by username…"
            onKeyDown={(e) => { if (e.key === 'Enter') void onInvite(); }} />
          <Button size="sm" variant="primary" disabled={busy === 'invite'} onClick={onInvite}>{busy === 'invite' ? 'Sending…' : 'Invite'}</Button>
        </div>
        {err && <div className="text-xs text-red-500">{err}</div>}
        {!hasAny && !err && <div className="text-xs text-ink-muted">No pending invites. Invite a colleague by username to start collaborating.</div>}
      </div>
    </Card>
  );
}

function PermissionsTab() {
  const user = useStore((s) => s.user);
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader icon={<ShieldCheck size={18} />} title="Your Role" subtitle="Role-based access control" />
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="lg" />
          <div><div className="font-semibold text-ink">{user.name}</div><Badge tone="teal">{user.role}</Badge></div>
          <div className="ml-auto text-sm text-ink-muted">Status: {user.status}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ROLES.map((r) => (
          <Card key={r.role} className={cn(user.role === r.role && 'ring-2 ring-teal')}>
            <h4 className="font-semibold text-ink">{r.role}</h4>
            <ul className="mt-2 space-y-1.5">
              {r.can.map((c) => <li key={c} className="text-sm text-ink-soft flex items-start gap-2"><span className="text-teal mt-0.5">✓</span>{c}</li>)}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
