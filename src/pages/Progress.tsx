import { useStore } from '../store/useStore';
import { Card, CardHeader } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

const PIE_COLORS = ['#3B988F', '#2682B5', '#F4DB73', '#EF4444'];

export function Progress() {
  const { kpis, milestones, tasks, hypotheses, business } = useStore();
  const completionRate = tasks.length
    ? Math.round((tasks.filter((t) => t.status === 'Completed').length / tasks.length) * 100)
    : 0;

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink flex items-center gap-2"><BarChart3 size={22} className="text-teal" /> Progress and Analytics</h2>
        <p className="text-ink-muted mt-1">Track how the team is performing, computed from your live data.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.slice(0, 4).map((k) => (
          <Card key={k.label}><div className="text-2xl font-bold text-teal">{k.value}{k.unit}</div><div className="text-xs text-ink-muted mt-0.5">{k.label}</div></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader icon={<TrendingUp size={18} />} title="Task Status Breakdown" />
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
                  {validationData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><div className="text-2xl font-bold text-teal">{completionRate}%</div><div className="text-xs text-ink-muted">Task completion rate</div></Card>
        <Card><div className="text-2xl font-bold text-teal">{milestones.filter((m) => m.status === 'Completed').length}/{milestones.length}</div><div className="text-xs text-ink-muted">Milestones done</div></Card>
        <Card><div className="text-2xl font-bold text-teal">{business.health}/100</div><div className="text-xs text-ink-muted">Team engagement</div></Card>
      </div>
    </div>
  );
}
