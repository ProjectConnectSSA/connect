"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for navigation/logout
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup, // Added for grouping user items
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  HelpCircle,
  MailCheck,
  BarChart,
  FileWarning,
  UserPlus,
  AlertTriangle,
  Loader2,
  LifeBuoy, // Icon for Support
  BookOpen, // Icon for Docs
  Users, // Icon for Community
  User, // Icon for Profile
  Settings, // Icon for Settings
  LogOut, // Icon for Logout
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import TimeAgo from "react-timeago";
import { toast } from "sonner"; // Import toast for logout feedback

// --- Notification Type ---
interface Notification {
  /* ... (interface remains the same) ... */ id: number;
  user_id: string;
  created_at: string;
  read_at: string | null;
  type: string;
  title: string;
  description?: string | null;
  link?: string | null;
  icon?: string | null;
  icon_color?: string | null;
}

// --- Icon Mapping ---
const iconMap: { [key: string]: React.ElementType } = {
  /* ... (map remains the same) ... */ MailCheck: MailCheck,
  BarChart: BarChart,
  FileWarning: FileWarning,
  UserPlus: UserPlus,
  default: AlertTriangle,
};

export function TopBar() {
  const supabase = createClient();
  const router = useRouter(); // Initialize router
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  const hasUnread = useMemo(() => {
    return notifications.some((n) => n.read_at === null);
  }, [notifications]);

  // Effect 1: Fetch User
  useEffect(() => {
    /* ... (fetch user logic remains the same) ... */
    const fetchUser = async () => {
      setIsAuthLoading(true);
      try {
        const {
          data: { user: currentUser },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    fetchUser();
  }, [supabase]);

  // Effect 2: Fetch Notifications
  useEffect(() => {
    /* ... (fetch notifications logic remains the same) ... */
    if (isAuthLoading || !user) {
      if (!isAuthLoading && !user) {
        setIsNotificationsLoading(false);
        setNotifications([]);
        setNotificationError("Please log in to see notifications.");
      }
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
          } catch {}
          throw new Error(errorMsg);
        }
        const data: Notification[] = await response.json();
        setNotifications(data);
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

  // --- Action Handlers (Mark Read, Click, Logout) ---
  const handleMarkAllRead = async () => {
    /* ... (logic remains the same) ... */
    const previouslyUnreadIds = notifications.filter((n) => n.read_at === null).map((n) => n.id);
    if (previouslyUnreadIds.length === 0) return;
    const now = new Date().toISOString();
    setNotifications((currentNotifications) => currentNotifications.map((n) => (n.read_at === null ? { ...n, read_at: now } : n)));
    try {
      console.log("TODO: Call API to mark all notifications as read");
      // await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error); /* Handle revert/toast */
    }
  };
  const handleNotificationClick = (notification: Notification) => {
    /* ... (logic remains the same) ... */
    console.log("Clicked notification:", notification.id);
    if (notification.read_at === null) {
      const now = new Date().toISOString();
      setNotifications((current) => current.map((n) => (n.id === notification.id ? { ...n, read_at: now } : n)));
      // TODO: API call to mark specific notification 'notification.id' as read
      // fetch(`/api/notifications/${notification.id}/mark-read`, { method: 'PATCH' });
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  // --- NEW: Logout Handler ---
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed. Please try again.");
    } else {
      toast.success("Logged out successfully.");
      // Redirect to login or home page and refresh to clear state
      router.push("/"); // Adjust target route as needed
      router.refresh();
    }
  };
  // --- End Action Handlers ---

  // --- Helper Functions ---
  const getInitials = (email?: string | null) => {
    /* ... (same as before) ... */
    if (!email) return "?";
    const name = user?.user_metadata?.full_name;
    if (name) {
      const parts = name.split(" ").filter(Boolean);
      if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };
  const getDisplayName = () => {
    /* ... (same as before) ... */
    if (!user) return "Guest";
    return user.user_metadata?.full_name || user.email || "User";
  };

  // --- Colors ---
  const textColor = "text-indigo-100";
  const hoverTextColor = "hover:text-white";
  const iconColor = "text-indigo-200";

  return (
    <div
      className={cn(
        /* ... base classes ... */
        "flex h-16 items-center",
        "border-b border-indigo-900",
        "bg-indigo-700",
        "px-4 md:px-6",
        "sticky top-0 z-30"
      )}>
      {/* Left side */}
      <div>
        <Link
          href="/dashboard"
          className={cn("text-lg font-semibold", textColor, hoverTextColor)}>
          Dashboard
        </Link>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-1 md:gap-2">
        {" "}
        {/* Reduced gap slightly */}
        {/* --- Notification Dropdown --- */}
        <DropdownMenu>
          {/* ... (Notification Trigger and Content remain the same) ... */}
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full relative", textColor, hoverTextColor)}
              disabled={isAuthLoading}>
              {hasUnread && !isNotificationsLoading && (
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-indigo-700" />
              )}
              <Bell className={cn("h-5 w-5", iconColor)} />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 md:w-96">
            {/* ... (Notification Label, Separator, Content, Loading, Error, Empty, List) ... */}
            <DropdownMenuLabel className="flex justify-between items-center px-2 py-1.5">
              <span>Notifications</span>
              {!isNotificationsLoading && notifications.length > 0 && hasUnread && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={handleMarkAllRead}>
                  {" "}
                  Mark all as read{" "}
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[400px] overflow-y-auto">
              {isNotificationsLoading && (
                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...{" "}
                </div>
              )}
              {!isNotificationsLoading && notificationError && (
                <div className="flex items-center justify-center p-4 text-sm text-destructive">
                  {" "}
                  <AlertTriangle className="mr-2 h-4 w-4" /> {notificationError}{" "}
                </div>
              )}
              {!isNotificationsLoading && !notificationError && notifications.length === 0 && (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground"> No new notifications </div>
              )}
              {!isNotificationsLoading &&
                !notificationError &&
                notifications.length > 0 &&
                notifications.map((notification) => {
                  const IconComponent = iconMap[notification.icon || "default"] || iconMap.default;
                  const isUnread = notification.read_at === null;
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 px-2 py-2.5 cursor-pointer data-[disabled]:pointer-events-auto data-[disabled]:opacity-100",
                        isUnread && "bg-indigo-50 dark:bg-indigo-900/30"
                      )}
                      onClick={() => handleNotificationClick(notification)}>
                      <div
                        className={cn(
                          "flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center mt-0.5",
                          !isUnread ? "bg-gray-100 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-900/50"
                        )}>
                        {" "}
                        <IconComponent className={cn("h-4 w-4", notification.icon_color || iconColor)} />{" "}
                      </div>
                      <div className="flex-1">
                        {" "}
                        <p className={cn("text-sm font-medium text-foreground", isUnread && "font-semibold")}>{notification.title}</p>{" "}
                        {notification.description && <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>}{" "}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {" "}
                          <TimeAgo date={notification.created_at} />{" "}
                        </p>{" "}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
            </div>
            {!isNotificationsLoading && !notificationError && notifications.length > 0 && (
              <>
                {" "}
                <DropdownMenuSeparator />{" "}
                <DropdownMenuItem className="justify-center py-2 cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                  {" "}
                  View all notifications {/* TODO: Link */}{" "}
                </DropdownMenuItem>{" "}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* --- End Notification Dropdown --- */}
        {/* --- Help Dropdown --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full", textColor, hoverTextColor)}>
              <HelpCircle className={cn("h-5 w-5", iconColor)} />
              <span className="sr-only">Help</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56">
            {" "}
            {/* Standard width */}
            <DropdownMenuLabel>Help & Support</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                href="/docs"
                target="_blank"
                rel="noopener noreferrer">
                {" "}
                {/* Use <a> for external links */}
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Documentation</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href="/support"
                target="_blank"
                rel="noopener noreferrer">
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Contact Support</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href="/community"
                target="_blank"
                rel="noopener noreferrer">
                <Users className="mr-2 h-4 w-4" />
                <span>Community Forum</span>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* --- End Help Dropdown --- */}
        <div className="h-6 w-px bg-indigo-500 hidden md:block mx-1"></div> {/* Separator */}
        {/* --- User Dropdown --- */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            disabled={isAuthLoading || !user}>
            {/* Wrap the user info in a div that acts as the trigger */}
            <div
              className={cn(
                "flex items-center gap-2 cursor-pointer rounded-md p-1", // Make clickable area slightly larger
                "hover:bg-indigo-600 transition-colors" // Add hover effect
              )}>
              {isAuthLoading ? (
                <>
                  <Skeleton className="h-8 w-8 rounded-full bg-indigo-500" />
                  <Skeleton className="h-4 w-16 bg-indigo-500 hidden sm:block" />
                </>
              ) : user ? (
                <>
                  <Avatar className="h-8 w-8 border border-indigo-500">
                    {" "}
                    {/* Slightly smaller avatar */}
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={getDisplayName()}
                    />
                    <AvatarFallback className="bg-indigo-500 text-indigo-100 text-xs">
                      {" "}
                      {/* Smaller fallback text */}
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className={cn("text-sm font-medium hidden sm:inline", textColor)}>{getDisplayName()}</span>
                </>
              ) : (
                <span className={cn("text-sm font-medium", textColor)}>Sign In</span>
                // Or display a login button if user is null
              )}
            </div>
          </DropdownMenuTrigger>
          {user && ( // Only render content if user exists
            <DropdownMenuContent
              align="end"
              className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    {" "}
                    {/* Adjust link as needed */}
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/billing">
                    {" "}
                    {/* Example */}
                    <Settings className="mr-2 h-4 w-4" /> {/* Replace with Billing icon if available */}
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:bg-red-100 focus:text-red-700">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
        {/* --- End User Dropdown --- */}
      </div>
    </div>
  );
}
