-- One Step Closer — member care schema (Magdala)
-- Run in Supabase: SQL Editor → paste → Run. Then 0002_rls.sql.
--
-- Design principles:
--
--  1. Households are first class. One Connect form submission creates a
--     household and several people, because that's how families actually
--     arrive. Most church databases bolt this on later and regret it.
--
--  2. Recurring dates live in ONE table. A birthday, a wedding anniversary,
--     a baptism anniversary and the anniversary of a death are all "a date
--     that comes around every year and deserves a pastor's attention." One
--     table means one care engine, and a new date type costs nothing.
--
--  3. Nothing is ever deleted. People leave, come back, and get merged.
--     `archived_at` everywhere; hard deletes lose history you can't recover.
--
--  4. Sensitive data is separated, not mixed in. Pastoral notes and memorial
--     dates sit in their own tables so row-level security can protect them
--     without locking down the whole directory. See 0002_rls.sql.
--
--  5. Consent is recorded per channel, with a timestamp and a source. This
--     is a legal requirement for SMS, not a nicety.

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";      -- fast fuzzy name search

-- ============================================================ enums

create type person_status as enum (
  'guest',        -- visited, we have a name
  'regular',      -- attends, not formally a member
  'member',       -- committed
  'inactive',     -- drifted; still cared for
  'moved'         -- left the area
);

create type household_role as enum ('head', 'spouse', 'child', 'other');

create type date_kind as enum (
  'birthday',
  'anniversary',        -- wedding
  'memorial',           -- a loved one's passing
  'baptism',
  'salvation',
  'membership',
  'other'
);

create type contact_kind as enum ('mobile', 'home', 'work', 'email');

create type consent_channel as enum ('sms', 'email', 'push', 'mail');

create type care_kind as enum (
  'note',               -- general pastoral note
  'visit',
  'call',
  'meal',
  'hospital',
  'counseling',
  'benevolence'
);

create type followup_status as enum ('open', 'in_progress', 'done', 'dismissed');

create type prayer_status as enum ('new', 'praying', 'answered', 'closed');

create type staff_role as enum (
  'admin',              -- everything, incl. user management
  'pastor',             -- everything pastoral, incl. notes + memorials
  'staff',              -- directory, events, messaging; no pastoral notes
  'volunteer'           -- directory basics only
);

-- ============================================================ households

create table households (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,                    -- "The Whitfield Family"
  address_line1 text,
  address_line2 text,
  city          text,
  state         text default 'NC',
  postal_code   text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  archived_at   timestamptz
);

-- ============================================================ people

create table people (
  id             uuid primary key default uuid_generate_v4(),
  household_id   uuid references households(id) on delete set null,
  household_role household_role default 'other',

  first_name     text not null,
  last_name      text not null,
  goes_by        text,               -- "Bob" when the legal name is Robert
  middle_name    text,
  maiden_name    text,               -- older members are often known by both

  status         person_status not null default 'guest',
  date_of_birth  date,               -- also seeded into key_dates
  gender         text,               -- free text on purpose; not our business to constrain
  photo_url      text,

  -- church life
  first_visit_at date,
  member_since   date,
  how_they_heard text,
  campus         text default 'Wallburg',

  -- practical, and genuinely useful pastorally
  occupation     text,
  employer       text,
  school         text,               -- for students
  grade          text,

  -- kids' check-in essentials
  allergies      text,
  medical_notes  text,

  emergency_contact_name  text,
  emergency_contact_phone text,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  archived_at    timestamptz,

  -- Set by the trigger below; drives fast search.
  search_text    text
);

create index people_household_idx on people(household_id);
create index people_status_idx    on people(status) where archived_at is null;
create index people_search_idx    on people using gin (search_text gin_trgm_ops);

-- ============================================================ contact methods
-- Multiple per person: a mobile, a work email, a spouse's shared line.

