import type { CapabilityScore, Milestone, Task, TeamMember } from '../data/types';

export function computeCompatibility(members: { mbti?: string; skills: string[] }[]): number {
  if (members.length === 0) return 0;
  const allSkills = new Set<string>();
  members.forEach((m) => m.skills.forEach((s) => allSkills.add(s.toLowerCase())));
  const skillScore = Math.min(100, 35 + allSkills.size * 4);
  const typeLetters = new Set(members.map((m) => (m.mbti ?? '').slice(0, 1)).filter(Boolean));
  const mbtiScore = members.length > 1 ? Math.min(100, 40 + typeLetters.size * 15) : 60;
  return Math.round((skillScore + mbtiScore) / 2);
}

// re-export to keep imports tidy for callers that only need TeamMember
export type { TeamMember };

export interface SmartRecommendation {
  id: string;
  title: string;
  detail: string;
  priority: 'high' | 'medium' | 'low';
  cta?: string;
}

export function computeRecommendations(args: {
  capabilities: CapabilityScore[];
  milestones: Milestone[];
  tasks: Task[];
  teamSize: number;
  pendingMatches: number;
}): SmartRecommendation[] {
  const recs: SmartRecommendation[] = [];
  const { capabilities, milestones, tasks, pendingMatches } = args;

  // Skill gaps
  const weak = capabilities.filter((c) => c.score < 45).map((c) => c.area);
  if (weak.length) {
    recs.push({
      id: 'gap',
      title: `Your team may need a ${weak.join(' / ')} specialist`,
      detail: `Current ${weak.join(' & ')} capability is below 45%. ${weak.length} recommended members match this gap.`,
      priority: 'high',
      cta: 'View Matches',
    });
  }

  // Upcoming milestone deadlines
  const today = new Date();
  const soon = milestones
    .filter((m) => m.completion < 100)
    .map((m) => ({ m, days: Math.round((new Date(m.deadline).getTime() - today.getTime()) / 86400000) }))
    .filter((x) => x.days >= 0 && x.days <= 30)
    .sort((a, b) => a.days - b.days)[0];
  if (soon) {
    recs.push({
      id: 'deadline',
      title: `"${soon.m.name}" deadline is ${soon.days} days away`,
      detail: `Keep momentum to avoid slipping the schedule. ${soon.m.tasks} tasks remain in this milestone.`,
      priority: 'high',
      cta: 'Open Milestone',
    });
  }

  // Overloaded members
  const overloaded = tasks.filter((t) => t.status !== 'Completed');
  const byOwner: Record<string, number> = {};
  overloaded.forEach((t) => (byOwner[t.owner] = (byOwner[t.owner] || 0) + 1));
  const maxOwner = Object.entries(byOwner).sort((a, b) => b[1] - a[1])[0];
  if (maxOwner && maxOwner[1] >= 4) {
    recs.push({
      id: 'workload',
      title: `${maxOwner[0]} is carrying ${maxOwner[1]} open tasks`,
      detail: 'Consider redistributing work to prevent single-member dependency.',
      priority: 'medium',
      cta: 'View Workload',
    });
  }

  // Validation coverage
  const testing = 1; // from hypotheses mock
  recs.push({
    id: 'validation',
    title: 'Customer validation is a current focus area',
    detail: `${testing} hypothesis still in testing and 1 unvalidated — keep gathering employer evidence.`,
    priority: 'medium',
    cta: 'Open Validation',
  });

  if (pendingMatches > 0) {
    recs.push({
      id: 'matches',
      title: `${pendingMatches} recommended members match your team's gap`,
      detail: 'Review and invite complementary teammates to strengthen commercial capability.',
      priority: 'high',
      cta: 'Explore Matches',
    });
  }

  return recs;
}
