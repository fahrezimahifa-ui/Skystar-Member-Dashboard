import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Team, Business, Milestone, Task, Hypothesis, Goal, Decision, Issue, Activity } from '../data/types';
import * as conv from './database';
import { computeCompatibility } from '../lib/recommendations';

/* ============ Profiles ============ */

export async function ensureProfile(auth: { id: string; email?: string }): Promise<conv.ProfileRow> {
  const { data } = await supabase.from('profiles').select('*').eq('id', auth.id).maybeSingle();
  if (data) return data as conv.ProfileRow;
  const username = (auth.email ?? auth.id).split('@')[0];
  const row = {
    id: auth.id, email: auth.email ?? '', username, name: (auth.email ?? 'Member').split('@')[0],
    role: 'Member', status: 'Active', profile_completion: 0, assessment_completion: 0,
    strengths: [], development_areas: [], suggested_roles: [],
    skills: [], experience: {}, interests: [], working_style: {}, availability: {}, entrepreneurial: {},
  };
  const { data: inserted } = await supabase.from('profiles').insert(row).select('*').single();
  return (inserted ?? row) as conv.ProfileRow;
}

export async function loadProfile(id: string): Promise<conv.ProfileRow | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  return (data as conv.ProfileRow) ?? null;
}

export async function saveProfile(user: User): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('profiles').upsert(conv.userToRow(user), { onConflict: 'id' });
}

/* ============ Teams & members ============ */

export async function getTeamIdForUser(userId: string): Promise<string | null> {
  const { data } = await supabase.from('team_members').select('team_id').eq('user_id', userId).maybeSingle();
  return (data as any)?.team_id ?? null;
}

export async function loadTeam(teamId: string): Promise<{ team: Team; business: Business | null } | null> {
  const { data: team } = await supabase.from('teams').select('*').eq('id', teamId).maybeSingle();
  if (!team) return null;
  const { data: members } = await supabase.from('team_members').select('*').eq('team_id', teamId);
  const { data: business } = await supabase.from('businesses').select('*').eq('team_id', teamId).maybeSingle();
  const profiles = await Promise.all((members as conv.TeamMemberRow[]).map(async (m) => {
    const p = await loadProfile(m.user_id);
    return { row: m, user: p ? conv.rowToUser(p) : undefined };
  }));
  const teamObj = conv.rowToTeam(team as conv.TeamRow, members as conv.TeamMemberRow[]);
  teamObj.members = teamObj.members.map((tm, i) => {
    const u = profiles[i]?.user;
    return { ...tm, name: u?.name ?? tm.userId.slice(0, 2).toUpperCase(), avatar: u?.avatar ?? tm.avatar, mbti: u?.profile.mbti };
  });
  teamObj.compatibilityScore = computeCompatibility(teamObj.members);
  return { team: teamObj, business: business ? conv.rowToBusiness(business as conv.BusinessRow) : null };
}

export async function createTeamRpc(name: string, concept: string, memberIds: string[], roles: string[]): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.rpc('create_team_with_members', {
    p_name: name, p_concept: concept, p_member_ids: memberIds, p_roles: roles,
  });
  if (error) { console.error('createTeamRpc', error); return null; }
  return (data as string) ?? null;
}

export async function addTeamMember(teamId: string, userId: string, role: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('team_members').upsert({ team_id: teamId, user_id: userId, role, responsibilities: [], skills: [], availability: '', contact: '', contribution: 50, current_tasks: 0 }, { onConflict: 'team_id,user_id' });
}

/* ============ Candidate pool (matching) ============ */

export async function listCandidateUsers(excludeIds: string[], limit = 50): Promise<User[]> {
  let q = supabase.from('profiles').select('*').limit(limit);
  if (excludeIds.length) q = q.not('id', 'in', `(${excludeIds.map((i) => `"${i}"`).join(',')})`);
  const { data } = await q;
  return (data as conv.ProfileRow[]).map(conv.rowToUser);
}

/* ============ Invites ============ */

export async function createInvite(from: string, to: string, teamId: string | null, meta: { preferredRole: string; match: number; scores: any }): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('invites').insert({ from_user: from, to_user: to, team_id: teamId, status: 'pending', ...meta });
}

export async function listInvitesForUser(userId: string) {
  const { data } = await supabase.from('invites').select('*').eq('to_user', userId).eq('status', 'pending');
  return (data as conv.InviteRow[]) ?? [];
}

export async function listSentInvites(userId: string) {
  const { data } = await supabase.from('invites').select('*').eq('from_user', userId).eq('status', 'pending');
  return (data as conv.InviteRow[]) ?? [];
}

export async function withdrawInvite(inviteId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('invites').delete().eq('id', inviteId).eq('status', 'pending');
}

export async function rejectInvite(inviteId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('invites').update({ status: 'rejected' }).eq('id', inviteId).eq('status', 'pending');
}

