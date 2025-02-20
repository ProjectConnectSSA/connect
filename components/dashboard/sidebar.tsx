"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, FileText, Mail, User, LogOut, BarChart, ChevronRight, LayoutTemplate } from "lucide-react";
import { useState } from "react";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  full_name?: string;
  avatar_url?: string;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const routes = [
    {
      href: "/dashboard/links",
      label: "Link",
      icon: LinkIcon,
    },
    {
      href: "/dashboard/forms",
      label: "Forms",
      icon: FileText,
    },
    {
      href: "/dashboard/emails",
      label: "Emails",
      icon: Mail,
    },
    {
      href: "/dashboard/landing",
      label: "Create Landing Page",
      icon: LayoutTemplate,
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: BarChart,
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <div className="flex h-screen">
      <div
        className={cn(
          "fixed left-0 h-full bg-indigo-700 border-r border-indigo-900 transition-all duration-300 ease-in-out z-20",
          isCollapsed ? "w-[60px]" : "w-[240px]"
        )}>
        <div className="flex flex-col px-3 py-4 border-b border-indigo-900">
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-start")}>
            <img
              src="/Header.png"
              alt="Logo"
              className="h-8 w-8"
            />
            {!isCollapsed && <span className="ml-3 text-white font-semibold">Dashboard</span>}
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-20 bg-indigo-900 border border-indigo-800 rounded-full p-1.5",
            "hover:bg-indigo-800 transition-colors"
          )}>
          <ChevronRight className={cn("h-3 w-3 text-white transition-transform", !isCollapsed && "rotate-180")} />
        </button>

        <div className="flex flex-col h-[calc(100%-64px)] pt-6">
          <nav className="space-y-1 px-3">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href;

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-all relative",
                    "group hover:bg-indigo-600",
                    isActive ? "bg-gradient-to-r from-indigo-600 to-indigo-400 text-white shadow-lg" : "text-gray-300"
                  )}>
                  <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-gray-400", "group-hover:text-white")} />
                  {!isCollapsed && <span className={cn("ml-3 font-medium", isActive ? "text-white" : "text-gray-200")}>{route.label}</span>}
                  {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-white rounded-r"></div>}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto px-3 mb-6 pb-6">
            <Button
              variant="ghost"
              className={cn("w-full justify-start text-gray-300 hover:text-red-400 hover:bg-red-400/10", isCollapsed && "justify-center px-2")}
              asChild>
              <Link href="/logout">
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Logout</span>}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className={cn("flex-1 transition-all duration-300", isCollapsed ? "ml-[60px]" : "ml-[240px]")}></main>
    </div>
  );
}

export default DashboardSidebar;
