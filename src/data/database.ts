import type {
  User, Team, Business, Milestone, Task, Hypothesis, Persona, Goal,
  Decision, Issue, Activity, AppNotification, TeamValue, CapabilityScore,
} from './types';

/* ---------- Raw DB row shapes (mirror supabase/migrations/0001_init.sql) ---------- */

export interface ProfileRow {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  role: string | null;
  status: string | null;
  mbti: string | null;
  mbti_confidence: number | null;
  mbti_date: string | null;
  mbti_source: string | null;
  profile_completion: number | null;
  assessment_completion: number | null;
  strengths: string[] | null;
  development_areas: string[] | null;
  business_strengths: string | null;
  suggested_roles: string[] | null;
  skills: any | null;
  experience: any | null;
  interests: string[] | null;
  working_style: any | null;
  availability: any | null;
  entrepreneurial: any | null;
  created_at: string | null;
}

export interface TeamRow {
  id: string; name: string; avatar_url: string | null; description: string | null;
  business_concept: string | null; created_at: string | null; status: string | null;
  compatibility_score: number | null;
}

export interface TeamMemberRow {
  team_id: string; user_id: string; role: string | null; responsibilities: string[] | null;
  skills: string[] | null; availability: string | null; contact: string | null;
  contribution: number | null; current_tasks: number | null;
}

export interface BusinessRow {
  id: string; team_id: string; name: string; value_prop: string | null; stage: string | null;
  health: number | null; progress: number | null; last_updated: string | null; next_milestone: string | null;
  problem: string | null; target_customer: string | null; solution: string | null; uvp: string | null;
  alternatives: string | null; advantage: string | null; model: any | null;
}

export interface InviteRow {
  id: string; team_id: string | null; from_user: string; to_user: string;
  status: string; preferred_role: string | null; match: number | null; scores: any | null;
  created_at: string | null;
}

/* ---------- Converters ---------- */

export function rowToUser(r: ProfileRow): User {
  return {
    id: r.id,
    name: r.name ?? 'Member',
    avatar: (r.name ?? '??').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(),
    role: (r.role as User['role']) ?? 'Member',
    status: r.status ?? 'Active',
    email: r.email ?? '',
    profileCompletion: r.profile_completion ?? 0,
    assessmentCompletion: r.assessment_completion ?? 0,
    strengths: r.strengths ?? [],
    developmentAreas: r.development_areas ?? [],
    businessStrengths: r.business_strengths ?? '',
    suggestedRoles: r.suggested_roles ?? [],
    profile: {
      mbti: r.mbti ?? undefined,
      mbtiConfidence: r.mbti_confidence ?? undefined,
      mbtiDate: r.mbti_date ?? undefined,
      mbtiSource: (r.mbti_source as any) ?? undefined,
      skills: r.skills ?? [],
      experience: r.experience ?? { previousBusinesses: 0, workExperienceYears: 0, projects: 0, internships: 0, leadershipExperience: false, industryKnowledge: [], entrepreneurialExperience: false },
      interests: r.interests ?? [],
      workingStyle: r.working_style ?? { leadership: '', independence: '', structure: '', decision: '', communication: '', meetingFrequency: '', conflict: '' },
      availability: r.availability ?? { hoursPerWeek: 0, preferredHours: '', location: 'Remote', timezone: '', commitment: 'Medium' },
      entrepreneurial: r.entrepreneurial ?? { desiredRole: '', companySize: '', riskTolerance: '', growthAmbition: '', stagePreference: '', wantsFounder: false, decisionRole: '', equityExpectation: '' },
    },
  };
}

export function userToRow(u: User): any {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    avatar_url: null,
    role: u.role,
    status: u.status,
    mbti: u.profile.mbti ?? null,
    mbti_confidence: u.profile.mbtiConfidence ?? null,
    mbti_date: u.profile.mbtiDate ?? null,
    mbti_source: u.profile.mbtiSource ?? null,
    profile_completion: u.profileCompletion,
    assessment_completion: u.assessmentCompletion,
    strengths: u.strengths,
    development_areas: u.developmentAreas,
    business_strengths: u.businessStrengths,
    suggested_roles: u.suggestedRoles,
    skills: u.profile.skills,
    experience: u.profile.experience,
    interests: u.profile.interests,
    working_style: u.profile.workingStyle,
    availability: u.profile.availability,
    entrepreneurial: u.profile.entrepreneurial,
  };
}

