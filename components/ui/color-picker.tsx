"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  // Common web colors for quick selection
  const presetColors = [
    "#000000",
    "#ffffff",
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#607d8b",
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Color input with hex display */}
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-md border border-gray-200"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-md border border-input"
        />
      </div>

      {/* Preset colors */}
      <div className="grid grid-cols-10 gap-1 mt-2">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            type="button"
            onClick={() => onChange(presetColor)}
            className={cn(
              "h-6 w-6 rounded-md border border-gray-200 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1",
              color === presetColor && "ring-2 ring-primary ring-offset-1"
            )}
            style={{ backgroundColor: presetColor }}
            title={presetColor}
          />
        ))}
      </div>
    </div>
  );
}
