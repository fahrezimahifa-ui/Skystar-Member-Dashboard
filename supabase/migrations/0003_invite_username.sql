-- Teamrise schema: 0003_invite_username.sql
-- Adds a queryable `username` for invite-by-username, and a trigger that
-- notifies the invitee when an invite is created.

-- 1) Username column (derived from the synthetic auth email prefix)
alter table profiles add column if not exists username text unique;
update profiles set username = split_part(coalesce(email, id), '@', 1) where username is null;
create index if not exists profiles_username_idx on profiles (username);

-- 2) Notify the recipient whenever an invite is created
create or replace function notify_on_invite()
returns trigger language plpgsql security definer as $$
declare tname text;
begin
  select name into tname from teams where id = new.team_id;
  insert into notifications (user_id, category, title, body, date, read, priority)
  values (
    new.to_user,
    'invitation',
    coalesce('Invite to ' || tname, 'Team invite'),
    'A teammate invited you to join their team.',
    current_date,
    false,
    'medium'
  );
  return new;
end; $$;

drop trigger if exists on_invite_created on invites;
create trigger on_invite_created after insert on invites
  for each row execute function notify_on_invite();
