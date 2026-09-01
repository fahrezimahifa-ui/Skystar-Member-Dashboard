import { create } from 'zustand';
import type {
  User, Team, Business, Milestone, Task, Hypothesis, Persona, Goal,
  Decision, Issue, Activity, AppNotification, Recommendation, TeamValue,
  CapabilityScore, KPI, Stage, TaskStatus, HypothesisStatus,
} from '../data/types';
import * as api from '../data/api';
import * as mock from '../data/mock';
import * as conv from '../data/database';
import { isSupabaseConfigured } from '../lib/supabase';
import { toast } from '../lib/toast';

const defaultUser: User = {
  id: '', name: 'Guest', avatar: 'G', role: 'Member', status: 'Active', email: '',
  profileCompletion: 0, assessmentCompletion: 0, strengths: [], developmentAreas: [], businessStrengths: '',
  suggestedRoles: [], profile: {
    skills: [], experience: { previousBusinesses: 0, workExperienceYears: 0, projects: 0, internships: 0, leadershipExperience: false, industryKnowledge: [], entrepreneurialExperience: false },
    interests: [], workingStyle: { leadership: '', independence: '', structure: '', decision: '', communication: '', meetingFrequency: '', conflict: '' },
    availability: { hoursPerWeek: 0, preferredHours: '', location: 'Remote', timezone: '', commitment: 'Medium' },
    entrepreneurial: { desiredRole: '', companySize: '', riskTolerance: '', growthAmbition: '', stagePreference: '', wantsFounder: false, decisionRole: '', equityExpectation: '' },
  },
};

const emptyTeam: Team = { id: '', name: 'No Team', avatar: 'NT', description: '', businessConcept: '', createdAt: '', status: 'Forming', compatibilityScore: 0, members: [] };
const emptyBusiness: Business = {
  name: 'Your Business', valueProposition: '', stage: 'Idea', health: 0, progress: 0, lastUpdated: '', nextMilestone: '',
  problem: '', targetCustomer: '', solution: '', uvp: '', alternatives: '', advantage: '',
  model: { revenueModel: '', pricing: '', customerAcquisition: '', keyResources: '', keyPartners: '', majorCosts: '', distributionChannels: '', revenueAssumptions: '' },
};

function toRecommendation(u: User): Recommendation {
  const skills = u.profile.skills;
  const skillCount = skills.length;
  const expYears = u.profile.experience.workExperienceYears ?? 0;
  const hasMBTI = u.profile.mbti ? 1 : 0;
  const interestCount = u.profile.interests.length;
  const base = Math.max(50, Math.min(98, 55 + skillCount * 3 + expYears + hasMBTI * 5 + interestCount));
  const mk = (delta: number) => Math.max(45, Math.min(99, base + delta));
  return {
    id: u.id, name: u.name, avatar: u.avatar, mbti: u.profile.mbti ?? '—',
    headline: `${u.suggestedRoles[0] ?? 'Team member'} · ${skillCount} skill${skillCount === 1 ? '' : 's'}`,
    skills: skills.map((s) => s.name), experience: `${expYears} yrs`,
    interests: u.profile.interests, availability: `${u.profile.availability.hoursPerWeek}h/wk · ${u.profile.availability.location}`,
    preferredRole: u.profile.entrepreneurial.desiredRole, match: base,
    scores: {
      skillsComplementarity: mk(3), businessInterest: mk(-4), workingStyle: mk(-6),
      availability: mk(4), values: mk(0), personalityCompatibility: mk(-2),
    },
    complementarity: skills.map((s) => s.name),
    bio: u.businessStrengths || 'New member.', state: 'pending',
  };
}

function deriveKpis(s: { tasks: Task[]; hypotheses: Hypothesis[]; issues: Issue[]; milestones: Milestone[]; team: Team }): KPI[] {
  const completedTasks = s.tasks.filter((t) => t.status === 'Completed').length;
  const validated = s.hypotheses.filter((h) => h.status === 'Validated').length;
  const openIssues = s.issues.filter((i) => i.status !== 'Resolved').length;
  const doneM = s.milestones.filter((m) => m.status === 'Completed').length;
  const totalM = s.milestones.length || 1;
  return [
    { label: 'Team size', value: s.team.members.length, unit: '' },
    { label: 'Tasks completed', value: completedTasks, unit: '' },
    { label: 'Hypotheses validated', value: validated, unit: '' },
    { label: 'Open issues', value: openIssues, unit: '' },
    { label: 'Milestones done', value: Math.round((doneM / totalM) * 100), unit: '%' },
  ];
}

