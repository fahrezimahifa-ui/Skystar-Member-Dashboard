import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, CartesianGrid,
} from 'recharts';
import { useStore } from '../store/useStore';
import { Card, CardHeader, ProgressBar, Badge, Button, Avatar, Tabs, Modal, Input, Textarea, Label, Select } from '../components/ui';
import { SmartRecommendations } from '../components/common/SmartRecommendations';
import { Building2, Lightbulb, Layers, FlaskConical, Target, Flag, ListTodo, Users, Activity as ActIcon, Gavel, AlertTriangle, Heart, BarChart3, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import type { TaskStatus, HypothesisStatus, IssueCategory, Priority } from '../data/types';

type Tab = 'overview' | 'idea' | 'model' | 'validation' | 'goals' | 'milestones' | 'tasks' | 'team' | 'health' | 'progress' | 'activity' | 'decisions' | 'issues' | 'values';

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'overview', label: 'Overview', icon: Building2 },
  { key: 'idea', label: 'Business Idea', icon: Lightbulb },
  { key: 'model', label: 'Model', icon: Layers },
  { key: 'validation', label: 'Validation', icon: FlaskConical },
  { key: 'goals', label: 'Goals', icon: Target },
  { key: 'milestones', label: 'Milestones', icon: Flag },
  { key: 'tasks', label: 'Tasks', icon: ListTodo },
  { key: 'team', label: 'Team', icon: Users },
  { key: 'health', label: 'Health', icon: Heart },
  { key: 'progress', label: 'Progress', icon: BarChart3 },
  { key: 'activity', label: 'Activity', icon: ActIcon },
  { key: 'decisions', label: 'Decisions', icon: Gavel },
  { key: 'issues', label: 'Issues', icon: AlertTriangle },
  { key: 'values', label: 'Values', icon: Heart },
];

export function Build() {
  const [tab, setTab] = useState<Tab>('overview');
  const active = TABS.find((t) => t.key === tab)!;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink flex items-center gap-2"><Building2 size={22} className="text-teal" /> Build</h2>
        <p className="text-ink-muted mt-1">Your team's business workspace — from idea to execution.</p>
      </div>

      <Tabs tabs={TABS.map((t) => ({ key: t.key, label: t.label }))} active={tab} onChange={(t) => setTab(t as Tab)} className="max-w-full" />

      <div className="flex items-center gap-2 text-teal mb-1">{active.icon && <active.icon size={16} />}<span className="text-sm font-semibold">{active.label}</span></div>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'idea' && <IdeaTab />}
      {tab === 'model' && <ModelTab />}
      {tab === 'validation' && <ValidationTab />}
      {tab === 'goals' && <GoalsTab />}
      {tab === 'milestones' && <MilestonesTab />}
      {tab === 'tasks' && <TasksTab />}
      {tab === 'team' && <TeamTab />}
      {tab === 'health' && <HealthTab />}
      {tab === 'progress' && <ProgressTab />}
      {tab === 'activity' && <ActivityTab />}
      {tab === 'decisions' && <DecisionsTab />}
      {tab === 'issues' && <IssuesTab />}
      {tab === 'values' && <ValuesTab />}
    </div>
  );
}

/* ---------- Overview ---------- */
function OverviewTab() {
  const navigate = useNavigate();
  const { business, team, milestones, tasks } = useStore();
  const completedM = milestones.filter((m) => m.status === 'Completed').length;
  const completedT = tasks.filter((t) => t.status === 'Completed').length;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-ink">{business.name}</h3>
              <p className="text-ink-muted mt-1">{business.valueProposition}</p>
            </div>
            <Badge tone="teal">{business.stage}</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
            <KV label="Team size" value={`${team.members.length}`} />
            <KV label="Progress" value={`${business.progress}%`} />
            <KV label="Health" value={`${business.health}/100`} />
            <KV label="Last updated" value={formatDate(business.lastUpdated)} />
            <KV label="Next milestone" value={business.nextMilestone} />
            <KV label="Milestones done" value={`${completedM}/${milestones.length}`} />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1"><span className="text-ink-muted">Overall progress</span><span className="font-semibold text-teal">{business.progress}%</span></div>
            <ProgressBar value={business.progress} height="h-2.5" />
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={() => navigate('/build')}>Open workspace <ArrowRight size={14} /></Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card><CardHeader title="Tasks" /><div className="flex items-baseline gap-2"><span className="text-3xl font-bold text-teal">{completedT}</span><span className="text-sm text-ink-muted">/ {tasks.length} completed</span></div></Card>
          <Card><CardHeader title="Team Health" /><div className="flex items-baseline gap-2"><span className="text-3xl font-bold text-teal">{business.health}</span><span className="text-sm text-ink-muted">/ 100</span></div></Card>
        </div>
      </div>
      <SmartRecommendations />
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs text-ink-muted">{label}</div><div className="font-semibold text-ink mt-0.5">{value}</div></div>;
}

