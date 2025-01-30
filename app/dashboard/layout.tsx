import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getCurrentUser } from "../actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex h-screen">
      <DashboardSidebar user={user} />
      <main className="flex-1 overflow-y-auto m-4">
        <div className="w-full py-6">{children}</div>
      </main>
    </div>
  );
}