interface StoreState {
  hydrated: boolean;
  user: User;
  users: User[];
  team: Team;
  business: Business;
  capabilities: CapabilityScore[];
  milestones: Milestone[];
  tasks: Task[];
  hypotheses: Hypothesis[];
  personas: Persona[];
  goals: Goal[];
  decisions: Decision[];
  issues: Issue[];
  activities: Activity[];
  notifications: AppNotification[];
  recommendations: Recommendation[];
  teamValues: TeamValue[];
  kpis: KPI[];
  candidateIds: string[];
  receivedInvites: conv.InviteRow[];
  sentInvites: conv.InviteRow[];
  stage: Stage;

  hydrate: (userId: string) => Promise<void>;
  loadDemo: () => void;
  refreshTeam: () => Promise<void>;
  setMBTI: (type: string, confidence?: number, date?: string, source?: string) => void;
  addSkill: (name: string, proficiency: string) => void;
  updateSkill: (name: string, proficiency: string) => void;
  setInviteRec: (id: string) => Promise<void>;
  setSaveRec: (id: string) => void;
  setRejectRec: (id: string) => void;
  inviteByUsername: (username: string) => Promise<{ error?: string }>;
  withdrawInvite: (inviteId: string) => Promise<void>;
  rejectInvite: (inviteId: string) => Promise<void>;
  loadInvites: () => Promise<void>;
  toggleCandidate: (id: string) => void;
  clearCandidate: () => void;
  formTeam: () => Promise<void>;
  acceptInvite: (inviteId: string, teamId: string) => Promise<void>;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  addTask: (t: Partial<Task>) => void;
  setHypothesisStatus: (id: string, status: HypothesisStatus) => void;
  addDecision: (d: Partial<Decision>) => void;
  addIssue: (i: Partial<Issue>) => void;
  addGoal: (g: Partial<Goal>) => void;
  markNotifRead: (id: string) => void;
  markAllRead: () => void;
  pushActivity: (text: string, type: Activity['type']) => void;
  setStage: (s: Stage) => void;
  setUser: (u: Partial<User>) => void;
}

