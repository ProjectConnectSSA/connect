// components/layout/topbar/topbarWidgets/PageTitle.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { textColor, hoverTextColor } from "./styles";

interface PageTitleProps {
  pathname: string | null;
}

// --- HELPER FUNCTION: Get Page Title from Pathname ---
function getPageTitle(pathname: string | null): string {
  if (!pathname) return "Dashboard"; // Default if pathname is null

  if (pathname === "/dashboard") return "Overview";
  if (pathname.startsWith("/dashboard/forms")) return "Forms";
  if (pathname.startsWith("/dashboard/links")) return "Bio Pages";
  if (pathname.startsWith("/dashboard/profile")) return "Profile";
  if (pathname.startsWith("/dashboard/email")) return "Email";
  if (pathname.startsWith("/dashboard/contacts")) return "Contacts";
  if (pathname.startsWith("/dashboard/analytics")) return "Analytics";
  if (pathname.startsWith("/dashboard/landing")) return "Landing Page";
  if (pathname.startsWith("/dashboard/Generative-Ai")) return "AI (Beta)";

  return "Dashboard";
}

export function PageTitle({ pathname }: PageTitleProps) {
  return (
    <div>
      <Link
        href="/dashboard"
        className={cn("text-lg font-semibold", textColor, hoverTextColor)}
        title="Go to Dashboard Overview">
        {getPageTitle(pathname)}
      </Link>
    </div>
  );
}
