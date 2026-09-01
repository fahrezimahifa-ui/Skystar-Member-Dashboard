-- Team creation / invite acceptance RPCs.
-- Run this in the Supabase SQL editor of the new project (obzgblinpqraccfyxxpz).
-- Idempotent: uses CREATE OR REPLACE so it is safe to re-run.

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