export function rowToTeam(r: TeamRow, members: TeamMemberRow[]): Team {
  return {
    id: r.id,
    name: r.name,
    avatar: r.name.slice(0, 2).toUpperCase(),
    description: r.description ?? '',
    businessConcept: r.business_concept ?? '',
    createdAt: r.created_at ?? '',
    status: (r.status as Team['status']) ?? 'Forming',
    compatibilityScore: r.compatibility_score ?? 0,
    members: members.map((m) => ({
      userId: m.user_id,
      name: m.user_id,
      avatar: m.user_id.slice(0, 2).toUpperCase(),
      mbti: undefined,
      role: m.role ?? '',
      skills: m.skills ?? [],
      responsibilities: m.responsibilities ?? [],
      availability: m.availability ?? '',
      contact: m.contact ?? '',
      contribution: m.contribution ?? 0,
      currentTasks: m.current_tasks ?? 0,
    })),
  };
}

export function rowToBusiness(r: BusinessRow): Business {
  return {
    name: r.name,
    valueProposition: r.value_prop ?? '',
    stage: r.stage ?? '',
    health: r.health ?? 0,
    progress: r.progress ?? 0,
    lastUpdated: r.last_updated ?? '',
    nextMilestone: r.next_milestone ?? '',
    problem: r.problem ?? '',
    targetCustomer: r.target_customer ?? '',
    solution: r.solution ?? '',
    uvp: r.uvp ?? '',
    alternatives: r.alternatives ?? '',
    advantage: r.advantage ?? '',
    model: r.model ?? {
      revenueModel: '', pricing: '', customerAcquisition: '', keyResources: '', keyPartners: '',
      majorCosts: '', distributionChannels: '', revenueAssumptions: '',
    },
  };
}

export function rowToMilestone(r: any): Milestone {
  return { id: r.id, order: r.order, name: r.name, status: r.status, owner: r.owner, deadline: r.deadline, completion: r.completion, tasks: r.tasks, notes: r.notes ?? '' };
}
export function rowToTask(r: any): Task {
  return { id: r.id, title: r.title, description: r.description, owner: r.owner, priority: r.priority, deadline: r.deadline, status: r.status, milestoneId: r.milestone_id };
}
export function rowToHypothesis(r: any): Hypothesis {
  return { id: r.id, statement: r.statement, status: r.status, evidence: r.evidence ?? '', feedback: r.feedback ?? '', interviews: r.interviews ?? 0 };
}
export function rowToPersona(r: any): Persona {
  return { id: r.id, name: r.name, description: r.description, validated: r.validated ?? false };
}
export function rowToGoal(r: any): Goal {
  return { id: r.id, type: r.type, text: r.text, owner: r.owner, deadline: r.deadline, done: r.done ?? false };
}
export function rowToDecision(r: any): Decision {
  return { id: r.id, decision: r.decision, date: r.date, responsible: r.responsible, reason: r.reason, alternatives: r.alternatives, result: r.result };
}
export function rowToIssue(r: any): Issue {
  return { id: r.id, category: r.category, description: r.description, severity: r.severity, owner: r.owner, status: r.status, deadline: r.deadline, proposedSolution: r.proposed_solution ?? '' };
}
export function rowToActivity(r: any): Activity {
  return { id: r.id, text: r.text, date: r.date, type: r.type };
}
export function rowToNotification(r: any): AppNotification {
  return { id: r.id, category: r.category, title: r.title, body: r.body, date: r.date, read: r.read ?? false, priority: r.priority };
}
export function rowToTeamValue(r: any): TeamValue {
  return { id: r.id, name: r.name, description: r.description, alignment: r.alignment ?? {} };
}
export function rowToCapability(r: any): CapabilityScore {
  return { area: r.area, score: r.score };
}
