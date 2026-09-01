import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardHeader, ProgressBar, Badge, Button } from '../components/ui';
import { JourneyStepper } from '../components/common/JourneyStepper';
import { SmartRecommendations } from '../components/common/SmartRecommendations';
import { Onboarding } from '../components/common/Onboarding';
import { stageConfig, journeyProgress } from '../lib/stage';
import { Users, Briefcase, TrendingUp, ArrowRight, Target } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, team, business, stage, milestones, tasks } = useStore();
  const cfg = stageConfig(stage);
  const progress = journeyProgress(stage);

  const nextMilestone = milestones.find((m) => m.completion < 100);
  const openTasks = tasks.filter((t) => t.status !== 'Completed');
  const nextTask = openTasks.sort((a, b) => (a.priority === b.priority ? 0 : a.priority > b.priority ? -1 : 1))[0];
  const showOnboarding = stage === 'No Team' || stage === 'Discover';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink">Good morning, {user.name.split(' ')[0]}</h2>
        <p className="text-ink-muted mt-1">Here's what is happening with your team and business.</p>
      </div>

      {showOnboarding && <Onboarding />}

      {/* Journey + stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink">Your Journey</h3>
            <Badge tone="teal">Overall {Math.round(progress)}%</Badge>
          </div>
          <JourneyStepper active={stage} />
          <div className="mt-5">
            <ProgressBar value={progress} color="teal" height="h-2.5" />
          </div>
        </Card>

        <Card className="bg-teal text-white border-transparent relative overflow-hidden">
          <div className="text-xs uppercase tracking-wide text-white/70 font-semibold">Current Stage</div>
          <div className="text-3xl font-bold mt-1">{cfg.label}</div>
          <p className="text-sm text-white/85 mt-2">{cfg.description}</p>
          <div className="mt-4">
            <Button variant="yellow" size="sm" onClick={() => navigate(stage === 'Building' ? '/build' : stage === 'Validating' ? '/validate' : stage === 'Discover' ? '/discover' : '/')}>
              {cfg.ctaPrimary} <ArrowRight size={14} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader icon={<Users size={18} />} title="Team" />
          <div className="space-y-2">
            <div className="text-lg font-semibold text-ink">{team.name}</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Members</span><span className="font-medium text-ink">{team.members.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Compatibility</span>
              <Badge tone="teal">{team.compatibilityScore}%</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Status</span><Badge tone="blue">{team.status}</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate('/team')}>View team</Button>
          </div>
        </Card>

        <Card>
          <CardHeader icon={<Briefcase size={18} />} title="Business" />
          <div className="space-y-2">
            <div className="text-lg font-semibold text-ink leading-tight">{business.name}</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Stage</span><Badge tone="teal">{business.stage}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Health</span><Badge tone={business.health >= 70 ? 'green' : 'yellow'}>{business.health}/100</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Objective</span><span className="font-medium text-ink text-right text-xs max-w-[120px] truncate">{nextMilestone?.name}</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader icon={<TrendingUp size={18} />} title="Progress" />
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-muted">Completion</span>
                <span className="text-xl font-bold text-teal">{business.progress}%</span>
              </div>
              <ProgressBar value={business.progress} className="mt-1.5" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Milestones</span><span className="font-medium text-ink">{milestones.filter((m) => m.status === 'Completed').length}/{milestones.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Upcoming</span><span className="font-medium text-ink">{nextMilestone?.name}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader icon={<Target size={18} className="text-yellow-600" />} title={<span className="text-yellow-700">Next Action</span>} />
          <div className="space-y-3">
            <p className="text-sm text-ink-800 font-medium leading-snug">
              {nextTask ? `Complete "${nextTask.title}" — ${nextTask.priority} priority.` : 'Keep validating your business hypothesis.'}
            </p>
            <p className="text-xs text-ink-muted">{cfg.ctaPrimary} to maintain momentum.</p>
            <Button variant="yellow" size="sm" className="w-full" onClick={() => navigate('/build')}>
              Continue <ArrowRight size={14} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader title="Milestones at a glance" subtitle="Where the team stands today" />
            <div className="space-y-3">
              {milestones.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className="w-40 text-sm text-ink truncate">{m.name}</div>
                  <ProgressBar value={m.completion} color={m.status === 'Completed' ? 'green' : m.status === 'At Risk' ? 'red' : 'teal'} className="flex-1" />
                  <span className="w-10 text-right text-xs text-ink-muted">{m.completion}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <SmartRecommendations />
      </div>
    </div>
  );
}
