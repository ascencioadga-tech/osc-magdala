import { fetchMembers } from "../../../../lib/queries";
import MessagesClient from "../../../../components/workspace/MessagesClient";

/*
  Messages is a server page for the same reason Overview is: audience counts,
  the pastoral queue and the person picker all have to come from the real
  directory. Reading a seed array meant every count rendered 0 and the Send
  button was permanently disabled — the screen was a drawing of itself.
*/

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const members = await fetchMembers();
  return <MessagesClient members={members} />;
}
