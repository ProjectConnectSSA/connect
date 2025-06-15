// components/layout/topbar/topbarWidgets/NotificationWidget.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, MailCheck, BarChart, FileWarning, UserPlus, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import TimeAgo from "react-timeago";
import { Notification } from "@/app/types/notification";
import {
  textColor,
  hoverTextColor,
  iconColor,
  hoverBgColor,
  dropdownBgColor,
  dropdownBorderColor,
  dropdownSeparatorColor,
  dropdownFocusBgColor,
  dropdownLabelColor,
  dropdownMutedColor,
} from "./styles";

// --- Notification Icon Mapping ---
const iconMap: { [key: string]: React.ElementType } = {
  MailCheck: MailCheck,
  BarChart: BarChart,
  FileWarning: FileWarning,
  UserPlus: UserPlus,
  default: AlertTriangle,
};

interface NotificationWidgetProps {
  user: any;
  isAuthLoading: boolean;
  notifications: Notification[];
  isNotificationsLoading: boolean;
  notificationError: string | null;
  hasUnread: boolean;
  handleMarkAllRead: () => Promise<void>;
  handleNotificationClick: (notification: Notification) => Promise<void>;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function NotificationWidget({
  user,
  isAuthLoading,
  notifications,
  isNotificationsLoading,
  notificationError,
  hasUnread,
  handleMarkAllRead,
  handleNotificationClick,
  setIsSidebarOpen,
}: NotificationWidgetProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative rounded-full", textColor, hoverTextColor, hoverBgColor)}
          aria-label="Notifications"
          disabled={isAuthLoading || !user}>
          {hasUnread && !isNotificationsLoading && (
            <span className={cn("absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-1", "ring-indigo-700 dark:ring-gray-950")} />
          )}
          <Bell className={cn("h-5 w-5", iconColor)} />
        </Button>
      </DropdownMenuTrigger>
      {user && (
        <DropdownMenuContent
          align="end"
          className={cn("w-80 md:w-96 border", dropdownBgColor, dropdownBorderColor)}>
          {/* Content Starts Here */}
          <DropdownMenuLabel className={cn("flex justify-between items-center px-2 py-1.5 text-sm font-medium", dropdownLabelColor)}>
            <span>Notifications</span>
            {!isNotificationsLoading && notifications.length > 0 && hasUnread && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-blue-600 dark:text-blue-400"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent dropdown from closing
                  handleMarkAllRead();
                }}>
                Mark all as read
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className={dropdownSeparatorColor} />

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
              <div className={cn("px-2 py-6 text-center text-sm", dropdownMutedColor)}>No new notifications</div>
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
                      dropdownFocusBgColor,
                      isUnread && "bg-blue-50 dark:bg-gray-800/50"
                    )}
                    onClick={() => handleNotificationClick(notification)}>
                    <div
                      className={cn(
                        "flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center mt-0.5",
                        !isUnread ? "bg-gray-100 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-900/50"
                      )}>
                      <IconComponent className={cn("h-4 w-4", notification.icon_color || "text-gray-500 dark:text-gray-400")} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={cn("text-sm font-medium truncate", dropdownLabelColor, isUnread && "font-semibold")}>{notification.title}</p>
                      {notification.description && <p className={cn("text-xs line-clamp-2", dropdownMutedColor)}>{notification.description}</p>}
                      <p className={cn("text-xs mt-0.5", dropdownMutedColor)}>
                        <TimeAgo date={notification.created_at} />
                      </p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
          </div>

          {!isNotificationsLoading && !notificationError && notifications.length > 0 && (
            <>
              <DropdownMenuSeparator className={dropdownSeparatorColor} />
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // Prevent dropdown closing
                  setIsSidebarOpen(true);
                }}
                className={cn(
                  "justify-center py-2 cursor-pointer text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
                  dropdownFocusBgColor
                )}>
                View all notifications
              </DropdownMenuItem>
            </>
          )}
          {/* Content Ends Here */}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