export const useStore = create<StoreState>((set, get) => {
  const safe = async (label: string, fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (e) {
      console.error(label, e);
      toast.error(`${label} failed — changes may not be saved`);
      if (get().team.id) await get().refreshTeam();
    }
  };
  return ({
    hydrated: false,
  user: defaultUser,
  users: [],
  team: emptyTeam,
  business: emptyBusiness,
  capabilities: [],
  milestones: [],
  tasks: [],
  hypotheses: [],
  personas: [],
  goals: [],
  decisions: [],
  issues: [],
  activities: [],
  notifications: [],
      recommendations: [],
      teamValues: [],
      kpis: [],
      candidateIds: [],
      receivedInvites: [],
      sentInvites: [],
  stage: 'No Team',

  hydrate: async (userId) => {
    try {
      const profileRow = await api.loadProfile(userId);
      const user = profileRow ? conv.rowToUser(profileRow) : { ...defaultUser, id: userId };
      set({ user, hydrated: true });
      const teamId = await api.getTeamIdForUser(userId);
      if (teamId) {
        const loaded = await api.loadTeam(teamId);
        if (loaded) {
          const [milestones, tasks, hypotheses, personas, goals, decisions, issues, activities, capabilities, teamValues, notifications] = await Promise.all([
            api.loadMilestones(teamId), api.loadTasks(teamId), api.loadHypotheses(teamId), api.loadPersonas(teamId),
            api.loadGoals(teamId), api.loadDecisions(teamId), api.loadIssues(teamId), api.loadActivities(teamId),
            api.loadCapabilities(teamId), api.loadTeamValues(teamId), api.loadNotifications(userId),
          ]);
          set({
            team: loaded.team, business: loaded.business ?? emptyBusiness, milestones, tasks, hypotheses, personas,
            goals, decisions, issues, activities, capabilities, teamValues, notifications, stage: 'Building',
            kpis: deriveKpis({ tasks, hypotheses, issues, milestones, team: loaded.team }),
          });
        }
      } else {
        const candidates = await api.listCandidateUsers([userId], 50);
        const recs = candidates.map((u) => toRecommendation(u));
        set({ recommendations: recs, stage: user.profileCompletion >= 60 ? 'Discover' : 'No Team' });
      }
    } catch (e) {
      console.error('hydrate failed', e);
      toast.error('Could not load your workspace. Please retry.');
      set({ hydrated: true });
    }
    await get().loadInvites();
  },

  loadDemo: () => {
    const current = mock.users.find((u) => u.id === mock.currentUserId) ?? mock.users[0];
    set({
      hydrated: true,
      user: current,
      users: mock.users,
      team: mock.team,
      business: mock.business,
      capabilities: mock.capabilities,
      milestones: mock.milestones,
      tasks: mock.tasks,
      hypotheses: mock.hypotheses,
      personas: mock.personas,
      goals: mock.goals,
      decisions: mock.decisions,
      issues: mock.issues,
      activities: mock.activities,
      notifications: mock.notifications,
      recommendations: mock.recommendations,
      teamValues: mock.teamValues,
      kpis: mock.kpis,
      candidateIds: [],
      stage: 'Building',
    });
  },

  refreshTeam: async () => {
    const teamId = get().team.id;
    if (!teamId) return;
    const [team, milestones, tasks, hypotheses, personas, goals, decisions, issues, activities, capabilities, teamValues, notifications] = await Promise.all([
      api.loadTeam(teamId), api.loadMilestones(teamId), api.loadTasks(teamId), api.loadHypotheses(teamId), api.loadPersonas(teamId),
      api.loadGoals(teamId), api.loadDecisions(teamId), api.loadIssues(teamId), api.loadActivities(teamId),
      api.loadCapabilities(teamId), api.loadTeamValues(teamId), api.loadNotifications(get().user.id),
    ]);
    set({
      team: team ? team.team : get().team, business: team ? team.business ?? emptyBusiness : get().business,
      milestones, tasks, hypotheses, personas, goals, decisions, issues, activities, capabilities, teamValues, notifications,
      kpis: deriveKpis({ tasks, hypotheses, issues, milestones, team: team ? team.team : get().team }),
    });
  },

  setUser: (u) => { const nu = { ...get().user, ...u }; set({ user: nu }); void safe('Save profile', () => api.saveProfile(nu)); },

  setMBTI: (type, confidence, date, source) => {
    const user = { ...get().user, profile: { ...get().user.profile, mbti: type, mbtiConfidence: confidence, mbtiDate: date, mbtiSource: (source as any) } };
    set({ user });
    void safe('Save profile', () => api.saveProfile(user));
  },

  addSkill: (name, proficiency) => {
    const user = get().user;
    if (user.profile.skills.some((s) => s.name === name)) return;
    const nu = { ...user, profile: { ...user.profile, skills: [...user.profile.skills, { name, proficiency: proficiency as any }] } };
    set({ user: nu }); void safe('Save profile', () => api.saveProfile(nu));
  },

  updateSkill: (name, proficiency) => {
    const user = get().user;
    const nu = { ...user, profile: { ...user.profile, skills: user.profile.skills.map((s) => (s.name === name ? { ...s, proficiency: proficiency as any } : s)) } };
    set({ user: nu }); void safe('Save profile', () => api.saveProfile(nu));
  },

  setInviteRec: async (id) => {
    const rec = get().recommendations.find((r) => r.id === id);
    if (!rec) return;
    await safe('Invite', () => api.createInvite(get().user.id, rec.id, get().team.id || null, { preferredRole: rec.preferredRole, match: rec.match, scores: rec.scores }));
    set({ recommendations: get().recommendations.map((r) => (r.id === id ? { ...r, state: 'invited' } : r)) });
    await get().loadInvites();
  },
  setSaveRec: (id) => set({ recommendations: get().recommendations.map((r) => (r.id === id ? { ...r, state: 'saved' } : r)) }),
  setRejectRec: (id) => set({ recommendations: get().recommendations.map((r) => (r.id === id ? { ...r, state: 'rejected' } : r)) }),

  loadInvites: async () => {
    const userId = get().user.id;
    if (!isSupabaseConfigured || !userId) return;
    const [received, sent] = await Promise.all([api.listInvitesForUser(userId), api.listSentInvites(userId)]);
    set({ receivedInvites: received, sentInvites: sent });
  },
  inviteByUsername: async (username: string) => {
    const target = await api.findUserByUsername(username);
    if (!target) return { error: 'No user found with that username' };
    if (target.id === get().user.id) return { error: 'You cannot invite yourself' };
    await safe('Invite', () => api.createInvite(get().user.id, target.id, get().team.id || null, { preferredRole: target.profile.entrepreneurial.desiredRole || 'Member', match: 0, scores: {} }));
    await get().loadInvites();
    toast.success(`Invite sent to ${target.name}`);
    return {};
  },
  withdrawInvite: async (inviteId: string) => {
    await safe('Withdraw invite', () => api.withdrawInvite(inviteId));
    await get().loadInvites();
  },
  rejectInvite: async (inviteId: string) => {
    await safe('Reject invite', () => api.rejectInvite(inviteId));
    await get().loadInvites();
  },

  toggleCandidate: (id) => set((s) => ({ candidateIds: s.candidateIds.includes(id) ? s.candidateIds.filter((c) => c !== id) : [...s.candidateIds, id] })),
  clearCandidate: () => set({ candidateIds: [] }),

  formTeam: async () => {
    if (!isSupabaseConfigured) { set({ candidateIds: [] }); return; }
    const { user, recommendations, candidateIds } = get();
    const members = recommendations.filter((r) => candidateIds.includes(r.id)).map((r) => ({ id: r.id, role: r.preferredRole }));
    const teamId = await api.createTeamRpc(`${user.name.split(' ')[0]}'s Team`, '', members.map((m) => m.id), members.map((m) => m.role));
    const loaded = teamId ? await api.loadTeam(teamId) : null;
    if (loaded) set({ team: loaded.team, business: loaded.business ?? emptyBusiness, stage: 'Building', candidateIds: [] });
  },

  acceptInvite: async (inviteId, teamId) => {
    await safe('Accept invite', () => api.acceptInviteRpc(inviteId));
    const loaded = await api.loadTeam(teamId);
    if (loaded) set({ team: loaded.team, business: loaded.business ?? emptyBusiness, stage: 'Building' });
    await get().loadInvites();
  },

  setTaskStatus: (id, status) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = { ...task, status };
    set({ tasks: get().tasks.map((t) => (t.id === id ? updated : t)) });
    if (get().team.id) void safe('Save task', () => api.saveTask(get().team.id, updated));
  },

  addTask: (t) => {
    const id = 't' + Date.now();
    const task: Task = { id, title: t.title || 'New task', description: t.description || '', owner: t.owner || get().user.name, priority: (t.priority || 'Medium') as any, deadline: t.deadline || '', status: (t.status || 'To Do') as any, milestoneId: t.milestoneId || 'm7' };
    set({ tasks: [...get().tasks, task] });
    if (get().team.id) void safe('Save task', () => api.saveTask(get().team.id, task));
  },

  setHypothesisStatus: (id, status) => {
    const h = get().hypotheses.find((x) => x.id === id);
    if (!h) return;
    const updated = { ...h, status };
    set({ hypotheses: get().hypotheses.map((x) => (x.id === id ? updated : x)) });
    if (get().team.id) void safe('Save hypothesis', () => api.saveHypothesis(get().team.id, updated));
  },

  addDecision: (d) => {
    const dec = { id: 'd' + Date.now(), decision: d.decision || '', date: d.date || new Date().toISOString().slice(0, 10), responsible: d.responsible || get().user.name, reason: d.reason || '', alternatives: d.alternatives || '', result: d.result || '' };
    set({ decisions: [dec, ...get().decisions] });
    if (get().team.id) void safe('Log decision', () => api.createDecision(get().team.id, dec));
  },

  addIssue: (i) => {
    const iss: Issue = { id: 'i' + Date.now(), category: (i.category || 'Operational') as any, description: i.description || '', severity: (i.severity || 'Medium') as any, owner: i.owner || get().user.name, status: 'Open', deadline: i.deadline || '', proposedSolution: i.proposedSolution || '' };
    set({ issues: [iss, ...get().issues] });
    if (get().team.id) void safe('Report issue', () => api.createIssue(get().team.id, iss));
  },

  addGoal: (g) => {
    const goal = { id: 'g' + Date.now(), type: (g.type || 'Weekly') as any, text: g.text || '', owner: g.owner || get().user.name, deadline: g.deadline || '', done: false };
    set({ goals: [goal, ...get().goals] });
    if (get().team.id) void safe('Add goal', () => api.createGoal(get().team.id, goal));
  },

  markNotifRead: (id) => { set({ notifications: get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }); void safe('Mark read', () => api.updateNotification(id, true)); },
  markAllRead: () => { set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }); get().notifications.forEach((n) => void safe('Mark read', () => api.updateNotification(n.id, true))); },

  pushActivity: (text, type) => { set({ activities: [{ id: 'a' + Date.now(), text, date: new Date().toISOString().slice(0, 10), type }, ...get().activities] }); if (get().team.id) void safe('Log activity', () => api.pushActivity(get().team.id, text, type)); },

  setStage: (stage) => set({ stage }),
  });
});
