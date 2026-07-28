# One Step Closer — Magdala Workspace

The private console for Fr. Eamon Kelly, LC and the One Step Closer team at
Magdala. Members, their dates and their care in one place, plus the messages
that reach them.

**It lives in this app**, at `/workspace` (console) and `/welcome` (the public
form) — one Next app, one deploy, one domain. It was built separately at first
and merged in on 2026-07-28, so the footer buttons are plain routes and there
is no second site to configure.

Ported from the HopeCity ministry workspace and rebranded to the OSC/Magdala
design system, which this site already defined — wine, brown, gold-light,
cream and ink are the same tokens, so the console needed almost no CSS of its
own.

---

## Getting it running

The site's own `npm run dev` serves it. The console needs these in
`.env.local`:

`.env.local` currently holds **placeholders**. Real values come from OSC's own
Supabase project (Settings → API):

| Variable | Where it's used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server (RLS applies) |
| `SUPABASE_SERVICE_ROLE_KEY` | server only — bypasses RLS, never expose |

> OSC must have its **own Supabase project**. Do not point this at HopeCity's:
> that is a different church's member data, and the two must never share a
> database.

### Database

Run the migrations in order against the OSC project:

```
supabase/migrations/0001_schema.sql      -- tables, triggers, views
supabase/migrations/0002_rls.sql         -- row-level security (run second)
supabase/migrations/0003_osc_fields.sql  -- tradition, church, city, country, languages
```

Then grant the first person access. **Signing in is not the same as having
access** — an authenticated account with no row in `staff_users` is turned
away at the door:

```sql
insert into staff_users (id, email, full_name, role)
values ('<auth-uuid>', 'eamon@onestepcloser.org', 'Fr. Eamon Kelly, LC', 'pastor');
```

Roles, narrowest to widest: `volunteer` → `staff` → `pastor` → `admin`.
Memorial dates and care notes are **pastor-only**, enforced by Postgres rather
than by the UI remembering to hide them.

---

## What's actually built

| Screen | State |
|---|---|
| **Login** `/workspace` | Real Supabase auth. Password reset works. Vague error text on purpose. |
| **Overview** `/workspace/dashboard` | App launcher + milestone notice, computed from real records. |
| **Friends** `/workspace/friends` | The complete screen. Segments, search, sort, detail drawer with contact, involvement, key dates, memorials, milestones, household. **Read-only.** |
| **Messages** `/workspace/messages` | Audiences, consent-filtered counts, cost estimate, pastoral queue, and a block-based email composer with live preview. |

Three apps, deliberately. Nothing is dimmed or tagged "soon" — the sidebar
shows only what actually works.

### Demo mode

Set in `.env.local` so the workspace can be opened before the database exists:

```
WORKSPACE_DEMO=1
NEXT_PUBLIC_WORKSPACE_DEMO=1
WORKSPACE_DEMO_USER=Eamon
WORKSPACE_DEMO_PASSWORD=Magdala!
```

It is built to fail closed: it does nothing unless `WORKSPACE_DEMO=1`, and it
**switches itself off** the moment `NEXT_PUBLIC_SUPABASE_URL` points at a real
project — so it cannot survive into production by being forgotten. Delete those
four lines once Supabase is live, and delete `lib/demo.ts` with them.

**The directory opens empty.** `lib/demo-friends.ts` holds 100 invented friends of the work —
coherent households, key dates, memorials, prayer intentions and pastoral
notes — for showing the depth the workspace can hold. They are switched off:

```ts
// lib/demo.ts
const LOAD_DEMO_FRIENDS = false;   // ← true to populate the demo
```

Flip that one line to show them; nothing else changes. They are generated with
relative date offsets, so the week's pastoral queue is always populated rather
than decaying after a week.

### The welcome form — `/welcome`

Public, no login: the page you open on a tablet and hand to someone after a
Stone evening, or QR onto a card at the end of a pilgrimage. Linked from
Friends ("Welcome someone →").

It is deliberately **not** a parish connect card. A parish card asks which
service you attended, because it assumes you are joining that parish. Nobody
joins Magdala — people arrive already belonging somewhere, and the point is
that they belong to *different* somewheres. So the two questions at its centre
are the ones a single-parish form would never ask: **your Christian tradition**
and **your community**. The word for that community follows the answer — a
Catholic has a parish, a Baptist a church, a Messianic Jew a congregation, and
someone still finding their way is asked for "your community, if you have one".

`POST /api/friends` does a two-phase write: the raw payload lands in
`connect_submissions` before any parsing, so a parsing bug can never cost
someone the five minutes they just spent. It then creates the person, contact
methods, per-channel consent (only where they said yes — messaging reads this
before counting an audience), the prayer intention, and a follow-up.

**It never claims a success that didn't happen.** With no database configured
it returns `reason: "demo"` and the form says plainly that nothing was saved
and the answers are still on the device. This is deliberate: the church form
this was ported from called `preventDefault()` and showed a thank-you screen
without sending anything anywhere — while telling the person that if they had
asked for prayer, "it's already with our pastors". It wasn't.

### Not wired yet — be honest with Fr. Eamon about these

1. **Nothing sends.** There is no Resend/Twilio integration and no send route.
   The Messages screen composes and previews; the Send button is a local state
   change. Before it can send for real: a suppression list, a working
   `{{unsubscribe}}` substitution (currently a literal placeholder in
   `lib/email.ts`), delivery logging, and a `messages` table — none of which
   exist yet.
2. **No member create/edit UI.** Records can only be added by SQL or by an
   import. Memorial dates — the emotional core of the product — have no entry
   screen.
3. **No Planning Center integration.** If OSC ever runs PCO, "the workspace is
   the interface, PCO is the vault" is not implemented anywhere; Supabase is
   the system of record here.
4. **Events and films are hardcoded** in `lib/events.ts` and `lib/sermons.ts`
   with dates that need confirming. They move to Supabase when those apps are
   built.

---

## Notes for whoever works on this next

Things fixed during the port that were broken in the original — don't
reintroduce them:

- **The console now checks `staff_users`.** `proxy.ts` only proves *some*
  account is signed in; `requireStaff()` in the `(console)` route-group layout
  is what proves membership. The original defined that check and never called
  it.
- **Screens read real data.** Overview and Messages are server components that
  fetch members and pass them down. They previously read an empty seed array,
  so every count rendered `0` and the screens looked calm because they were
  blind. `SEED_MEMBERS` is now permanently empty — do not repopulate it.
- **Reads are paged.** PostgREST silently truncates an unbounded select at
  1,000 rows. With ~1,000 people, `contact_methods` alone exceeds that, so the
  tail would vanish and those people would look unreachable. See `fetchAll()`
  in `lib/queries.ts`.
- **Households group on `householdId`, never the display name.** Matching on
  the label fused every unrelated family sharing a surname.
- **Audiences are consent-filtered.** `reachable()` takes a `ConsentIndex`;
  missing consent is treated as "no". The count on the button should always be
  the number of people who may lawfully be contacted.
- **SMS cost accounts for UCS-2.** One em-dash drops a segment from 160 to 70
  characters, and the pastoral drafts are full of them.
- **The signed-in person is read from the session**, not hardcoded in the
  header.
