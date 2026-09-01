-- Teamrise schema: 0004_rbac.sql
-- Server-enforced role-based access control.
-- Adds `team_role` to team_members and restricts member management to
-- Admins / Team Leads. Team data (tasks, milestones, ...) stays editable by
-- any team member (small founding teams), which is intended for this product.

-- 1) Role column on team_members (backfilled to 'Member')
alter table team_members add column if not exists team_role text not null default 'Member';
-- Promote existing founders to Admin so they can manage the team.
update team_members set team_role = 'Admin'
  where role ilike '%founder%' or role ilike '%ceo%' or team_role = 'Admin';

-- 2) Helper: is the current user an admin/lead of a team?
create or replace function is_team_admin(tid uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from team_members tm
    where tm.team_id = tid and tm.user_id = auth.uid()
      and tm.team_role in ('Admin', 'Team Lead')
  );
$$;

-- 3) Replace the broad team_members policies with admin-scoped management.
drop policy if exists tm_insert_self on team_members;
drop policy if exists tm_write on team_members;
create policy "tm_read" on team_members for select to authenticated using (is_team_member(team_id));
create policy "tm_insert_admin" on team_members for insert to authenticated
  with check (is_team_admin(team_id) or auth.uid() = user_id);
create policy "tm_update_admin" on team_members for update to authenticated
  using (is_team_admin(team_id)) with check (is_team_admin(team_id));
create policy "tm_delete_admin" on team_members for delete to authenticated
  using (is_team_admin(team_id));

-- 4) Founder created via the RPC becomes Admin (instead of default 'Member').
create or replace function create_team_with_members(
  p_name text, p_concept text, p_member_ids uuid[], p_roles text[]
) returns uuid language plpgsql security definer as $$
declare new_team uuid;
begin
  insert into teams (name, business_concept, status, compatibility_score)
    values (p_name, p_concept, 'Building', 90) returning id into new_team;
  insert into team_members (team_id, user_id, role, team_role, contribution, current_tasks)
    values (new_team, auth.uid(), 'CEO / Founder', 'Admin', 80, 0);
  for i in 1..coalesce(array_length(p_member_ids, 1), 0) loop
    insert into team_members (team_id, user_id, role, team_role, contribution, current_tasks)
      values (new_team, p_member_ids[i], p_roles[i], 'Member', 50, 0)
      on conflict (team_id, user_id) do nothing;
  end loop;
  insert into businesses (team_id, name, stage, health, progress)
    values (new_team, 'New Business', 'MVP Development', 70, 0);
  return new_team;
end; $$;
