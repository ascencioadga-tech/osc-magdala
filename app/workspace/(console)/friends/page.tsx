import { fetchMembers } from "../../../../lib/queries";
import MembersClient from "../../../../components/workspace/MembersClient";

/*
  Server component: reads Supabase at request time and hands the result to
  the client UI. Fetching here rather than from the browser means no member
  data endpoint is exposed publicly, and the service_role key never leaves
  the server.
*/

// Always fresh — someone filling the Connect form during a service should
// appear on the next load, not after a cache expires.
export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await fetchMembers();
  return <MembersClient members={members} />;
}
