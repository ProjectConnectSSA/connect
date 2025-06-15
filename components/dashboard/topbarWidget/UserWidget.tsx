// components/layout/topbar/topbarWidgets/UserWidget.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  textColor,
  hoverTextColor,
  bgColor as mainBgColor, // Renamed to avoid conflict with local bgColor usage
  borderColor as mainBorderColor, // Renamed
  hoverBgColor,
  separatorColor,
  dropdownBgColor,
  dropdownBorderColor,
  dropdownSeparatorColor,
  dropdownFocusBgColor,
  dropdownTextColor,
  dropdownLabelColor,
  dropdownMutedColor,
} from "./styles";

interface UserWidgetProps {
  user: any; // Consider defining a more specific user type
  isAuthLoading: boolean;
  handleLogout: () => Promise<void>;
  getInitials: (email?: string | null) => string;
  getDisplayName: () => string;
}

export function UserWidget({ user, isAuthLoading, handleLogout, getInitials, getDisplayName }: UserWidgetProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={isAuthLoading}>
        <div
          className={cn("flex items-center gap-2 cursor-pointer rounded-md p-1 transition-colors", hoverBgColor)}
          aria-label="User menu">
          {isAuthLoading ? (
            <>
              <Skeleton className={cn("h-8 w-8 rounded-full", separatorColor)} />
              <Skeleton className={cn("h-4 w-16 hidden sm:block", separatorColor)} />
            </>
          ) : user ? (
            <>
              <Avatar className={cn("h-8 w-8 border", mainBorderColor)}>
                <AvatarImage
                  src={user.user_metadata?.avatar_url}
                  alt={getDisplayName()}
                />
                <AvatarFallback className={cn("text-xs", mainBgColor, textColor)}>{getInitials(user.email)}</AvatarFallback>
              </Avatar>
              <span className={cn("text-sm font-medium hidden sm:inline", textColor)}>{getDisplayName()}</span>
            </>
          ) : (
            <Button
              variant="ghost"
              className={cn("text-sm font-medium h-auto px-2 py-1", textColor, hoverTextColor)}
              onClick={() => router.push("/login")}>
              Sign In
            </Button>
          )}
        </div>
      </DropdownMenuTrigger>

      {user && (
        <DropdownMenuContent
          align="end"
          className={cn("w-56 border", dropdownBgColor, dropdownBorderColor)}>
          {/* Content Starts Here */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className={cn("text-sm font-medium leading-none", dropdownLabelColor)}>{getDisplayName()}</p>
              <p className={cn("text-xs leading-none", dropdownMutedColor)}>{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className={dropdownSeparatorColor} />
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
          {/* Content Ends Here */}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
