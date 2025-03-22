import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getCurrentUser } from "../actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <main>
      <div>{children}</div>
    </main>
  );
}
