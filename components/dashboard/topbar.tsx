// components/layout/topbar/TopBar.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Notification } from "@/app/types/notification";
import { NotificationSidebar } from "./notificationbar";
import {
  PageTitle,
  NotificationWidget,
  HelpWidget,
  UserWidget,
  bgColor, // Main TopBar background
  borderColor, // Main TopBar border
  separatorColor, // Separator between Help and User
} from "./topbarWidget"; // Import from barrel file

export function TopBar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hasUnread = useMemo(() => {
    return notifications.some((n) => n.read_at === null);
  }, [notifications]);

  // Effect 1: Fetch User
  useEffect(() => {
    const fetchUser = async () => {
      setIsAuthLoading(true);
      try {
        const {
          data: { user: currentUser },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          if (error.message !== "Auth session missing!") {
            console.error("Error fetching user:", error);
          }
          setUser(null);
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    fetchUser();
  }, [supabase]);

  // Effect 2: Fetch Notifications (Only if user exists)
  useEffect(() => {
    if (isAuthLoading || !user) {
      setIsNotificationsLoading(false);
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      setIsNotificationsLoading(true);
      setNotificationError(null);
      try {
        const response = await fetch("/api/notification");
        if (!response.ok) {
          let errorMsg = `Error: ${response.status}`;
          try {
            const errData = await response.json();
            errorMsg = errData.error || errData.message || errorMsg;
          } catch {
            /* Ignore parsing error */
          }
          throw new Error(errorMsg);
        }
        const data: Notification[] = await response.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.error("API did not return an array for notifications:", data);
          setNotifications([]);
          setNotificationError("Received invalid notification data.");
        }
      } catch (error: any) {
        console.error("Failed to fetch notifications:", error);
        setNotificationError(error.message || "Could not load notifications.");
        setNotifications([]);
      } finally {
        setIsNotificationsLoading(false);
      }
    };
    fetchNotifications();
  }, [user, isAuthLoading]);

  // --- Action Handlers ---
  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter((n) => n.read_at === null);
    if (unreadNotifications.length === 0) return;

    const now = new Date().toISOString();
    const originalNotifications = [...notifications];
    setNotifications((currentNotifications) => currentNotifications.map((n) => (n.read_at === null ? { ...n, read_at: now } : n)));

    try {
      const response = await fetch("/api/notification/mark-all-read", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to mark notifications as read on server");
      }
      // toast.success("Marked all as read.");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      setNotifications(originalNotifications);
      toast.error("Failed to mark notifications as read. Please try again.");
    }
  };

  const handleMarkOneRead = async (notificationId: number) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (!notification || notification.read_at !== null) return;

    const now = new Date().toISOString();
    const originalNotifications = [...notifications];
    setNotifications((current) => current.map((n) => (n.id === notificationId ? { ...n, read_at: now } : n)));

    try {
      const response = await fetch("/api/notification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [notificationId] }),
      });
      if (!response.ok) {
        setNotifications(originalNotifications);
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setNotifications(originalNotifications);
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    const originalNotifications = [...notifications];
    setNotifications((current) => current.filter((n) => n.id !== notificationId));
    try {
      const response = await fetch("/api/notification", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notificationId }),
      });
      if (!response.ok) {
        setNotifications(originalNotifications);
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      setNotifications(originalNotifications);
      toast.error("Failed to delete notification.");
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.read_at === null) {
      const now = new Date().toISOString();
      const originalNotifications = [...notifications];
      setNotifications((current) => current.map((n) => (n.id === notification.id ? { ...n, read_at: now } : n)));

      try {
        const response = await fetch("/api/notification", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [notification.id] }),
        });
        if (!response.ok) {
          setNotifications(originalNotifications);
          throw new Error("Network response was not ok for marking read");
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
        setNotifications(originalNotifications);
        toast.error("Failed to mark notification as read.");
      }
    }

    if (notification.link) {
      if (notification.link.startsWith("/")) {
        router.push(notification.link);
      } else {
        window.open(notification.link, "_blank", "noopener noreferrer");
      }
    } else {
      console.log("Clicked notification without a link:", notification.id);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed. Please try again.");
    } else {
      toast.success("Logged out successfully.");
      router.push("/");
      router.refresh();
    }
  };

  const getInitials = (email?: string | null): string => {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name;
    if (name && typeof name === "string") {
      const parts = name.split(" ").filter(Boolean);
      if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      if (parts.length === 1 && parts[0].length > 0) {
        return parts[0].substring(0, Math.min(parts[0].length, 2)).toUpperCase();
      }
    }
    if (email && typeof email === "string" && email.includes("@")) {
      const emailPrefix = email.split("@")[0];
      return emailPrefix.substring(0, Math.min(emailPrefix.length, 2)).toUpperCase();
    }
    return "??";
  };

  const getDisplayName = (): string => {
    if (!user) return "Guest";
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
  };

  return (
    <div
      className={cn(
        "flex h-16 items-center",
        "border-b",
        borderColor, // Main TopBar border, from styles.ts via barrel file
        bgColor, // Main TopBar background, from styles.ts via barrel file
        "px-4 md:px-6",
        // These classes ensure the TopBar is sticky at the top of the viewport
        "sticky top-0 z-30 w-full"
      )}>
      <PageTitle pathname={pathname} />

      <div className="ml-auto flex items-center gap-1 md:gap-2">
        <NotificationWidget
          user={user}
          isAuthLoading={isAuthLoading}
          notifications={notifications}
          isNotificationsLoading={isNotificationsLoading}
          notificationError={notificationError}
          hasUnread={hasUnread}
          handleMarkAllRead={handleMarkAllRead}
          handleNotificationClick={handleNotificationClick}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <HelpWidget />

        <div className={cn("h-6 w-px hidden md:block mx-1", separatorColor /* from styles.ts */)}></div>

        <UserWidget
          user={user}
          isAuthLoading={isAuthLoading}
          handleLogout={handleLogout}
          getInitials={getInitials}
          getDisplayName={getDisplayName}
        />
      </div>

      <NotificationSidebar
        notifications={notifications}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onMarkAllRead={handleMarkAllRead}
        onMarkRead={handleMarkOneRead}
        onDelete={handleDeleteNotification}
      />
    </div>
  );
}