export async function findUserByUsername(username: string): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.from('profiles').select('*').eq('username', username.toLowerCase().trim()).maybeSingle();
  return data ? conv.rowToUser(data as conv.ProfileRow) : null;
}

export async function acceptInviteRpc(inviteId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.rpc('accept_invite', { p_invite_id: inviteId });
  if (error) console.error('acceptInviteRpc', error);
}

/* ============ Business ============ */

export async function saveBusiness(teamId: string, business: Business): Promise<void> {
  if (!isSupabaseConfigured) return;
  const row = {
    team_id: teamId, name: business.name, value_prop: business.valueProposition, stage: business.stage,
    health: business.health, progress: business.progress, last_updated: new Date().toISOString().slice(0, 10),
    next_milestone: business.nextMilestone, problem: business.problem, target_customer: business.targetCustomer,
    solution: business.solution, uvp: business.uvp, alternatives: business.alternatives, advantage: business.advantage, model: business.model,
  };
  await supabase.from('businesses').upsert(row, { onConflict: 'team_id' });
}

/* ============ Generic list/save helpers ============ */

async function listRows(table: string, teamId: string, map: (r: any) => any): Promise<any[]> {
  const { data } = await supabase.from(table).select('*').eq('team_id', teamId);
  return (data as any[]).map(map);
}

export const loadMilestones = (tid: string) => listRows('milestones', tid, conv.rowToMilestone);
export const loadTasks = (tid: string) => listRows('tasks', tid, conv.rowToTask);
export const loadHypotheses = (tid: string) => listRows('hypotheses', tid, conv.rowToHypothesis);
export const loadPersonas = (tid: string) => listRows('personas', tid, conv.rowToPersona);
export const loadGoals = (tid: string) => listRows('goals', tid, conv.rowToGoal);
export const loadDecisions = (tid: string) => listRows('decisions', tid, conv.rowToDecision);
export const loadIssues = (tid: string) => listRows('issues', tid, conv.rowToIssue);
export const loadActivities = (tid: string) => listRows('activities', tid, conv.rowToActivity);
export const loadCapabilities = (tid: string) => listRows('capabilities', tid, conv.rowToCapability);
export const loadTeamValues = (tid: string) => listRows('team_values', tid, conv.rowToTeamValue);
export const loadNotifications = (userId: string) =>
  (async () => {
    const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('date', { ascending: false });
    return (data as any[]).map(conv.rowToNotification);
  })();

export async function saveTask(tid: string, task: Task): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('tasks').upsert({
    id: task.id, team_id: tid, title: task.title, description: task.description, owner: task.owner,
    priority: task.priority, deadline: task.deadline, status: task.status, milestone_id: task.milestoneId,
  }, { onConflict: 'id' });
}
export async function saveMilestone(tid: string, m: Milestone): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('milestones').upsert({
    id: m.id, team_id: tid, order: m.order, name: m.name, status: m.status, owner: m.owner,
    deadline: m.deadline, completion: m.completion, tasks: m.tasks, notes: m.notes,
  }, { onConflict: 'id' });
}
export async function saveHypothesis(tid: string, h: Hypothesis): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('hypotheses').upsert({
    id: h.id, team_id: tid, statement: h.statement, status: h.status, evidence: h.evidence, feedback: h.feedback, interviews: h.interviews,
  }, { onConflict: 'id' });
}
export async function createGoal(tid: string, g: Omit<Goal, 'id'>): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('goals').insert({ team_id: tid, type: g.type, text: g.text, owner: g.owner, deadline: g.deadline, done: g.done });
}
export async function createDecision(tid: string, d: Omit<Decision, 'id'>): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('decisions').insert({ team_id: tid, decision: d.decision, date: d.date, responsible: d.responsible, reason: d.reason, alternatives: d.alternatives, result: d.result });
}
export async function createIssue(tid: string, i: Omit<Issue, 'id'>): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('issues').insert({ team_id: tid, category: i.category, description: i.description, severity: i.severity, owner: i.owner, status: i.status, deadline: i.deadline, proposed_solution: i.proposedSolution });
}
export async function updateNotification(id: string, read: boolean): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('notifications').update({ read }).eq('id', id);
}

/* ============ Realtime ============ */

export function subscribeToTeam(teamId: string, tables: string[], onEvent: (table: string, payload: any) => void) {
  const channel = supabase.channel(`team:${teamId}`);
  for (const table of tables) {
    channel.on('postgres_changes', { event: '*', schema: 'public', table, filter: `team_id=eq.${teamId}` }, (payload: any) => onEvent(table, payload));
  }
  channel.subscribe();
  return () => supabase.removeChannel(channel);
}

export async function pushActivity(tid: string, text: string, type: Activity['type']): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('activities').insert({ team_id: tid, text, date: new Date().toISOString().slice(0, 10), type });
}
