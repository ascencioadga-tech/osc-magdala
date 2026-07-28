-- One Step Closer — the fields Magdala needs that a parish database doesn't.
-- Run AFTER 0001_schema.sql and 0002_rls.sql.
--
-- The schema was inherited from a single-parish church, where everyone shares
-- a tradition, a building and a town. At Magdala none of that holds: the whole
-- point of the work is that the people belong to different confessions and
-- arrive from everywhere. So the record has to carry where someone is from,
-- what language to write to them in, and — the one that matters most here —
-- which Christian tradition is theirs and what community they belong to.

alter table people
  add column if not exists tradition  text,        -- Catholic, Orthodox, Anglican …
  add column if not exists church     text,        -- their parish / congregation
  add column if not exists city       text,
  add column if not exists country    text,
  add column if not exists languages  text[];      -- so nobody is written to in a language they merely tolerate

comment on column people.tradition is
  'Christian tradition, free text against a suggested list. Never constrain this to an enum: the point of the work is that the list is longer than we think, and someone who is still finding their way must be able to say so.';
comment on column people.church is
  'The community they belong to — parish, congregation, assembly. Free text on purpose.';

-- "Campus: Wallburg" was the inherited parish's own building. Nothing at
-- Magdala has campuses, and a default that quietly stamps every new person
-- with a North Carolina address is worse than an empty column.
alter table people alter column campus drop default;
update people set campus = null where campus = 'Wallburg';

-- Searching by tradition or town should be as fast as searching by name.
create index if not exists people_tradition_idx on people(tradition) where archived_at is null;
create index if not exists people_country_idx   on people(country)   where archived_at is null;

-- Fold the new fields into the existing search trigger, so "Orthodox" and
-- "Monterrey" both find people the way a surname does.
create or replace function people_search_refresh() returns trigger as $$
begin
  new.search_text :=
    lower(concat_ws(' ',
      new.first_name, new.last_name, new.goes_by, new.middle_name, new.maiden_name,
      new.tradition, new.church, new.city, new.country));
  return new;
end;
$$ language plpgsql;

-- Existing rows need their search text rebuilt once.
update people set updated_at = updated_at;
