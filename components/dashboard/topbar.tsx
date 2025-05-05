"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
// Import hooks for navigation and path
import { useRouter, usePathname } from "next/navigation";
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
  DropdownMenuGroup,
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
  LifeBuoy,
  BookOpen,
  Users,
  User,
  Settings,
  LogOut,
  // Add specific icons if needed for titles
  FileText as FormsIcon,
  Link as LinksIcon,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import TimeAgo from "react-timeago";
import { toast } from "sonner";
import { Notification } from "@/app/types/notification"; // Adjust import path as needed

// --- Notification Icon Mapping ---
const iconMap: { [key: string]: React.ElementType } = {
  MailCheck: MailCheck,
  BarChart: BarChart,
  FileWarning: FileWarning,
  UserPlus: UserPlus,
  default: AlertTriangle,
};

// --- HELPER FUNCTION: Get Page Title from Pathname ---
function getPageTitle(pathname: string | null): string {
  if (!pathname) return "Dashboard"; // Default if pathname is null

  // Add your specific routes here
  if (pathname === "/dashboard") return "Overview"; // Or just "Dashboard"
  if (pathname.startsWith("/dashboard/forms")) return "Forms";
  if (pathname.startsWith("/dashboard/links")) return "Bio Pages"; // Example
  if (pathname.startsWith("/dashboard/profile")) return "Profile";
  if (pathname.startsWith("/dashboard/email")) return "Email";
  if (pathname.startsWith("/dashboard/contacts")) return "Contacts";
  if (pathname.startsWith("/dashboard/analytics")) return "Analytics";
  if (pathname.startsWith("/dashboard/landing")) return "Landing Page";
  if (pathname.startsWith("/dashboard/Generative-Ai")) return "AI (Beta)";
  // Add more mappings as needed for your application sections

  // Fallback Title
  return "Dashboard";
}
// --- END HELPER FUNCTION ---

