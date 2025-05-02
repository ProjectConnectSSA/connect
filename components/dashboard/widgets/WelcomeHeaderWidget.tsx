"use client";

import { Button } from "@/components/ui/button";
import { Mail, BarChart2 } from "lucide-react";

interface WelcomeHeaderWidgetProps {
  userName?: string; // Optional: Pass user name if available
}

export function WelcomeHeaderWidget({ userName }: WelcomeHeaderWidgetProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {userName ? `Welcome back, ${userName}!` : "Welcome back!"} Here's an overview of your marketing tools.
        </p>
      </div>
    </div>
  );
}
