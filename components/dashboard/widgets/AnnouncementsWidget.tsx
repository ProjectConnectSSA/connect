"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ArrowUpRight, Clock } from "lucide-react";

export interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "feature" | "update" | "maintenance"; // Use union type
}

interface AnnouncementsWidgetProps {
  announcements: Announcement[];
}

export function AnnouncementsWidget({ announcements }: AnnouncementsWidgetProps) {
  const getIcon = (type: Announcement["type"]) => {
    switch (type) {
      case "feature":
        return (
          <div className="rounded-full bg-green-100 p-2">
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </div>
        );
      case "update":
        return (
          <div className="rounded-full bg-blue-100 p-2">
            <Bell className="h-4 w-4 text-blue-600" />
          </div>
        );
      case "maintenance":
        return (
          <div className="rounded-full bg-orange-100 p-2">
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-600" />
            Announcements
          </div>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.slice(0, 3).map(
            (
              announcement // Show only first 3
            ) => (
              <div
                key={announcement.id}
                className="flex items-start space-x-4 rounded-lg border p-3 transition-colors hover:bg-gray-50">
                <div className="flex-shrink-0">{getIcon(announcement.type)}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <p className="text-sm text-gray-600">{announcement.description}</p>
                  <span className="text-xs text-gray-500 mt-1 block">{announcement.date}</span>
                </div>
              </div>
            )
          )}
          {announcements.length === 0 && <p className="text-sm text-center text-gray-500 py-4">No recent announcements.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
