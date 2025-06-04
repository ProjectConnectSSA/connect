"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Link as LinkIcon,
  FileText,
  Mail,
  LayoutTemplate,
  Contact,
  BarChart,
  User,
  Settings,
  CreditCard,
  Sparkles,
  LogOut,
  ChevronRight,
  Grid, // Ensure Grid icon is imported
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dashboard link details
  const dashboardRoute = { href: "/dashboard", label: "Dashboard", icon: Grid };

  // MENU items (Dashboard is handled separately above this)
  const menuItems = [
    { href: "/dashboard/links", label: "Bio Page", icon: LinkIcon },
    { href: "/dashboard/forms", label: "Forms", icon: FileText },
    { href: "/dashboard/emails", label: "Emails", icon: Mail },
    { href: "/dashboard/landing", label: "Landing Page", icon: LayoutTemplate },
    { href: "/dashboard/contacts", label: "Contacts", icon: Contact },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
    { href: "/dashboard/Generative-Ai", label: "AI (Beta)", icon: Sparkles },
  ];

  // ACCOUNT routes
  const accountRoutes = [
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  ];

  // Tailwind classes for active/inactive styling
  const activeBgColor = "bg-white";
  const activeTextColor = "text-black";
  const inactiveTextColor = "text-neutral-200";
  const inactiveIconColor = "text-neutral-200";
  const hoverBgColor = "hover:bg-neutral-800";
  const hoverTextColor = "hover:text-white";

  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed left-0 h-full bg-[#101010] border-r border-neutral-800 transition-all duration-300 ease-in-out z-20",
          isCollapsed ? "w-[60px]" : "w-[240px]"
        )}>
        {/* Logo/Header Section */}
        <div className="flex flex-col px-3 py-4 border-b border-neutral-800">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center h-8 text-neutral-100 hover:text-white transition-colors duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-neutral-600 rounded-sm",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title="Go to Dashboard">
            <img
              src="/Header.png"
              alt="Logo"
              className="h-8 w-8 flex-shrink-0"
            />
            {!isCollapsed && <span className="ml-3 font-semibold whitespace-nowrap">DigiFlow</span>}
          </Link>
        </div>

        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-16 bg-neutral-800 border border-neutral-700 rounded-full p-1.5 z-30",
            "hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500"
          )}>
          <ChevronRight className={cn("h-3 w-3 text-neutral-200 transition-transform duration-300", !isCollapsed && "rotate-180")} />
        </button>

        {/* Scrollable wrapper for MENU + ACCOUNT */}
        <div className="flex flex-col h-[calc(100%-64px)] pt-4">
          <div className="flex-grow overflow-y-auto px-3 ">
            {/* --------- Standalone Dashboard Link (Icon AND Label when expanded) --------- */}
            {(() => {
              const Icon = dashboardRoute.icon;
              const isActive = pathname === dashboardRoute.href; // Exact match for Dashboard
              return (
                <Link
                  key={dashboardRoute.href}
                  href={dashboardRoute.href}
                  className={cn(
                    "flex items-center px-3 py-2 my-1 rounded-md transition-all duration-150 ease-in-out group relative",
                    isActive ? `${activeBgColor} ${activeTextColor} font-medium shadow-sm` : `${inactiveTextColor} ${hoverBgColor} ${hoverTextColor}`,
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                  title={isCollapsed ? dashboardRoute.label : undefined} // Tooltip only when collapsed, as label is visible when expanded
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors duration-150 ease-in-out",
                      isActive ? activeTextColor : `${inactiveIconColor} group-hover:text-white`
                    )}
                  />
                  {/* Show label for Dashboard when sidebar is NOT collapsed */}
                  {!isCollapsed && (
                    <span className={cn("ml-3 whitespace-nowrap", isActive ? "font-medium" : "font-normal")}>{dashboardRoute.label}</span>
                  )}
                </Link>
              );
            })()}

            {/* --------- “MENU” Section (appears AFTER standalone Dashboard) --------- */}
            {/* Added mt-2 to give some space below the standalone Dashboard link */}
            {!isCollapsed && <p className="mt-2 text-xs font-semibold text-neutral-500 uppercase">MENU</p>}

            {menuItems.map((route) => {
              const Icon = route.icon;
              // Active if current path is the route's href or starts with route's href + "/"
              const isActive = pathname === route.href || pathname.startsWith(route.href + "/");

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center px-3 py-2 my-1 rounded-md transition-all duration-150 ease-in-out group relative",
                    isActive ? `${activeBgColor} ${activeTextColor} font-medium shadow-sm` : `${inactiveTextColor} ${hoverBgColor} ${hoverTextColor}`,
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                  title={isCollapsed ? route.label : undefined}>
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors duration-150 ease-in-out",
                      isActive ? activeTextColor : `${inactiveIconColor} group-hover:text-white`
                    )}
                  />
                  {!isCollapsed && <span className={cn("ml-3 whitespace-nowrap", isActive ? "font-medium" : "font-normal")}>{route.label}</span>}
                </Link>
              );
            })}

            {/* --------- “ACCOUNT” Section --------- */}
            {!isCollapsed && <p className="mt-6 text-xs font-semibold text-neutral-500 uppercase">ACCOUNT</p>}
            {accountRoutes.map((acct) => {
              const Icon = acct.icon;
              const isActive = pathname === acct.href || pathname.startsWith(acct.href + "/");

              return (
                <Link
                  key={acct.href}
                  href={acct.href}
                  className={cn(
                    "flex items-center px-3 py-2 my-1 rounded-md transition-all duration-150 ease-in-out group relative",
                    isActive ? `${activeBgColor} ${activeTextColor} font-medium shadow-sm` : `${inactiveTextColor} ${hoverBgColor} ${hoverTextColor}`,
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                  title={isCollapsed ? acct.label : undefined}>
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors duration-150 ease-in-out",
                      isActive ? activeTextColor : `${inactiveIconColor} group-hover:text-white`
                    )}
                  />
                  {!isCollapsed && <span className={cn("ml-3 whitespace-nowrap", isActive ? "font-medium" : "font-normal")}>{acct.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* --------- Logout Button (pinned to bottom) --------- */}
          <div className="px-3 pb-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className={cn(
                "w-full text-neutral-400 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150 ease-in-out",
                isCollapsed ? "justify-center px-0 py-2" : "justify-start px-3 py-2"
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

      {/* Main Content Area (adjusts margin based on collapse) */}
      <main className={cn("flex-1 transition-all duration-300 ease-in-out", isCollapsed ? "ml-[60px]" : "ml-[240px]")}>
        {/* Your page content goes here */}
      </main>
    </div>
  );
}

export default DashboardSidebar;
