"use client";

import React from "react";
import { X, MailCheck, BarChart, FileWarning, UserPlus, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import TimeAgo from "react-timeago";
import { Notification } from "@/app/types/notification";
import { cn } from "@/lib/utils";

const iconMap: { [key: string]: React.ElementType } = {
  MailCheck,
  BarChart,
  FileWarning,
  UserPlus,
  default: AlertTriangle,
};

interface NotificationSidebarProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ notifications, isOpen, onClose, onMarkAllRead, onMarkRead, onDelete }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn("fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
        onClick={onClose}
      />

      {/* Sidebar drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}>
        {/* Header with title, mark all, close */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">All Notifications</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onMarkAllRead}
              className="text-sm font-medium text-blue-600 hover:underline">
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="p-1">
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">No notifications</p>
          ) : (
            notifications.map((n) => {
              const IconComponent = iconMap[n.icon || "default"] || iconMap.default;
              const isUnread = !n.read_at;
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 p-2 rounded-md",
                    isUnread && "bg-blue-50 dark:bg-gray-800/50",
                    "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}>
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full",
                      isUnread ? "bg-blue-100 dark:bg-blue-900/50" : "bg-gray-100 dark:bg-gray-700"
                    )}>
                    <IconComponent className={cn("h-4 w-4", n.icon_color || "text-gray-600 dark:text-gray-300")} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-sm truncate",
                        isUnread ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                      )}>
                      {n.title}
                    </p>
                    {n.description && <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">{n.description}</p>}
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                      <TimeAgo date={n.created_at} />
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center space-y-1">
                    <button
                      onClick={() => onMarkRead(n.id)}
                      disabled={!isUnread}
                      className={cn("p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700", !isUnread && "opacity-50 cursor-not-allowed")}>
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </button>
                    <button
                      onClick={() => onDelete(n.id)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

// --- Integration in TopBar (components/dashboard/topbar.tsx) ---
// 1. Update import: import { NotificationSidebar } from '@/components/dashboard/NotificationSidebar';
// 2. Pass handlers:
// <NotificationSidebar
//   notifications={notifications}
//   isOpen={isSidebarOpen}
//   onClose={() => setIsSidebarOpen(false)}
//   onMarkAllRead={handleMarkAllRead}
//   onMarkRead={handleSingleMarkRead}
//   onDelete={handleDeleteNotification}
// />
