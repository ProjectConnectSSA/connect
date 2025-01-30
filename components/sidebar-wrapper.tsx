import { getCurrentUser } from "@/app/actions";
import DashboardSidebar from "./dashboard/sidebar";

export async function SidebarWrapper() {
    const user = await getCurrentUser();
    return <DashboardSidebar user={user} />;
  }
