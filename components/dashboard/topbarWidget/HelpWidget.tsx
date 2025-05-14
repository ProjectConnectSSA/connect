// components/layout/topbar/topbarWidgets/HelpWidget.tsx
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
import { HelpCircle, BookOpen, LifeBuoy, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  textColor,
  hoverTextColor,
  iconColor,
  hoverBgColor,
  dropdownBgColor,
  dropdownBorderColor,
  dropdownSeparatorColor,
  dropdownFocusBgColor,
  dropdownTextColor,
  dropdownLabelColor,
} from "./styles";

export function HelpWidget() {
  return (
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
  );
}