create table contact_methods (
  id         uuid primary key default uuid_generate_v4(),
  person_id  uuid not null references people(id) on delete cascade,
  kind       contact_kind not null,
  value      text not null,
  is_primary boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index contact_person_idx on contact_methods(person_id);
create unique index contact_one_primary_per_kind
  on contact_methods(person_id, kind) where is_primary;

-- ============================================================ relationships
-- Beyond the household: grandparents, guardians, adult children elsewhere.

create table relationships (
  id           uuid primary key default uuid_generate_v4(),
  person_id    uuid not null references people(id) on delete cascade,
  related_id   uuid not null references people(id) on delete cascade,
  relation     text not null,        -- spouse | parent | child | sibling | guardian | grandparent
  created_at   timestamptz not null default now(),
  check (person_id <> related_id)
);

create unique index relationship_unique on relationships(person_id, related_id, relation);

-- ============================================================ key dates
-- The heart of the care engine. Everything that comes around yearly.

create table key_dates (
  id          uuid primary key default uuid_generate_v4(),
  person_id   uuid not null references people(id) on delete cascade,
  kind        date_kind not null,
  date        date not null,
  label       text,                  -- "Gene Caldwell" for a memorial
  relation    text,                  -- "husband", "mother"
  is_sensitive boolean not null default false,   -- memorials default true, see trigger
  notes       text,
  created_at  timestamptz not null default now(),
  created_by  uuid
);

create index key_dates_person_idx on key_dates(person_id);
create index key_dates_kind_idx   on key_dates(kind);
-- Lets the care engine ask "whose date falls in the next N days?" cheaply.
create index key_dates_md_idx     on key_dates((extract(month from date)), (extract(day from date)));

-- ============================================================ milestones
-- Their story with One Step Closer. Point-in-time, not recurring.

create table milestones (
  id         uuid primary key default uuid_generate_v4(),
  person_id  uuid not null references people(id) on delete cascade,
  label      text not null,          -- "First pilgrimage", "Joined the campaign"
  date       date not null,
  notes      text,
  created_at timestamptz not null default now(),
  created_by uuid
);

create index milestones_person_idx on milestones(person_id);

-- ============================================================ ministries & serving

create table ministries (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  description text,
  leader_id   uuid references people(id) on delete set null,
  active      boolean not null default true
);

create table serving (
  id           uuid primary key default uuid_generate_v4(),
  person_id    uuid not null references people(id) on delete cascade,
  ministry_id  uuid not null references ministries(id) on delete cascade,
  role         text,
  started_on   date default current_date,
  ended_on     date,                 -- null = currently serving
  is_interest  boolean not null default false,  -- true = wants to, hasn't started
  created_at   timestamptz not null default now()
);

create index serving_person_idx   on serving(person_id);
create index serving_ministry_idx on serving(ministry_id);

-- ============================================================ groups

create table groups (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  meets_on    text,                  -- "Tuesdays, 7pm"
  location    text,
  leader_id   uuid references people(id) on delete set null,
  capacity    int,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table group_members (
  id         uuid primary key default uuid_generate_v4(),
  group_id   uuid not null references groups(id) on delete cascade,
  person_id  uuid not null references people(id) on delete cascade,
  is_leader  boolean not null default false,
  joined_on  date default current_date,
  left_on    date,
  unique (group_id, person_id)
);

create index group_members_person_idx on group_members(person_id);

-- ============================================================ care
-- Pastoral notes. Sensitive by definition — locked down in 0002_rls.sql.

create table care_notes (
  id           uuid primary key default uuid_generate_v4(),
  person_id    uuid not null references people(id) on delete cascade,
  kind         care_kind not null default 'note',
  body         text not null,
  occurred_on  date default current_date,
  is_confidential boolean not null default true,
  author_id    uuid,
  created_at   timestamptz not null default now()
);

create index care_notes_person_idx on care_notes(person_id);

-- Every contact: a call, a text, a hospital visit. Answers "when did
-- anyone last reach out to this person?"
create table care_interactions (
  id          uuid primary key default uuid_generate_v4(),
  person_id   uuid not null references people(id) on delete cascade,
  channel     text not null,         -- call | text | email | in_person | visit
  summary     text,
  occurred_at timestamptz not null default now(),
  staff_id    uuid
);

create index care_interactions_person_idx on care_interactions(person_id, occurred_at desc);

-- ============================================================ prayer & follow-up

create table prayer_requests (
  id          uuid primary key default uuid_generate_v4(),
  person_id   uuid references people(id) on delete set null,
  submitted_name text,               -- if they aren't in the database yet
  body        text not null,
  status      prayer_status not null default 'new',
  is_private  boolean not null default true,
  answered_note text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table follow_ups (
  id           uuid primary key default uuid_generate_v4(),
  person_id    uuid references people(id) on delete cascade,
  reason       text not null,        -- "First-time guest", "Asked about baptism"
  status       followup_status not null default 'open',
  assigned_to  uuid,
  due_on       date,
  completed_at timestamptz,
  notes        text,
  created_at   timestamptz not null default now()
);

create index follow_ups_status_idx on follow_ups(status, due_on);

-- ============================================================ attendance

create table attendance (
  id         uuid primary key default uuid_generate_v4(),
  person_id  uuid not null references people(id) on delete cascade,
  service_on date not null,
  service    text,                   -- "8:30" | "10:00"
  method     text,                   -- check_in | manual | connect_form
  created_at timestamptz not null default now(),
  unique (person_id, service_on, service)
);

create index attendance_date_idx on attendance(service_on desc);

-- ============================================================ tags
-- Flexible labels for anything the schema didn't anticipate.

create table tags (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null unique,
  color text
);

create table person_tags (
  person_id uuid not null references people(id) on delete cascade,
  tag_id    uuid not null references tags(id) on delete cascade,
  primary key (person_id, tag_id)
);

-- ============================================================ consent
-- Legally required for SMS. Timestamped, with the source recorded.

create table consents (
  id          uuid primary key default uuid_generate_v4(),
  person_id   uuid not null references people(id) on delete cascade,
  channel     consent_channel not null,
  granted     boolean not null,
  source      text,                  -- "connect_form" | "verbal" | "staff_entry"
  occurred_at timestamptz not null default now(),
  unique (person_id, channel, occurred_at)
);

create index consents_person_idx on consents(person_id, channel);

-- ============================================================ connect submissions
-- The raw form, kept verbatim. If parsing into people/households ever goes
-- wrong, the original is still here.

create table connect_submissions (
  id            uuid primary key default uuid_generate_v4(),
  payload       jsonb not null,
  person_id     uuid references people(id) on delete set null,
  household_id  uuid references households(id) on delete set null,
  processed_at  timestamptz,
  source        text default 'sunday_service',
  created_at    timestamptz not null default now()
);

create index connect_unprocessed_idx on connect_submissions(created_at desc)
  where processed_at is null;

-- ============================================================ staff & audit

create table staff_users (
  id         uuid primary key,       -- matches auth.users.id
  person_id  uuid references people(id) on delete set null,
  email      text not null unique,
  full_name  text,
  role       staff_role not null default 'volunteer',
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- Who read or changed what. Matters once real pastoral notes are in here.
create table audit_log (
  id         bigserial primary key,
  actor_id   uuid,
  action     text not null,          -- insert | update | delete | view_sensitive
  table_name text not null,
  row_id     uuid,
  detail     jsonb,
  created_at timestamptz not null default now()
);

create index audit_created_idx on audit_log(created_at desc);

-- ============================================================ triggers

create or replace function touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end $$ language plpgsql;

create trigger people_touch     before update on people     for each row execute function touch_updated_at();
create trigger households_touch before update on households for each row execute function touch_updated_at();
create trigger prayer_touch     before update on prayer_requests for each row execute function touch_updated_at();

-- Keep the search column current.
create or replace function people_search_refresh() returns trigger as $$
begin
  new.search_text =
    lower(concat_ws(' ',
      new.first_name, new.last_name, new.goes_by, new.maiden_name, new.middle_name));
  return new;
end $$ language plpgsql;

create trigger people_search before insert or update on people
  for each row execute function people_search_refresh();

-- A memorial is sensitive unless someone deliberately says otherwise.
create or replace function key_dates_default_sensitivity() returns trigger as $$
begin
  if new.kind = 'memorial' then
    new.is_sensitive = true;
  end if;
  return new;
end $$ language plpgsql;

create trigger key_dates_sensitivity before insert on key_dates
  for each row execute function key_dates_default_sensitivity();

-- A person's date_of_birth should always appear in key_dates, so the care
-- engine only ever has to read one table.
create or replace function sync_birthday_key_date() returns trigger as $$
begin
  if new.date_of_birth is not null then
    insert into key_dates (person_id, kind, date)
    values (new.id, 'birthday', new.date_of_birth)
    on conflict do nothing;
  end if;
  return new;
end $$ language plpgsql;

create trigger people_birthday after insert on people
  for each row execute function sync_birthday_key_date();

-- ============================================================ views

-- Everything the care engine needs, with days-until already computed.
create or replace view upcoming_dates as
select
  kd.id,
  kd.person_id,
  p.first_name,
  p.last_name,
  p.household_id,
  kd.kind,
  kd.date,
  kd.label,
  kd.relation,
  kd.is_sensitive,
  extract(year from age(current_date, kd.date))::int as years,
  (
    (date_trunc('day',
      make_date(
        extract(year from current_date)::int
          + case when make_date(extract(year from current_date)::int,
                                extract(month from kd.date)::int,
                                extract(day from kd.date)::int) < current_date
                 then 1 else 0 end,
        extract(month from kd.date)::int,
        extract(day from kd.date)::int)
    )::date) - current_date
  )::int as days_away
from key_dates kd
join people p on p.id = kd.person_id
where p.archived_at is null;

-- The directory row the Members list renders.
create or replace view people_directory as
select
  p.id,
  p.first_name,
  p.last_name,
  coalesce(p.goes_by, p.first_name) as display_name,
  p.status,
  p.date_of_birth,
  p.member_since,
  p.first_visit_at,
  h.name as household_name,
  h.id   as household_id,
  (select value from contact_methods c
    where c.person_id = p.id and c.kind = 'mobile' and c.is_primary limit 1) as mobile,
  (select value from contact_methods c
    where c.person_id = p.id and c.kind = 'email'  and c.is_primary limit 1) as email,
  (select count(*) from serving s
    where s.person_id = p.id and s.ended_on is null and not s.is_interest) as serving_count,
  (select count(*) from group_members g
    where g.person_id = p.id and g.left_on is null) as group_count
from people p
left join households h on h.id = p.household_id
where p.archived_at is null;

-- ============================================================ seed: ministries

insert into ministries (name) values
  ('Hospitality'), ('Pilgrimage Hosts'), ('Magdala Stone Evenings'),
  ('Prayer Team'), ('Benefactor Care'), ('Communications'),
  ('Volunteers on the Shore'), ('Translation')
on conflict (name) do nothing;
