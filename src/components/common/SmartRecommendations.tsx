import { useStore } from '../../store/useStore';
import { computeRecommendations } from '../../lib/recommendations';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../ui';
import { cn } from '../../lib/utils';

const priorityStyle = {
  high: 'border-l-4 border-l-yellow',
  medium: 'border-l-4 border-l-blue',
  low: 'border-l-4 border-l-line',
};

export function SmartRecommendations({ compact = false }: { compact?: boolean }) {
  const { capabilities, milestones, tasks, recommendations, team } = useStore();
  const pendingMatches = recommendations.filter((r) => r.state === 'pending').length;
  const recs = computeRecommendations({ capabilities, milestones, tasks, teamSize: team.members.length, pendingMatches });

  if (compact) {
    return (
      <div className="space-y-2">
        {recs.slice(0, 3).map((r) => (
          <div key={r.id} className={cn('bg-white/45 rounded-lg border border-white/50 p-3', priorityStyle[r.priority])}>
            <div className="flex items-start gap-2">
              <Sparkles size={15} className="text-teal mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-ink">{r.title}</div>
                <div className="text-xs text-ink-muted mt-0.5">{r.detail}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-teal" />
        <h3 className="font-semibold text-ink">Smart Recommendations</h3>
      </div>
      <div className="space-y-3">
        {recs.map((r) => (
          <div key={r.id} className={cn('rounded-lg border border-white/50 p-4 bg-white/45', priorityStyle[r.priority])}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-teal mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-ink">{r.title}</div>
                  <p className="text-sm text-ink-muted mt-1">{r.detail}</p>
                </div>
              </div>
              {r.cta && (
                <button className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-teal hover:underline">
                  {r.cta} <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
