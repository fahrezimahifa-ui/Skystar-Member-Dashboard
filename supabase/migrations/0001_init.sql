-- Teamrise schema: 0001_init.sql
-- Run in the Supabase SQL editor (or via Supabase CLI).

-- ============ ENUMS ============
create type user_status as enum ('Active', 'Away', 'Invited', 'Offline');
create type team_status as enum ('Forming', 'Building', 'Validated', 'Live');
create type task_status as enum ('To Do', 'In Progress', 'Done', 'Blocked');
create type hypothesis_status as enum ('Untested', 'Testing', 'Validated', 'Invalidated');
create type issue_status as enum ('Open', 'In Progress', 'Resolved');
create type issue_severity as enum ('Low', 'Medium', 'High', 'Critical');
create type issue_category as enum ('Financial', 'Operational', 'Legal', 'Team', 'Market', 'Technical');
create type goal_type as enum ('Daily', 'Weekly', 'Monthly');
create type activity_type as enum ('task', 'milestone', 'decision', 'validation', 'team', 'risk');
create type invite_status as enum ('pending', 'accepted', 'rejected');

-- ============ TABLES ============
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  role text default 'Member',
  status user_status default 'Active',
  mbti text,
  mbti_confidence int,
  mbti_date date,
  mbti_source text,
  profile_completion int default 0,
  assessment_completion int default 0,
  strengths text[],
  development_areas text[],
  business_strengths text,
  suggested_roles text[],
  skills jsonb default '[]',
  experience jsonb default '{}',
  interests text[],
  working_style jsonb default '{}',
  availability jsonb default '{}',
  entrepreneurial jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text,
  description text,
  business_concept text,
  created_at timestamptz default now(),
  status team_status default 'Forming',
  compatibility_score int default 0
);

create table if not exists team_members (
  team_id uuid references teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text,
  responsibilities text[],
  skills text[],
  availability text,
  contact text,
  contribution int default 0,
  current_tasks int default 0,
  primary key (team_id, user_id)
);

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  name text not null,
  value_prop text,
  stage text,
  health int default 0,
  progress int default 0,
  last_updated date default current_date,
  next_milestone text,
  problem text,
  target_customer text,
  solution text,
  uvp text,
  alternatives text,
  advantage text,
  model jsonb default '{}',
  unique (team_id)
);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  "order" int,
  name text,
  status task_status default 'To Do',
  owner text,
  deadline date,
  completion int default 0,
  tasks int default 0,
  notes text
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  title text,
  description text,
  owner text,
  priority text,
  deadline date,
  status task_status default 'To Do',
  milestone_id uuid references milestones(id) on delete set null
);

create table if not exists hypotheses (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  statement text,
  status hypothesis_status default 'Untested',
  evidence text,
  feedback text,
  interviews int default 0
);

create table if not exists personas (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  name text,
  description text,
  validated boolean default false
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  type goal_type default 'Weekly',
  text text,
  owner text,
  deadline date,
  done boolean default false
);

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  decision text,
  date date default current_date,
  responsible text,
  reason text,
  alternatives text,
  result text
);

create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  category issue_category,
  description text,
  severity issue_severity default 'Medium',
  owner text,
  status issue_status default 'Open',
  deadline date,
  proposed_solution text
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  text text,
  date date default current_date,
  type activity_type
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category text,
  title text,
  body text,
  date date default current_date,
  read boolean default false,
  priority text
);

create table if not exists team_values (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  name text,
  description text,
  alignment jsonb default '{}'
);

create table if not exists capabilities (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  area text,
  score int default 0
);

create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete set null,
  from_user uuid references auth.users(id) on delete cascade,
  to_user uuid references auth.users(id) on delete cascade,
  status invite_status default 'pending',
  preferred_role text,
  match int,
  scores jsonb,
  created_at timestamptz default now()
);

-- ============ HELPER: team membership ============
create or replace function is_team_member(tid uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from team_members tm where tm.team_id = tid and tm.user_id = auth.uid()
  );
$$;