export function TopBar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
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
    const fetchUser = async () => {
      setIsAuthLoading(true);
      try {
        const {
          data: { user: currentUser },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          // Don't throw error if user is simply not logged in
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
    // Reset notification state if auth is loading or no user
    if (isAuthLoading || !user) {
      setIsNotificationsLoading(false); // Stop loading indicator
      setNotifications([]); // Clear notifications
      if (!isAuthLoading && !user) {
        // Optionally set an error/message if needed, but often not desired for anon users
        // setNotificationError("Please log in to see notifications.");
      }
      return; // Exit early
    }

    // Proceed to fetch notifications if user exists and auth is done
    const fetchNotifications = async () => {
      setIsNotificationsLoading(true);
      setNotificationError(null);
      try {
        // Ensure your API endpoint is correct and handles authentication
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
        // Ensure data is an array before setting state
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
  }, [user, isAuthLoading]); // Depend on user and auth loading state

  // --- Action Handlers ---
  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter((n) => n.read_at === null);
    if (unreadNotifications.length === 0) return;

    const now = new Date().toISOString();
    const originalNotifications = [...notifications]; // Store original state for potential revert

    // Optimistically update UI
    setNotifications((currentNotifications) => currentNotifications.map((n) => (n.read_at === null ? { ...n, read_at: now } : n)));

    try {
      // --- Replace with your actual API call ---
      const response = await fetch("/api/notification/mark-all-read", {
        // Example endpoint
        method: "POST",
        // headers: { 'Content-Type': 'application/json' }, // Add headers if needed
        // body: JSON.stringify({ ids: unreadNotifications.map(n => n.id) }) // Send IDs if needed by backend
      });
      if (!response.ok) {
        throw new Error("Failed to mark notifications as read on server");
      }
      // Success - UI is already updated
      // toast.success("Marked all as read."); // Optional success feedback
      // --- End API call section ---
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      // Revert UI changes on error
      setNotifications(originalNotifications);
      toast.error("Failed to mark notifications as read. Please try again.");
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread (optimistic update + API call)
    if (notification.read_at === null) {
      const now = new Date().toISOString();
      const originalNotifications = [...notifications];
      setNotifications((current) => current.map((n) => (n.id === notification.id ? { ...n, read_at: now } : n)));

      try {
        // --- Replace with your actual API call to mark one notification as read ---
        const response = await fetch(`/api/notification/${notification.id}/mark-read`, {
          // Example endpoint
          method: "PATCH", // Or POST
        });
        if (!response.ok) {
          throw new Error("Failed to mark notification as read on server");
        }
        // Success - UI is already updated
        // --- End API call section ---
      } catch (error) {
        console.error(`Failed to mark notification ${notification.id} as read:`, error);
        // Revert UI change for this specific notification on error
        setNotifications(originalNotifications);
        toast.error("Failed to update notification status.");
        // Decide if navigation should proceed despite the error
        // return; // Option: Stop navigation if marking as read failed
      }
    }

    // Navigate if a link exists
    if (notification.link) {
      // Use router.push for internal links for smoother SPA navigation
      if (notification.link.startsWith("/")) {
        router.push(notification.link);
      } else {
        // Open external links in a new tab
        window.open(notification.link, "_blank", "noopener noreferrer");
      }
    } else {
      console.log("Clicked notification without a link:", notification.id);
      // Potentially do something else if there's no link, like opening a modal
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed. Please try again.");
    } else {
      toast.success("Logged out successfully.");
      // Redirect to login or home page and refresh to clear state
      router.push("/"); // Adjust target route as needed (e.g., '/login')
      router.refresh(); // Force refresh to ensure all state is cleared
    }
  };
  // --- End Action Handlers ---

  // --- Helper Functions ---
  const getInitials = (email?: string | null): string => {
    // Use user_metadata first if available
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name;
    if (name && typeof name === "string") {
      const parts = name.split(" ").filter(Boolean); // Filter out empty strings from multiple spaces
      if (parts.length > 1) {
        // Use first letter of first and last parts
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      if (parts.length === 1 && parts[0].length > 0) {
        // Use first 1 or 2 letters of the single name part
        return parts[0].substring(0, Math.min(parts[0].length, 2)).toUpperCase();
      }
    }
    // Fallback to email if name is not useful
    if (email && typeof email === "string" && email.includes("@")) {
      const emailPrefix = email.split("@")[0];
      return emailPrefix.substring(0, Math.min(emailPrefix.length, 2)).toUpperCase();
    }
    // Absolute fallback
    return "??";
  };

  const getDisplayName = (): string => {
    if (!user) return "Guest";
    // Prioritize full name, then name, then email
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
  };

  // --- Colors & Styling ---
  // Define base colors for reuse, makes theme changes easier
  const textColor = "text-indigo-100 dark:text-gray-200";
  const hoverTextColor = "hover:text-white dark:hover:text-white";
  const iconColor = "text-indigo-200 dark:text-gray-400";
  const bgColor = "bg-indigo-700 dark:bg-gray-950";
  const borderColor = "border-indigo-900 dark:border-gray-800";
  const hoverBgColor = "hover:bg-indigo-600 dark:hover:bg-gray-800";
  const separatorColor = "bg-indigo-500 dark:bg-gray-700";
  const dropdownBgColor = "bg-white dark:bg-gray-900";
  const dropdownBorderColor = "border-gray-200 dark:border-gray-700";
  const dropdownSeparatorColor = "bg-gray-200 dark:bg-gray-700";
  const dropdownFocusBgColor = "focus:bg-gray-100 dark:focus:bg-gray-800";
  const dropdownTextColor = "text-gray-700 dark:text-gray-300";
  const dropdownLabelColor = "text-gray-900 dark:text-gray-100";
  const dropdownMutedColor = "text-gray-500 dark:text-gray-400";

  // --- RETURN JSX ---
  // IMPORTANT: Ensure the return statement has parentheses around the JSX
  return (
    <div
      className={cn(
        "flex h-16 items-center", // Base layout
        "border-b", // Add border bottom
        borderColor, // Use dynamic border color
        bgColor, // Use dynamic background color
        "px-4 md:px-6", // Padding
        "sticky top-0 z-30 w-full" // Stickiness and width
      )}>
      {/* Left side - Dynamic Title */}
      <div>
        <Link
          href="/dashboard" // Link always goes to the main dashboard overview
          className={cn("text-lg font-semibold", textColor, hoverTextColor)}
          title="Go to Dashboard Overview">
          {/* Display the dynamic page title */}
          {getPageTitle(pathname)}
        </Link>
      </div>
      {/* Right side - Icons and User Menu */}
      <div className="ml-auto flex items-center gap-1 md:gap-2">
        {/* --- Notification Dropdown --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative rounded-full",
                textColor,
                hoverTextColor,
                hoverBgColor // Apply hover background
              )}
              aria-label="Notifications"
              disabled={isAuthLoading || !user} // Disable if loading or no user
            >
              {/* Unread indicator dot */}
              {hasUnread && !isNotificationsLoading && (
                <span
                  className={cn(
                    "absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-1",
                    "ring-indigo-700 dark:ring-gray-950" // Ring color adapts to theme
                  )}
                />
              )}
              <Bell className={cn("h-5 w-5", iconColor)} />
            </Button>
          </DropdownMenuTrigger>
          {/* Render content only if user is logged in */}
          {user && (
            <DropdownMenuContent
              align="end"
              className={cn("w-80 md:w-96 border", dropdownBgColor, dropdownBorderColor)}>
              {/* Label and Mark All Read */}
              <DropdownMenuLabel className={cn("flex justify-between items-center px-2 py-1.5 text-sm font-medium", dropdownLabelColor)}>
                <span>Notifications</span>
                {!isNotificationsLoading && notifications.length > 0 && hasUnread && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-blue-600 dark:text-blue-400"
                    onClick={handleMarkAllRead}>
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className={dropdownSeparatorColor} />

              {/* Scrollable Notification List */}
              <div className="max-h-[400px] overflow-y-auto">
                {isNotificationsLoading && (
                  <div className={cn("flex items-center justify-center p-4 text-sm", dropdownMutedColor)}>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                  </div>
                )}
                {!isNotificationsLoading && notificationError && (
                  <div className={cn("flex items-center justify-center p-4 text-sm text-red-600 dark:text-red-500")}>
                    <AlertTriangle className="mr-2 h-4 w-4" /> {notificationError}
                  </div>
                )}
                {!isNotificationsLoading && !notificationError && notifications.length === 0 && (
                  <div className={cn("px-2 py-6 text-center text-sm", dropdownMutedColor)}> No new notifications </div>
                )}
                {/* Render list items */}
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
                          dropdownFocusBgColor, // Focus style
                          isUnread && "bg-blue-50 dark:bg-gray-800/50" // Unread style
                        )}
                        onClick={() => handleNotificationClick(notification)}>
                        {/* Icon container */}
                        <div
                          className={cn(
                            "flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center mt-0.5",
                            !isUnread ? "bg-gray-100 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-900/50"
                          )}>
                          <IconComponent className={cn("h-4 w-4", notification.icon_color || "text-gray-500 dark:text-gray-400")} />
                        </div>
                        {/* Text content */}
                        <div className="flex-1 overflow-hidden">
                          <p
                            className={cn(
                              "text-sm font-medium truncate", // Truncate title
                              dropdownLabelColor,
                              isUnread && "font-semibold"
                            )}>
                            {notification.title}
                          </p>
                          {notification.description && <p className={cn("text-xs line-clamp-2", dropdownMutedColor)}>{notification.description}</p>}
                          <p className={cn("text-xs mt-0.5", dropdownMutedColor)}>
                            <TimeAgo date={notification.created_at} />
                          </p>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
              </div>

              {/* Footer link (optional) */}
              {!isNotificationsLoading && !notificationError && notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator className={dropdownSeparatorColor} />
                  <DropdownMenuItem
                    className={cn(
                      "justify-center py-2 cursor-pointer text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
                      dropdownFocusBgColor
                    )}>
                    {/* TODO: Replace with Link if internal, or <a> if external */}
                    View all notifications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          )}{" "}
          {/* End conditional rendering for user */}
        </DropdownMenu>

        {/* --- Help Dropdown --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full", textColor, hoverTextColor, hoverBgColor)}
              aria-label="Help and support">
              <HelpCircle className={cn("h-5 w-5", iconColor)} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn("w-56 border", dropdownBgColor, dropdownBorderColor)}>
            <DropdownMenuLabel className={dropdownLabelColor}>Help & Support</DropdownMenuLabel>
            <DropdownMenuSeparator className={dropdownSeparatorColor} />
            {/* Use <a> for external links, Link for internal */}
            <DropdownMenuItem
              asChild
              className={cn(dropdownTextColor, dropdownFocusBgColor)}>
              <a
                href="/docs"
                target="_blank"
                rel="noopener noreferrer">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Documentation</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className={cn(dropdownTextColor, dropdownFocusBgColor)}>
              <a
                href="/support"
                target="_blank"
                rel="noopener noreferrer">
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Contact Support</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className={cn(dropdownTextColor, dropdownFocusBgColor)}>
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

        {/* Vertical Separator */}
        <div className={cn("h-6 w-px hidden md:block mx-1", separatorColor)}></div>

        {/* --- User Dropdown --- */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            disabled={isAuthLoading} // Disable trigger only while auth is loading
          >
            <div
              className={cn(
                "flex items-center gap-2 cursor-pointer rounded-md p-1 transition-colors",
                hoverBgColor // Apply hover background
              )}
              aria-label="User menu">
              {/* Loading State */}
              {isAuthLoading ? (
                <>
                  <Skeleton className={cn("h-8 w-8 rounded-full", separatorColor)} />
                  <Skeleton className={cn("h-4 w-16 hidden sm:block", separatorColor)} />
                </>
              ) : user ? ( // Logged In State
                <>
                  <Avatar className={cn("h-8 w-8 border", borderColor)}>
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={getDisplayName()}
                    />
                    <AvatarFallback
                      className={cn(
                        "text-xs",
                        bgColor, // Use main background for fallback
                        textColor // Use main text color
                      )}>
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className={cn("text-sm font-medium hidden sm:inline", textColor)}>{getDisplayName()}</span>
                </>
              ) : (
                // Logged Out State (Optional: Show Sign In)
                <Button
                  variant="ghost"
                  className={cn("text-sm font-medium h-auto px-2 py-1", textColor, hoverTextColor)}
                  onClick={() => router.push("/login")} // Redirect to login page
                >
                  Sign In
                </Button>
              )}
            </div>
          </DropdownMenuTrigger>

          {/* Content is only rendered if user is logged in */}
          {user && (
            <DropdownMenuContent
              align="end"
              className={cn("w-56 border", dropdownBgColor, dropdownBorderColor)}>
              {/* User Info Header */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className={cn("text-sm font-medium leading-none", dropdownLabelColor)}>{getDisplayName()}</p>
                  <p className={cn("text-xs leading-none", dropdownMutedColor)}>{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className={dropdownSeparatorColor} />
              {/* Navigation Items */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className={cn(dropdownTextColor, dropdownFocusBgColor)}>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className={cn(dropdownTextColor, dropdownFocusBgColor)}>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className={cn(dropdownTextColor, dropdownFocusBgColor)}>
                  <Link href="/dashboard/billing">
                    <Settings className="mr-2 h-4 w-4" /> {/* TODO: Replace with a billing icon */}
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className={dropdownSeparatorColor} />
              {/* Logout Item */}
              <DropdownMenuItem
                onClick={handleLogout}
                className={cn(
                  "text-red-600 dark:text-red-500",
                  "focus:bg-red-100 dark:focus:bg-red-900/50",
                  "focus:text-red-700 dark:focus:text-red-400"
                )}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>{" "}
      {/* End Right side */}
    </div> // End TopBar container div
  ); // <-- Closing parenthesis for return
} // <-- Closing brace for the TopBar function component
