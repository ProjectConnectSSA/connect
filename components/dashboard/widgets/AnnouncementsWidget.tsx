"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ArrowUpRight, Clock, Loader2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client"; // Adjust path if needed

export interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string; // This will be the formatted string for display
  type: "feature" | "update" | "maintenance";
}

// Remove the props interface, as the component will fetch its own data
// interface AnnouncementsWidgetProps {
//   announcements: Announcement[];
// }

export function AnnouncementsWidget() {
  // Remove props
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient(); // Initialize client

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from("announcements")
          .select("id, title, description, date, type")
          .order("date", { ascending: false }); // Fetch newest first

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          // Format the date from Supabase (which is likely an ISO string)
          // to the desired display format.
          const formattedAnnouncements = data.map((item: any) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            type: item.type as Announcement["type"], // Assert the type
          }));
          setAnnouncements(formattedAnnouncements);
        } else {
          setAnnouncements([]);
        }
      } catch (err: any) {
        console.error("Error fetching announcements:", err);
        setError(err.message || "Failed to fetch announcements.");
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run once on mount. Add supabase client if its creation isn't memoized.
  // For this simple client, it's fine.

  const getIcon = (type: Announcement["type"]) => {
    switch (type) {
      case "feature":
        return (
          <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
            <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        );
      case "update":
        return (
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        );
      case "maintenance":
        return (
          <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            <div className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              Announcements
            </div>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            disabled>
            View All
          </Button>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
          <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading announcements...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            <div className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
              Announcements
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
          <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">Error loading announcements</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
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
          {announcements.slice(0, 3).map((announcement) => (
            <div
              key={announcement.id}
              className="flex items-start space-x-4 rounded-lg border p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
              <div className="flex-shrink-0">{getIcon(announcement.type)}</div>
              <div className="flex-1">
                <h4 className="font-medium dark:text-gray-100">{announcement.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{announcement.description}</p>
                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-500">{announcement.date}</span>
              </div>
            </div>
          ))}
          {announcements.length === 0 && !loading && (
            <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">No recent announcements.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
