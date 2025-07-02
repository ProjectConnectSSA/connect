"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  // Main Navigation Icons
  Grid,
  Link as LinkIcon,
  FileText,
  Mail,
  LayoutTemplate,
  Contact,
  BarChart,
  Sparkles,

  // Account & Other Icons
  User,
  Settings,
  CreditCard,
  LogOut,
  ChevronRight,
  Rocket, // Changed from img to Rocket icon
} from "lucide-react";

// --- 1. Centralized Route Configuration ---
// We've combined all routes into one array of objects.
// Each object now contains an 'href', 'label', 'icon', a 'category' for grouping,
// and a 'bgColor' for the dynamic sidebar background.
type RouteCategory = "main" | "menu" | "account";

type RouteConfigItem = {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  category: RouteCategory;
  bgColor: string;
};

const routeConfig: RouteConfigItem[] = [
  // Standalone Dashboard
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Grid,
    category: "main",
    bgColor: "from-blue-600 to-purple-600",
  },

  // MENU Items
  {
    href: "/dashboard/links",
    label: "Bio Page",
    icon: LinkIcon,
    category: "menu",
    bgColor: "from-purple-500 to-pink-500",
  },
  {
    href: "/dashboard/forms",
    label: "Forms",
    icon: FileText,
    category: "menu",
    bgColor: "from-green-500 to-emerald-500",
  },
  {
    href: "/dashboard/emails",
    label: "Emails",
    icon: Mail,
    category: "menu",
    bgColor: "from-cyan-500 to-blue-500",
  },
  {
    href: "/dashboard/landing",
    label: "Landing Page",
    icon: LayoutTemplate,
    category: "menu",
    bgColor: "from-orange-500 to-red-500",
  },
  {
    href: "/dashboard/contacts",
    label: "Contacts",
    icon: Contact,
    category: "menu",
    bgColor: "from-sky-500 to-indigo-500",
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart,
    category: "menu",
    bgColor: "from-rose-500 to-fuchsia-600",
  },
  {
    href: "/dashboard/Generative-Ai",
    label: "AI (Beta)",
    icon: Sparkles,
    category: "menu",
    bgColor: "from-amber-400 to-orange-500",
  },

  // ACCOUNT Items
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
    category: "account",
    bgColor: "from-slate-600 to-gray-700",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    category: "account",
    bgColor: "from-slate-600 to-gray-700",
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
    category: "account",
    bgColor: "from-slate-600 to-gray-700",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const supabase = createClient();

  // --- 2. Dynamic Background Logic ---
  // Find the currently active route configuration. We search in reverse to prioritize
  // more specific paths (e.g., '/dashboard/settings' over '/dashboard').
  const activeRoute = routeConfig
    .slice()
    .reverse()
    .find((route) => pathname.startsWith(route.href));

  // Get the background color from the active route, or use a default gradient.
  const activeBgColor = activeRoute?.bgColor || "from-gray-800 to-black";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // A helper to render the category headers ('MENU', 'ACCOUNT')
  let lastCategory = "";
  const renderCategoryHeader = (category: "main" | "menu" | "account", isCollapsed: boolean) => {
    if (category === lastCategory || isCollapsed || category === "main") {
      return null;
    }
    lastCategory = category;
    return <p className="px-3 mt-4 mb-2 text-xs font-semibold text-white/50 uppercase">{category}</p>;
  };

  return (
    <div className="flex h-screen">
      {/* --- 3. Sidebar Container with Dynamic Background --- */}
      <div
        className={cn(
          "fixed left-0 h-full border-r border-black/20 transition-all duration-500 ease-in-out z-20 overflow-hidden",
          isCollapsed ? "w-[72px]" : "w-[250px]",
          `bg-gradient-to-br ${activeBgColor}` // The dynamic gradient is applied here!
        )}>
        {/* Semi-transparent overlay like in the demo */}
        <div className="absolute inset-0 bg-black/20 z-0" />

        {/* All content is now in a relative container to sit above the overlay */}
        <div className="relative z-10 flex flex-col h-full">
          {/* --- 4. Logo Section with Rocket Icon --- */}
          <div className="flex items-center h-16 px-4 border-b border-white/10">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center text-neutral-100 hover:text-white transition-colors duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-neutral-600 rounded-sm w-full",
                isCollapsed ? "justify-center" : "justify-start"
              )}
              title="Go to Dashboard">
              <div className="bg-white/20 p-2 rounded-lg">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              {!isCollapsed && <span className="ml-3 text-lg font-bold text-white whitespace-nowrap">DigiFlow</span>}
            </Link>
          </div>

          {/* Collapse/Expand Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute -right-3 top-[76px] bg-neutral-800/80 border border-neutral-700 rounded-full p-1.5 z-30",
              "hover:bg-neutral-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 backdrop-blur-sm"
            )}>
            <ChevronRight className={cn("h-3 w-3 text-neutral-200 transition-transform duration-300", !isCollapsed && "rotate-180")} />
          </button>

          {/* Scrollable wrapper for all menu items */}
          <div className="flex-grow overflow-y-auto px-3 pt-4">
            {/* --- 5. Unified Menu Rendering Loop --- */}
            {routeConfig.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href || (route.href !== "/dashboard" && pathname.startsWith(route.href + "/"));
              const header = renderCategoryHeader(route.category, isCollapsed);

              return (
                <div key={route.href}>
                  {header}
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 my-1 rounded-lg transition-all duration-200 ease-in-out group relative",
                      // --- 6. Active Item Styling from Demo ---
                      isActive ? "bg-white/20 text-white font-semibold shadow-lg" : "text-neutral-200 hover:bg-white/10 hover:text-white",
                      isCollapsed ? "justify-center" : "justify-start"
                    )}
                    title={isCollapsed ? route.label : undefined}>
                    <Icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0 transition-colors duration-150 ease-in-out",
                        isActive ? "text-white" : "text-neutral-300 group-hover:text-white"
                      )}
                    />
                    {!isCollapsed && <span className={cn("ml-3 whitespace-nowrap")}>{route.label}</span>}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Logout Button (pinned to bottom) */}
          <div className="px-3 pb-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className={cn(
                "w-full text-neutral-300 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150 ease-in-out",
                isCollapsed ? "justify-center px-0 py-2.5" : "justify-start px-3 py-2.5"
              )}
              asChild>
              <span title={isCollapsed ? "Logout" : undefined}>
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3 whitespace-nowrap">Logout</span>}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={cn("flex-1 transition-all duration-500 ease-in-out", isCollapsed ? "ml-[72px]" : "ml-[250px]")}>
        {/* Your page content goes here */}
        {/* Example: <div className="p-8">Your Page Content</div> */}
      </main>
    </div>
  );
}

export default DashboardSidebar;
