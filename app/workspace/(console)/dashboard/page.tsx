import { fetchMembers } from "../../../../lib/queries";
import DashboardClient from "../../../../components/workspace/DashboardClient";

/*
  Overview is a server page so the milestone notice is computed from real
  records. It previously read an empty seed array, which meant the greeting
  could never surface anyone — the screen looked calm because it was blind.
*/

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const members = await fetchMembers();
  return <DashboardClient members={members} />;
}
