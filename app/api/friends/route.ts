import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { isDemo } from "../../../lib/demo";

/*
  Receiving a new friend of the work.

  The one rule this route exists to honour: NEVER TELL SOMEONE WE HAVE THEIR
  PRAYER REQUEST WHEN WE DO NOT. The form this replaces (in the church build
  this was ported from) called preventDefault and showed a thank-you screen
  without sending anything anywhere — while promising the person that if they
  had asked for prayer "it's already with our pastors". It wasn't.

  So every path below returns honestly:
    • saved    — it is in Postgres
    • demo     — no database is connected; nothing was stored, and the form
                 says so rather than thanking them
    • error    — the write failed; the form keeps their answers and says so

  Two-phase write, as the original did correctly: the raw payload lands in
  connect_submissions BEFORE any parsing into people/contacts/intentions, so a
  bug in the parsing can never cost someone the five minutes they just spent.
*/

type Payload = {
  firstName?: string;
  lastName?: string;
  tradition?: string;
  church?: string;
  city?: string;
  country?: string;
  languages?: string[];
  email?: string;
  phone?: string;
  origin?: string;
  intention?: string;
  mayWeWrite?: boolean;
};

const clean = (v?: string) => {
  const t = (v ?? "").trim();
  return t.length ? t.slice(0, 2000) : undefined;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "error" }, { status: 400 });
  }

  const first = clean(body.firstName);
  const last = clean(body.lastName);
  if (!first || !last) {
    return NextResponse.json(
      { ok: false, reason: "error", message: "A first and last name are needed." },
      { status: 400 },
    );
  }

  /*
    No database configured. We could show a thank-you and pretend — that is
    precisely the failure this route was written against. Instead we say what
    is true, and the form keeps the answers on the device.
  */
  if (isDemo() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      ok: false,
      reason: "demo",
      message:
        "This form isn't connected to a database yet, so nothing was saved. Your answers are still on this device.",
    });
  }

  const db = getSupabaseAdmin();

  // ---- phase one: keep the raw submission no matter what happens next ----
  const raw = await db
    .from("connect_submissions")
    .insert({ payload: body as never } as never);
  if (raw.error) {
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }

  // ---- phase two: parse it into the record proper ----
  try {
    const person = await db
      .from("people")
      .insert({
        first_name: first,
        last_name: last,
        status: "guest",
        tradition: clean(body.tradition),
        church: clean(body.church),
        city: clean(body.city),
        country: clean(body.country),
        languages: body.languages?.length ? body.languages : null,
        how_they_heard: clean(body.origin),
        first_visit_at: new Date().toISOString().slice(0, 10),
      } as never)
      .select("id")
      .single();

    if (person.error || !person.data) throw person.error ?? new Error("no id");
    const personId = (person.data as { id: string }).id;

    const contacts: Record<string, unknown>[] = [];
    if (clean(body.email))
      contacts.push({ person_id: personId, kind: "email", value: clean(body.email), is_primary: true });
    if (clean(body.phone))
      contacts.push({ person_id: personId, kind: "mobile", value: clean(body.phone), is_primary: true });
    if (contacts.length) await db.from("contact_methods").insert(contacts as never);

    // Consent is recorded per channel, and only where they actually said yes.
    // Messaging reads this before counting an audience, so an unchecked box
    // here means they can never be swept into a send.
    if (body.mayWeWrite) {
      const rows = [
        clean(body.email) && { person_id: personId, channel: "email", granted: true },
        clean(body.phone) && { person_id: personId, channel: "sms", granted: true },
      ].filter(Boolean);
      if (rows.length) await db.from("consents").insert(rows as never);
    }

    if (clean(body.intention)) {
      await db.from("prayer_requests").insert({
        person_id: personId,
        submitted_name: `${first} ${last}`,
        body: clean(body.intention),
        is_private: true,
      } as never);
    }

    // Somebody should actually meet them.
    const due = new Date();
    due.setDate(due.getDate() + 3);
    await db.from("follow_ups").insert({
      person_id: personId,
      reason: "New friend of the work",
      due_on: due.toISOString().slice(0, 10),
    } as never);

    return NextResponse.json({ ok: true, reason: "saved" });
  } catch {
    /*
      The raw submission is safe in phase one, so this is recoverable by hand.
      We still tell them it didn't go through: a half-write they can't see is
      not something to thank someone for.
    */
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }
}
