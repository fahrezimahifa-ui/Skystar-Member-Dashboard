import { useStore } from '../../store/useStore';
import { Card, ProgressBar, Badge, Button } from '../ui';
import { CheckCircle2, Circle, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Onboarding() {
  const navigate = useNavigate();
  const { user, recommendations, team, stage } = useStore();
  const prof = user.profile;

  const steps = [
    { label: 'Create profile', done: user.profileCompletion > 0 },
    { label: 'Complete Discover', done: user.assessmentCompletion > 0 },
    { label: 'Complete personality assessment', done: !!prof.mbti },
    { label: 'Add skills', done: prof.skills.length > 0 },
    { label: 'Add interests', done: prof.interests.length > 0 },
    { label: 'Set availability', done: prof.availability.hoursPerWeek > 0 },
    { label: 'Define entrepreneurial goals', done: !!prof.entrepreneurial.desiredRole },
    { label: 'Receive recommended teammates', done: recommendations.length > 0 },
    { label: 'Form a team', done: team.members.length > 1 || stage !== 'No Team' },
    { label: 'Start validating the business', done: stage === 'Validating' || stage === 'Building' },
    { label: 'Enter Build workspace', done: stage === 'Building' || stage === 'Launch' },
  ];
  const done = steps.filter((s) => s.done).length;
  const pct = Math.round((done / steps.length) * 100);

  return (
    <Card className="border-teal-100 bg-teal-50/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-teal" />
          <h3 className="font-semibold text-ink">Getting Started</h3>
          <Badge tone="teal">{done}/{steps.length}</Badge>
        </div>
        <span className="text-sm font-semibold text-teal">{pct}%</span>
      </div>
      <ProgressBar value={pct} className="mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {steps.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            {s.done ? <CheckCircle2 size={16} className="text-teal shrink-0" /> : <Circle size={16} className="text-ink-muted shrink-0" />}
            <span className={s.done ? 'text-ink-soft line-through' : 'text-ink'}>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Button size="sm" onClick={() => navigate('/discover')}>Continue setup</Button>
      </div>
    </Card>
  );
}