/* ---------- Idea ---------- */
function IdeaTab() {
  const business = useStore((s) => s.business);
  const rows = [
    ['Problem', business.problem],
    ['Target Customer', business.targetCustomer],
    ['Solution', business.solution],
    ['Unique Value Proposition', business.uvp],
    ['Existing Alternatives', business.alternatives],
    ['Competitive Advantage', business.advantage],
  ];
  return (
    <Card>
      <CardHeader title="Business Idea" subtitle="The core of what you're building" />
      <div className="space-y-5">
        {rows.map(([k, v]) => (
          <div key={k}>
            <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">{k}</div>
            <p className="text-ink-soft mt-1">{v}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Model ---------- */
function ModelTab() {
  const m = useStore((s) => s.business.model);
  const fields = [
    ['Revenue model', m.revenueModel], ['Pricing', m.pricing], ['Customer acquisition', m.customerAcquisition],
    ['Key resources', m.keyResources], ['Key partners', m.keyPartners], ['Major costs', m.majorCosts],
    ['Distribution channels', m.distributionChannels], ['Revenue assumptions', m.revenueAssumptions],
  ];
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Business Model Canvas" subtitle="Structured view of how the business creates value" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-line p-3">
              <div className="text-xs font-semibold text-ink-soft">{k}</div>
              <p className="text-sm text-ink mt-1">{v}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- Validation ---------- */
function ValidationTab() {
  const { hypotheses, personas } = useStore();
  const statusColor: Record<HypothesisStatus, any> = { Unvalidated: 'gray', Testing: 'blue', Validated: 'green', Rejected: 'red' };
  const validated = hypotheses.filter((h) => h.status === 'Validated').length;
  const rejected = hypotheses.filter((h) => h.status === 'Rejected').length;
  const testing = hypotheses.filter((h) => h.status === 'Testing').length;
  const confirmed = personas.filter((p) => p.validated).length;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><div className="text-2xl font-bold text-teal">{validated}</div><div className="text-xs text-ink-muted">Validated</div></Card>
        <Card><div className="text-2xl font-bold text-blue">{testing}</div><div className="text-xs text-ink-muted">Testing</div></Card>
        <Card><div className="text-2xl font-bold text-red-500">{rejected}</div><div className="text-xs text-ink-muted">Rejected</div></Card>
        <Card><div className="text-2xl font-bold text-teal">{confirmed}</div><div className="text-xs text-ink-muted">Personas confirmed</div></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Hypotheses" subtitle="Unvalidated → Testing → Validated → Rejected" />
          <div className="space-y-3">
            {hypotheses.map((h) => (
              <div key={h.id} className="rounded-lg border border-line p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-ink font-medium">{h.statement}</p>
                  <Badge tone={statusColor[h.status]}>{h.status}</Badge>
                </div>
                <p className="text-xs text-ink-muted mt-1">{h.evidence || 'No evidence yet.'} {h.interviews > 0 && `· ${h.interviews} interviews`}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Customer Personas" />
          <div className="space-y-3">
            {personas.map((p) => (
              <div key={p.id} className="flex items-start gap-3 rounded-lg border border-line p-3">
                <div className={cn('mt-0.5', p.validated ? 'text-teal' : 'text-ink-muted')}>{p.validated ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}</div>
                <div><div className="text-sm font-medium text-ink">{p.name}</div><p className="text-xs text-ink-muted">{p.description}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Goals ---------- */
function GoalsTab() {
  const goals = useStore((s) => s.goals);
  const addGoal = useStore((s) => s.addGoal);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [type, setType] = useState<'Long-Term' | 'Quarterly' | 'Weekly'>('Weekly');
  const groups: any = { 'Long-Term': [], 'Quarterly': [], 'Weekly': [] };
  goals.forEach((g) => groups[g.type].push(g));
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button size="sm" onClick={() => setOpen(true)}><Plus size={14} /> Add goal</Button></div>
      {(['Long-Term', 'Quarterly', 'Weekly'] as const).map((g) => (
        <Card key={g}>
          <CardHeader title={g} subtitle={`${groups[g].length} goals`} />
          <div className="space-y-2">
            {groups[g].map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-line p-3">
                <div className={cn('w-2 h-2 rounded-full', item.done ? 'bg-teal' : 'bg-yellow')} />
                <div className="flex-1"><div className="text-sm text-ink">{item.text}</div><div className="text-xs text-ink-muted">{item.owner} · due {formatDate(item.deadline)}</div></div>
                {item.done ? <Badge tone="green">Done</Badge> : <Badge tone="gray">Open</Badge>}
              </div>
            ))}
            {groups[g].length === 0 && <p className="text-sm text-ink-muted">No {g.toLowerCase()} goals yet.</p>}
          </div>
        </Card>
      ))}
      <Modal open={open} onClose={() => setOpen(false)} title="Add goal"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { addGoal({ text, type }); setOpen(false); setText(''); }}>Add</Button></>}>
        <div className="space-y-3">
          <div><Label>Type</Label><Select value={type} onChange={(v) => setType(v as 'Long-Term' | 'Quarterly' | 'Weekly')} options={['Long-Term', 'Quarterly', 'Weekly'].map((t) => ({ value: t, label: t }))} /></div>
          <div><Label>Goal</Label><Input value={text} onChange={(e) => setText(e.target.value)} placeholder="What do you want to achieve?" /></div>
        </div>
      </Modal>
    </div>
  );
}

/* ---------- Milestones ---------- */
function MilestonesTab() {
  const milestones = useStore((s) => s.milestones);
  const tone: any = { Completed: 'green', 'In Progress': 'blue', 'At Risk': 'red', 'Not Started': 'gray' };
  return (
    <Card>
      <CardHeader title="Milestone Timeline" subtitle="From team formation to growth" />
      <div className="space-y-0">
        {milestones.map((m, i) => (
          <div key={m.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', m.status === 'Completed' ? 'bg-teal text-white' : 'bg-white/50 border border-white/60 text-ink-muted')}>{m.order}</div>
              {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-line my-1" />}
            </div>
            <div className="pb-5 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-semibold text-ink">{m.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge tone={tone[m.status]}>{m.status}</Badge>
                  <span className="text-xs text-ink-muted">{m.owner} · {formatDate(m.deadline)}</span>
                </div>
              </div>
              <p className="text-sm text-ink-muted mt-1">{m.notes || 'No notes.'}</p>
              <div className="flex items-center gap-2 mt-2">
                <ProgressBar value={m.completion} color={m.status === 'Completed' ? 'green' : m.status === 'At Risk' ? 'red' : 'teal'} className="flex-1 max-w-xs" />
                <span className="text-xs text-ink-muted">{m.completion}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Tasks (Kanban) ---------- */
const KANBAN: { status: TaskStatus; label: string }[] = [
  { status: 'To Do', label: 'To Do' },
  { status: 'In Progress', label: 'In Progress' },
  { status: 'Review', label: 'Review' },
  { status: 'Completed', label: 'Completed' },
];
const prioTone: Record<Priority, any> = { Low: 'gray', Medium: 'blue', High: 'yellow', Critical: 'red' };

function TasksTab() {
  const tasks = useStore((s) => s.tasks);
  const setStatus = useStore((s) => s.setTaskStatus);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {KANBAN.map((col) => (
        <div key={col.status} className="bg-white/40 rounded-xl border border-white/50 p-3">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-semibold text-sm text-ink">{col.label}</span>
            <Badge tone="gray">{tasks.filter((t) => t.status === col.status).length}</Badge>
          </div>
          <div className="space-y-2">
            {tasks.filter((t) => t.status === col.status).map((t) => (
              <div key={t.id} className="bg-white/55 rounded-lg border border-white/50 p-3">
                <div className="text-sm font-medium text-ink">{t.title}</div>
                <p className="text-xs text-ink-muted mt-1 line-clamp-2">{t.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-ink-muted">{t.owner}</span>
                  <Badge tone={prioTone[t.priority]}>{t.priority}</Badge>
                </div>
                <Select value={t.status} onChange={(v) => setStatus(t.id, v as TaskStatus)} className="mt-2 !py-1 text-xs" options={KANBAN.map((k) => ({ value: k.status, label: k.label }))} />
              </div>
            ))}
            {tasks.filter((t) => t.status === col.status).length === 0 && <p className="text-xs text-ink-muted text-center py-4">No tasks</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Team ---------- */
function TeamTab() {
  const { team, capabilities } = useStore();
  const data = capabilities.map((c) => ({ area: c.area, score: c.score }));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader title="Team Members" />
        <div className="space-y-3">
          {team.members.map((m) => (
            <div key={m.userId} className="flex items-center gap-3 rounded-lg border border-line p-3">
              <Avatar name={m.name} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className="font-medium text-ink">{m.name}</span><Badge tone="teal">{m.role}</Badge>{m.mbti && <Badge tone="yellow">{m.mbti}</Badge>}</div>
                <div className="text-xs text-ink-muted mt-0.5">{m.skills.join(' · ')}</div>
                <div className="text-[11px] text-ink-muted mt-0.5">{m.responsibilities.join(', ')} · {m.availability}</div>
              </div>
              <div className="text-right"><div className="text-sm font-semibold text-teal">{m.currentTasks}</div><div className="text-[11px] text-ink-muted">tasks</div></div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader title="Capability Matrix" />
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="75%">
              <PolarGrid stroke="#E6E9EF" />
              <PolarAngleAxis dataKey="area" tick={{ fontSize: 10, fill: '#8A94A6' }} />
              <Radar dataKey="score" stroke="#3B988F" fill="#3B988F" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Health ---------- */
function HealthTab() {
  const { team, business, capabilities } = useStore();
  const overloaded = team.members.filter((m) => m.contribution >= 85);
  const gaps = capabilities.filter((c) => c.score < 45);
  const warnings = [];
  if (overloaded.length) warnings.push(`${overloaded.map((m) => m.name.split(' ')[0]).join(', ')} ${overloaded.length > 1 ? 'are' : 'is'} carrying a heavy load (≥85%).`);
  if (gaps.length) warnings.push(`Weak capability areas: ${gaps.map((g) => g.area).join(', ')}.`);
  warnings.push('Two milestones are approaching their deadlines.');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 bg-teal-50/50">
        <CardHeader icon={<Heart size={18} />} title="Team Health" />
        <div className="text-center">
          <div className="text-5xl font-bold text-teal">{business.health}<span className="text-2xl">/100</span></div>
          <ProgressBar value={business.health} className="mt-3" />
        </div>
        <div className="mt-4 space-y-2 text-sm text-ink-soft">
          <div className="flex justify-between"><span>Task completion</span><span className="font-medium">Good</span></div>
          <div className="flex justify-between"><span>Participation</span><span className="font-medium">Good</span></div>
          <div className="flex justify-between"><span>Communication</span><span className="font-medium">Good</span></div>
          <div className="flex justify-between"><span>Workload balance</span><span className="font-medium text-yellow-600">Watch</span></div>
        </div>
      </Card>
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader title="Warnings" />
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-yellow-50 border border-yellow-200 p-3 mb-2">
              <AlertTriangle size={16} className="text-yellow-600 mt-0.5" /><span className="text-sm text-ink-soft">{w}</span>
            </div>
          ))}
        </Card>
        <Card>
          <CardHeader title="Workload Distribution" />
          <div className="space-y-3">
            {team.members.map((m) => (
              <div key={m.userId} className="flex items-center gap-3">
                <Avatar name={m.name} size="sm" />
                <span className="w-28 text-sm text-ink truncate">{m.name}</span>
                <ProgressBar value={m.contribution} color={m.contribution >= 85 ? 'red' : m.contribution <= 40 ? 'yellow' : 'teal'} className="flex-1" />
                <span className="w-10 text-right text-xs text-ink-muted">{m.contribution}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Progress ---------- */
function ProgressTab() {
  const { kpis, capabilities, tasks, hypotheses } = useStore();
  const capData = capabilities.map((c) => ({ area: c.area, score: c.score }));
  const byStatus = (s: string) => tasks.filter((t) => t.status === s).length;
  const statusData = [
    { name: 'To Do', value: byStatus('To Do') },
    { name: 'In Progress', value: byStatus('In Progress') },
    { name: 'Review', value: byStatus('Review') },
    { name: 'Completed', value: byStatus('Completed') },
  ];
  const count = (s: string) => hypotheses.filter((h) => h.status === s).length;
  const validationData = [
    { name: 'Validated', value: count('Validated') },
    { name: 'Testing', value: count('Testing') },
    { name: 'Unvalidated', value: count('Unvalidated') },
    { name: 'Rejected', value: count('Rejected') },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className="text-2xl font-bold text-teal">{k.value}{k.unit}</div>
            <div className="text-xs text-ink-muted mt-0.5">{k.label}</div>
            {k.target !== undefined && <div className="text-[11px] text-ink-muted mt-1">Target {k.target}</div>}
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Task Status Breakdown" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EF" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8A94A6' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8A94A6' }} />
                <Tooltip />
                <Bar dataKey="value" name="Tasks" fill="#3B988F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Validation Status" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={validationData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {validationData.map((_, i) => <Cell key={i} fill={['#3B988F', '#2682B5', '#F4DB73', '#EF4444'][i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Capability Coverage" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EF" />
                <XAxis dataKey="area" tick={{ fontSize: 10, fill: '#8A94A6' }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: '#8A94A6' }} />
                <Tooltip />
                <Bar dataKey="score" fill="#2682B5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Activity ---------- */
function ActivityTab() {
  const activities = useStore((s) => s.activities);
  const icon: any = { task: ListTodo, milestone: Flag, business: Building2, team: Users, validation: FlaskConical };
  return (
    <Card>
      <CardHeader title="Activity Feed" subtitle="What happened while you were away" />
      <div className="space-y-1">
        {activities.map((a) => {
          const I = icon[a.type] || ActIcon;
          return (
            <div key={a.id} className="flex items-start gap-3 py-2.5 border-b border-line last:border-0">
              <div className="w-8 h-8 rounded-full bg-teal-50 text-teal flex items-center justify-center shrink-0"><I size={15} /></div>
              <div className="flex-1"><p className="text-sm text-ink">{a.text}</p></div>
              <span className="text-xs text-ink-muted whitespace-nowrap">{formatDate(a.date)}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ---------- Decisions ---------- */
function DecisionsTab() {
  const decisions = useStore((s) => s.decisions);
  const addDecision = useStore((s) => s.addDecision);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ decision: '', reason: '', alternatives: '', result: '' });
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button size="sm" onClick={() => setOpen(true)}><Plus size={14} /> Log decision</Button></div>
      <Card>
        <CardHeader title="Decision Log" subtitle="Institutional memory for the team" />
        <div className="space-y-3">
          {decisions.map((d) => (
            <div key={d.id} className="rounded-lg border border-line p-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-ink">{d.decision}</h4>
                <span className="text-xs text-ink-muted whitespace-nowrap">{formatDate(d.date)}</span>
              </div>
              <div className="text-sm text-ink-soft mt-1"><b className="text-ink-muted">Reason:</b> {d.reason}</div>
              <div className="text-sm text-ink-soft mt-1"><b className="text-ink-muted">Alternatives:</b> {d.alternatives}</div>
              <div className="text-sm text-ink-soft mt-1"><b className="text-ink-muted">Result:</b> {d.result} · <span className="text-teal">by {d.responsible}</span></div>
            </div>
          ))}
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Log a decision"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { addDecision(d); setOpen(false); setD({ decision: '', reason: '', alternatives: '', result: '' }); }}>Save</Button></>}>
        <div className="space-y-3">
          <div><Label>Decision</Label><Input value={d.decision} onChange={(e) => setD({ ...d, decision: e.target.value })} /></div>
          <div><Label>Reason</Label><Textarea value={d.reason} onChange={(e) => setD({ ...d, reason: e.target.value })} /></div>
          <div><Label>Alternatives considered</Label><Input value={d.alternatives} onChange={(e) => setD({ ...d, alternatives: e.target.value })} /></div>
          <div><Label>Result</Label><Input value={d.result} onChange={(e) => setD({ ...d, result: e.target.value })} /></div>
        </div>
      </Modal>
    </div>
  );
}

/* ---------- Issues ---------- */
function IssuesTab() {
  const issues = useStore((s) => s.issues);
  const addIssue = useStore((s) => s.addIssue);
  const [open, setOpen] = useState(false);
  const [i, setI] = useState({ category: 'Product' as IssueCategory, description: '', severity: 'Medium' as any, proposedSolution: '' });
  const sevTone: any = { Low: 'gray', Medium: 'blue', High: 'yellow', Critical: 'red' };
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button size="sm" onClick={() => setOpen(true)}><Plus size={14} /> Report issue</Button></div>
      <Card>
        <CardHeader title="Problem Tracker" subtitle="Product, team, financial, customer, technical, operational" />
        <div className="space-y-2">
          {issues.map((iss) => (
            <div key={iss.id} className="flex items-start gap-3 rounded-lg border border-line p-3">
              <AlertTriangle size={16} className={cn('mt-0.5', iss.severity === 'Critical' || iss.severity === 'High' ? 'text-red-500' : 'text-yellow-600')} />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge tone="gray">{iss.category}</Badge><Badge tone={sevTone[iss.severity]}>{iss.severity}</Badge>
                  <Badge tone={iss.status === 'Resolved' ? 'green' : 'yellow'}>{iss.status}</Badge>
                </div>
                <p className="text-sm text-ink mt-1">{iss.description}</p>
                <p className="text-xs text-ink-muted mt-0.5">Owner: {iss.owner} · due {formatDate(iss.deadline)}{iss.proposedSolution && ` · Fix: ${iss.proposedSolution}`}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Report an issue"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { addIssue(i); setOpen(false); setI({ category: 'Product', description: '', severity: 'Medium', proposedSolution: '' }); }}>Report</Button></>}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Category</Label><Select value={i.category} onChange={(v) => setI({ ...i, category: v as IssueCategory })} options={['Product', 'Team', 'Financial', 'Customer', 'Technical', 'Operational'].map((c) => ({ value: c, label: c }))} /></div>
            <div><Label>Severity</Label><Select value={i.severity} onChange={(v) => setI({ ...i, severity: v as any })} options={['Low', 'Medium', 'High', 'Critical'].map((c) => ({ value: c, label: c }))} /></div>
          </div>
          <div><Label>Description</Label><Textarea value={i.description} onChange={(e) => setI({ ...i, description: e.target.value })} /></div>
          <div><Label>Proposed solution</Label><Input value={i.proposedSolution} onChange={(e) => setI({ ...i, proposedSolution: e.target.value })} /></div>
        </div>
      </Modal>
    </div>
  );
}

/* ---------- Values ---------- */
function ValuesTab() {
  const values = useStore((s) => s.teamValues);
  const members = useStore((s) => s.team.members);
  return (
    <div className="space-y-4">
      {values.map((v) => (
        <Card key={v.id}>
          <CardHeader title={v.name} subtitle={v.description} />
          <div className="space-y-2">
            {members.map((m) => {
              const align = v.alignment[m.userId] ?? 70;
              return (
                <div key={m.userId} className="flex items-center gap-3">
                  <Avatar name={m.name} size="sm" />
                  <span className="w-28 text-sm text-ink truncate">{m.name}</span>
                  <ProgressBar value={align} color={align >= 85 ? 'teal' : align >= 70 ? 'yellow' : 'red'} className="flex-1" />
                  <span className="w-10 text-right text-xs text-ink-muted">{align}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
