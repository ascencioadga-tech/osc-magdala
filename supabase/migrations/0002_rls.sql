-- One Step Closer — row level security (Magdala workspace)
-- Run AFTER 0001_schema.sql.
--
-- The premise: a volunteer running the check-in desk and the lead pastor
-- must not see the same thing. Someone's counseling notes, or the fact that
-- they lost a spouse three years ago this week, is pastoral information —
-- not directory information.
--
-- Roles, narrowest to widest:
--   volunteer  — directory basics. Name, household, contact. Nothing else.
--   staff      — the above, plus groups, serving, attendance, follow-ups.
--   pastor     — everything, including care notes and memorial dates.
--   admin      — everything, plus user management.
--
-- Public (anon) can do exactly one thing: insert a Connect submission.
-- It cannot read that table back, or read anything else at all.

-- ============================================================ helpers

create or replace function auth_role() returns staff_role as $$
  select role from staff_users where id = auth.uid() and active limit 1;
$$ language sql stable security definer;

create or replace function is_pastor() returns boolean as $$
  select coalesce(auth_role() in ('pastor', 'admin'), false);
$$ language sql stable security definer;

create or replace function is_staff() returns boolean as $$
  select coalesce(auth_role() in ('staff', 'pastor', 'admin'), false);
$$ language sql stable security definer;

create or replace function is_team() returns boolean as $$
  select coalesce(auth_role() is not null, false);
$$ language sql stable security definer;

-- ============================================================ enable RLS everywhere

alter table households          enable row level security;
alter table people              enable row level security;
alter table contact_methods     enable row level security;
alter table relationships       enable row level security;
alter table key_dates           enable row level security;
alter table milestones          enable row level security;
alter table ministries          enable row level security;
alter table serving             enable row level security;
alter table groups              enable row level security;
alter table group_members       enable row level security;
alter table care_notes          enable row level security;
alter table care_interactions   enable row level security;
alter table prayer_requests     enable row level security;
alter table follow_ups          enable row level security;
alter table attendance          enable row level security;
alter table tags                enable row level security;
alter table person_tags         enable row level security;
alter table consents            enable row level security;
alter table connect_submissions enable row level security;
alter table staff_users         enable row level security;
alter table audit_log           enable row level security;

-- ============================================================ the directory
-- Anyone on the team can read people and households; staff and above can write.

create policy people_read on people
  for select using (is_team());
create policy people_write on people
  for all using (is_staff()) with check (is_staff());

create policy households_read on households
  for select using (is_team());
create policy households_write on households
  for all using (is_staff()) with check (is_staff());

create policy contact_read on contact_methods
  for select using (is_team());
create policy contact_write on contact_methods
  for all using (is_staff()) with check (is_staff());

create policy relationships_read on relationships
  for select using (is_team());
create policy relationships_write on relationships
  for all using (is_staff()) with check (is_staff());

-- ============================================================ key dates
-- The important one. Birthdays are fine for anyone on the team; memorials
-- and anything flagged sensitive are pastors only.

create policy key_dates_read_ordinary on key_dates
  for select using (is_team() and not is_sensitive);

create policy key_dates_read_sensitive on key_dates
  for select using (is_pastor());

create policy key_dates_write on key_dates
  for all using (is_staff()) with check (is_staff());

-- ============================================================ care
-- Pastoral notes never reach a volunteer or general staff. Full stop.

create policy care_notes_pastor_only on care_notes
  for all using (is_pastor()) with check (is_pastor());

create policy care_interactions_read on care_interactions
  for select using (is_staff());
create policy care_interactions_write on care_interactions
  for all using (is_staff()) with check (is_staff());

-- Prayer requests: private ones are pastors only.
create policy prayer_read_public on prayer_requests
  for select using (is_staff() and not is_private);
create policy prayer_read_private on prayer_requests
  for select using (is_pastor());
create policy prayer_write on prayer_requests
  for all using (is_staff()) with check (is_staff());

-- ============================================================ church life

create policy milestones_read on milestones for select using (is_team());
create policy milestones_write on milestones for all using (is_staff()) with check (is_staff());

create policy ministries_read on ministries for select using (is_team());
create policy ministries_write on ministries for all using (is_staff()) with check (is_staff());

create policy serving_read on serving for select using (is_team());
create policy serving_write on serving for all using (is_staff()) with check (is_staff());

create policy groups_read on groups for select using (is_team());
create policy groups_write on groups for all using (is_staff()) with check (is_staff());

create policy group_members_read on group_members for select using (is_team());
create policy group_members_write on group_members for all using (is_staff()) with check (is_staff());

create policy attendance_read on attendance for select using (is_staff());
create policy attendance_write on attendance for all using (is_staff()) with check (is_staff());

create policy follow_ups_read on follow_ups for select using (is_staff());
create policy follow_ups_write on follow_ups for all using (is_staff()) with check (is_staff());

create policy tags_read on tags for select using (is_team());
create policy tags_write on tags for all using (is_staff()) with check (is_staff());

create policy person_tags_read on person_tags for select using (is_team());
create policy person_tags_write on person_tags for all using (is_staff()) with check (is_staff());

-- ============================================================ consent
-- Read-only to the team; only the server (service_role) writes it, so a
-- consent record always traces back to a real form submission.

create policy consents_read on consents for select using (is_staff());

-- ============================================================ connect form
-- The public may submit, and nothing more. No select policy exists for anon,
-- so submissions cannot be read back by the browser that wrote them.

-- NOTE: the browser must insert WITHOUT chaining .select(). Postgres treats
-- the returned row as a read, and anon deliberately has no select policy
-- here, so `.insert(x).select()` fails while `.insert(x)` succeeds.
create policy connect_public_insert on connect_submissions
  for insert to anon, authenticated with check (true);

create policy connect_staff_read on connect_submissions
  for select using (is_staff());

create policy connect_staff_update on connect_submissions
  for update using (is_staff()) with check (is_staff());

-- ============================================================ staff & audit

create policy staff_read_self on staff_users
  for select using (id = auth.uid() or is_staff());
create policy staff_admin_write on staff_users
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

create policy audit_admin_read on audit_log
  for select using (auth_role() = 'admin');
-- Nobody may edit or delete the audit trail; inserts come from the server.

-- ============================================================ notes
--
-- Views (upcoming_dates, people_directory) inherit the policies of the
-- tables beneath them, so memorial dates stay pastor-only through the view
-- as well. Worth re-verifying after any change to either.
--
-- To grant someone access, insert into staff_users with their auth.users id:
--
--   insert into staff_users (id, email, full_name, role)
--   values ('<auth-uuid>', 'eamon@onestepcloser.org', 'Fr. Eamon Kelly, LC', 'pastor');
--
-- Anyone not in staff_users sees nothing at all.
