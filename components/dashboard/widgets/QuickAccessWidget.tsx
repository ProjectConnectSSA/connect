"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, FileText, Globe, Link2, Users, BarChart2, Calendar, Bell } from "lucide-react";
import Link from "next/link"; // Import Link

const tools = [
  { icon: Mail, label: "Email Builder", href: "/dashboard/emails" }, // Add hrefs
  { icon: FileText, label: "Form Builder", href: "/dashboard/forms" },
  { icon: Globe, label: "Landing Pages", href: "/dashboard/landing" },
  { icon: Link2, label: "Link Manager", href: "/dashboard/links" },
  { icon: Users, label: "Contacts", href: "/dashboard/contacts" },
  { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Calendar, label: "Scheduler", href: "#" }, // Placeholder href
  { icon: Bell, label: "Notifications", href: "#" }, // Placeholder href
];

export function QuickAccessWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access Tools</CardTitle>
        <CardDescription>Frequently used tools to create and manage your marketing assets.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {" "}
          {/* Responsive grid */}
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.label}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2 text-center p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                asChild // Use asChild to make the Button render as a Link
              >
                <Link href={tool.href}>
                  <Icon className="h-6 w-6 mb-1" /> {/* Adjusted spacing */}
                  <span className="text-xs sm:text-sm">{tool.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