-- ============ RLS ============
alter table profiles enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table businesses enable row level security;
alter table milestones enable row level security;
alter table tasks enable row level security;
alter table hypotheses enable row level security;
alter table personas enable row level security;
alter table goals enable row level security;
alter table decisions enable row level security;
alter table issues enable row level security;
alter table activities enable row level security;
alter table notifications enable row level security;
alter table team_values enable row level security;
alter table capabilities enable row level security;
alter table invites enable row level security;

-- profiles: any authenticated user can read (needed for the candidate pool); users edit only themselves
create policy "profiles_read" on profiles for select to authenticated using (true);
create policy "profiles_write" on profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_insert" on profiles for insert to authenticated with check (auth.uid() = id);

-- teams
create policy "teams_read" on teams for select to authenticated using (is_team_member(id));
create policy "teams_write" on teams for all to authenticated using (is_team_member(id)) with check (is_team_member(id));

-- team_members
create policy "tm_read" on team_members for select to authenticated using (is_team_member(team_id));
create policy "tm_insert_self" on team_members for insert to authenticated with check (user_id = auth.uid());
create policy "tm_write" on team_members for all to authenticated using (is_team_member(team_id)) with check (is_team_member(team_id));

-- team-scoped tables
do $$
declare t text;
begin
  foreach t in array array['businesses','milestones','tasks','hypotheses','personas','goals','decisions','issues','activities','team_values','capabilities']
  loop
    execute format('create policy %1$s_read on %1$s for select to authenticated using (is_team_member(team_id));', t);
    execute format('create policy %1$s_write on %1$s for all to authenticated using (is_team_member(team_id)) with check (is_team_member(team_id));', t);
  end loop;
end $$;

-- notifications: own only
create policy "notif_read" on notifications for select to authenticated using (user_id = auth.uid());
create policy "notif_write" on notifications for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- invites: sender or recipient
create policy "invite_read" on invites for select to authenticated using (from_user = auth.uid() or to_user = auth.uid());
create policy "invite_write" on invites for all to authenticated using (from_user = auth.uid()) with check (from_user = auth.uid());

-- ============ NEW-USER PROFILE TRIGGER ============
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, name, profile_completion, assessment_completion)
  values (new.id, new.email, split_part(new.email, '@', 1), 0, 0)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- ============ REALTIME ============
alter publication supabase_realtime add table teams, team_members, businesses, milestones, tasks, hypotheses, personas, goals, decisions, issues, activities, notifications, team_values, capabilities, invites;

-- ============ STORAGE ============
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

create policy "avatars_read" on storage.objects for select to authenticated, anon using (bucket_id = 'avatars');
create policy "avatars_write" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============ TEAM CREATION / INVITE ACCEPTANCE (bypass RLS) ============
-- RLS forbids inserting team_members for users other than auth.uid(), and teams require an
-- existing member, so team creation + multi-member insert must run as SECURITY DEFINER.

create or replace function create_team_with_members(
  p_name text, p_concept text, p_member_ids uuid[], p_roles text[]
) returns uuid language plpgsql security definer as $$
declare new_team uuid;
begin
  insert into teams (name, business_concept, status, compatibility_score)
    values (p_name, p_concept, 'Building', 90) returning id into new_team;
  insert into team_members (team_id, user_id, role, contribution, current_tasks)
    values (new_team, auth.uid(), 'CEO / Founder', 80, 0);
  for i in 1..coalesce(array_length(p_member_ids, 1), 0) loop
    insert into team_members (team_id, user_id, role, contribution, current_tasks)
      values (new_team, p_member_ids[i], p_roles[i], 50, 0)
      on conflict (team_id, user_id) do nothing;
  end loop;
  insert into businesses (team_id, name, stage, health, progress)
    values (new_team, 'New Business', 'MVP Development', 70, 0);
  return new_team;
end; $$;

create or replace function accept_invite(p_invite_id uuid)
returns void language plpgsql security definer as $$
declare inv record;
begin
  select * into inv from invites
    where id = p_invite_id and to_user = auth.uid() and status = 'pending';
  if inv is null then return; end if;
  insert into team_members (team_id, user_id, role, contribution, current_tasks)
    values (inv.team_id, auth.uid(), coalesce(inv.preferred_role, 'Member'), 50, 0)
    on conflict (team_id, user_id) do nothing;
  update invites set status = 'accepted' where id = p_invite_id;
end; $$;
