import { requireStaff } from "../../../lib/supabase-server";
import { StaffProvider } from "../../../components/workspace/StaffContext";

/*
  The console gate.

  Everything in this route group — Overview, Members, Messages — renders only
  after requireStaff() confirms the signed-in account has an active row in
  staff_users. The login page sits outside this group, so it stays reachable.

  This runs on the server before any child renders, so a non-staff account
  never receives console markup at all.
*/

export const dynamic = "force-dynamic";

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await requireStaff();

  return (
    <StaffProvider
      value={{
        full_name: staff.full_name,
        role: staff.role,
        email: staff.email,
      }}
    >
      {children}
    </StaffProvider>
  );
}
