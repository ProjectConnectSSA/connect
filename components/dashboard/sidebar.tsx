"use client";

import Link from "next/link"; // Make sure Link is imported
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, FileText, Mail, User, LogOut, BarChart, ChevronRight, LayoutTemplate, Contact, Atom } from "lucide-react";
import { useState } from "react";

// ... (Keep the User interface and other imports)

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const routes = [
    // ... (Keep your routes array)
    { href: "/dashboard/links", label: "Bio Page", icon: LinkIcon },
    { href: "/dashboard/forms", label: "Forms", icon: FileText },
    { href: "/dashboard/emails", label: "Emails", icon: Mail },
    { href: "/dashboard/landing", label: "Landing Page", icon: LayoutTemplate },
    { href: "/dashboard/contacts", label: "Contacts", icon: Contact },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/Generative-Ai", label: "AI (Beta)", icon: Atom },
  ];

  const activeBgColor = "bg-white";
  const activeTextColor = "text-indigo-700";
  const inactiveTextColor = "text-indigo-100";
  const inactiveIconColor = "text-indigo-300";
  const hoverBgColor = "hover:bg-indigo-600";
  const hoverTextColor = "hover:text-white";

  return (
    <div className="flex h-screen">
      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed left-0 h-full bg-indigo-700 border-r border-indigo-900 transition-all duration-300 ease-in-out z-20",
          isCollapsed ? "w-[60px]" : "w-[240px]"
        )}>
        {/* Logo/Header Section - Modified */}
        <div className="flex flex-col px-3 py-4 border-b border-indigo-900">
          <Link
            href="/dashboard" // Set the link destination
            className={cn(
              "flex items-center h-8 text-white hover:text-indigo-100 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded-sm", // Added focus styles and rounded
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title="Go to Dashboard" // Added tooltip
          >
            <img
              src="/Header.png" // Ensure this path is correct
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
            "absolute -right-3 top-16 bg-indigo-900 border border-indigo-800 rounded-full p-1.5 z-30",
            "hover:bg-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          )}>
          <ChevronRight className={cn("h-3 w-3 text-white transition-transform duration-300", !isCollapsed && "rotate-180")} />
        </button>

        {/* Navigation Section */}
        <div className="flex flex-col h-[calc(100%-64px)] pt-4">
          <nav className="flex-grow space-y-1 px-3 overflow-y-auto">
            {routes.map((route) => {
              const Icon = route.icon;
              // Check if the current path starts with the route's href
              // This makes parent routes active even if on a sub-page
              // e.g., /dashboard/links/new will still highlight "Links"
              const isActive = pathname === route.href || pathname.startsWith(route.href + "/");

              // Special case for the main dashboard link if it's separate
              // const isExactlyDashboard = pathname === '/dashboard';
              // Handle potential /dashboard route if needed, otherwise ignore

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-all duration-150 ease-in-out group relative",
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
          </nav>

          {/* Logout Button Section */}
          <div className="mt-auto px-3 pb-4">
            <Button
              variant="ghost"
              className={cn(
                "w-full text-indigo-100 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150 ease-in-out",
                isCollapsed ? "justify-center px-0 py-2" : "justify-start px-3 py-2"
              )}
              asChild>
              <Link
                href="/logout"
                title={isCollapsed ? "Logout" : undefined}>
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3 whitespace-nowrap">Logout</span>}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area Placeholder */}
      <main className={cn("flex-1 transition-all duration-300 ease-in-out", isCollapsed ? "ml-[60px]" : "ml-[240px]")}>
        {/* Your page content goes here */}
      </main>
    </div>
  );
}

export default DashboardSidebar;
