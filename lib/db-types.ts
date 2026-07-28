// Types mirroring supabase/migrations/0001_schema.sql.
//
// Kept hand-written rather than generated, so the app has one readable
// contract with the database. If the schema changes, change this too.

export type PersonStatus = "guest" | "regular" | "member" | "inactive" | "moved";
export type HouseholdRole = "head" | "spouse" | "child" | "other";
export type ContactKind = "mobile" | "home" | "work" | "email";
export type ConsentChannel = "sms" | "email" | "push" | "mail";
export type FollowUpStatus = "open" | "in_progress" | "done" | "dismissed";
export type PrayerStatus = "new" | "praying" | "answered" | "closed";
export type StaffRole = "admin" | "pastor" | "staff" | "volunteer";

export type DateKind =
  | "birthday" | "anniversary" | "memorial"
  | "baptism" | "salvation" | "membership" | "other";

export type CareKind =
  | "note" | "visit" | "call" | "meal"
  | "hospital" | "counseling" | "benevolence";

export type Household = {
  id: string;
  name: string;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  notes?: string | null;
  created_at: string;
  archived_at?: string | null;
};

export type Person = {
  id: string;
  household_id?: string | null;
  household_role: HouseholdRole;

  first_name: string;
  last_name: string;
  goes_by?: string | null;
  middle_name?: string | null;
  maiden_name?: string | null;

  status: PersonStatus;
  date_of_birth?: string | null;
  gender?: string | null;
  photo_url?: string | null;

  first_visit_at?: string | null;
  member_since?: string | null;
  how_they_heard?: string | null;
  campus?: string | null;

  occupation?: string | null;
  employer?: string | null;
  school?: string | null;
  grade?: string | null;

  allergies?: string | null;
  medical_notes?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;

  created_at: string;
  archived_at?: string | null;
};

export type ContactMethod = {
  id: string;
  person_id: string;
  kind: ContactKind;
  value: string;
  is_primary: boolean;
};

export type KeyDate = {
  id: string;
  person_id: string;
  kind: DateKind;
  date: string;
  label?: string | null;     // "Gene Caldwell"
  relation?: string | null;  // "husband"
  is_sensitive: boolean;
  notes?: string | null;
};

export type Milestone = {
  id: string;
  person_id: string;
  label: string;
  date: string;
  notes?: string | null;
};

export type Ministry = { id: string; name: string; active: boolean };

export type Serving = {
  id: string;
  person_id: string;
  ministry_id: string;
  role?: string | null;
  started_on?: string | null;
  ended_on?: string | null;
  is_interest: boolean;
};

export type Group = {
  id: string;
  name: string;
  meets_on?: string | null;
  location?: string | null;
  leader_id?: string | null;
  active: boolean;
};

export type GroupMember = {
  id: string;
  group_id: string;
  person_id: string;
  is_leader: boolean;
  joined_on?: string | null;
  left_on?: string | null;
};

export type CareNote = {
  id: string;
  person_id: string;
  kind: CareKind;
  body: string;
  occurred_on?: string | null;
  is_confidential: boolean;
  author_id?: string | null;
  created_at: string;
};

export type CareInteraction = {
  id: string;
  person_id: string;
  channel: string;
  summary?: string | null;
  occurred_at: string;
  staff_id?: string | null;
};

export type PrayerRequest = {
  id: string;
  person_id?: string | null;
  submitted_name?: string | null;
  body: string;
  status: PrayerStatus;
  is_private: boolean;
  created_at: string;
};

export type FollowUp = {
  id: string;
  person_id?: string | null;
  reason: string;
  status: FollowUpStatus;
  assigned_to?: string | null;
  due_on?: string | null;
  completed_at?: string | null;
  notes?: string | null;
  created_at: string;
};

export type Consent = {
  id: string;
  person_id: string;
  channel: ConsentChannel;
  granted: boolean;
  source?: string | null;
  occurred_at: string;
};

export type ConnectSubmission = {
  id: string;
  payload: Record<string, unknown>;
  person_id?: string | null;
  household_id?: string | null;
  processed_at?: string | null;
  source?: string | null;
  created_at: string;
};

/* ---------- view rows ---------- */

// From the `upcoming_dates` view — days_away is computed in Postgres, so
// the care engine never has to do date maths in the browser.
export type UpcomingDate = {
  id: string;
  person_id: string;
  first_name: string;
  last_name: string;
  household_id?: string | null;
  kind: DateKind;
  date: string;
  label?: string | null;
  relation?: string | null;
  is_sensitive: boolean;
  years: number;
  days_away: number;
};

// From the `people_directory` view — one row per person, pre-joined.
export type DirectoryPerson = {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  status: PersonStatus;
  date_of_birth?: string | null;
  member_since?: string | null;
  first_visit_at?: string | null;
  household_name?: string | null;
  household_id?: string | null;
  mobile?: string | null;
  email?: string | null;
  serving_count: number;
  group_count: number;
};
